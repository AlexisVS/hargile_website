# Email Architecture — Scaleway TEM + Dedicated Worker + Postgres on Kubernetes

> Planning doc. Decisions locked; no code written yet. Two email streams kept
> deliberately separate so a bulk-send reputation hit can never poison real
> business mail (`info@` / `charles@hargile.be`).

## Context (as of writing)

- **Site:** `hargile.be`, Next.js 15 (`output: standalone`), runs as Docker image on a **Kubernetes cluster**.
- **Secrets:** injected as runtime env vars (Dockerfile bakes nothing but the public `NEXT_PUBLIC_SITE_URL` build arg). Production config comes from a **K8s Secret**, not an `.env` file.
- **Existing subdomains:** e.g. `portfolio.hargile.be` — subdomain pattern already in use.
- **Current contact form:** `src/app/api/contact/route.js`, currently on Gmail SMTP (nodemailer) as a stopgap after SendGrid ran out of credits.
- **Vendor choice:** **Scaleway TEM** (Paris / `fr-par`, RGPD-native) — chosen over Resend/SES for EU data residency.

## The core principle: two separate streams

Never mix these on the same domain reputation.

| Stream | Purpose | Sending domain | Volume |
|--------|---------|----------------|--------|
| **Transactional** | Contact-form replies, receipts, real 1:1 mail | `hargile.be` (or `tx.hargile.be`) | Low, trusted |
| **AI-agent bulk** | Agent-generated outreach at scale | **`send.hargile.be`** (separate verified domain) | Thousands |

Isolating bulk on `send.hargile.be` means a reputation hit there **cannot** affect deliverability of `info@` / `charles@hargile.be`. This isolation matters more than the vendor choice.

## System diagram

```
┌─────────────────────┐     Transactional (contact form)
│  Next.js web pods   │────────────────────────────────────►  Scaleway TEM
│  (N replicas)       │                                        (from info@hargile.be)
│                     │
│  AI agents ─────────┼──► enqueue job ──► ┌──────────────┐
└─────────────────────┘                    │   Queue      │
                                           │ (Redis/NATS) │
                                           └──────┬───────┘
                                                  │ pull
                                    ┌─────────────▼──────────────┐
                                    │  Bulk worker Deployment    │
                                    │  (controlled replicas)     │──► Scaleway TEM
                                    │  • rate limiter            │    (from agent@send.hargile.be)
                                    │  • suppression check       │
                                    │  • retry / bounce handling │
                                    └─────────────┬──────────────┘
                                                  │
                                    ┌─────────────▼──────────────┐
                                    │  PostgreSQL (fr-par)       │
                                    │  • suppression_list        │
                                    │  • consent_records (RGPD)  │
                                    │  • email_jobs / send_log   │
                                    │  • rate_limit_state        │
                                    └────────────────────────────┘
```

## Why each piece

- **Web pods only enqueue** bulk jobs — never send them. This avoids the replicated-pod rate-limit problem entirely (3 replicas each thinking they can send 100/min = 300/min actual, blowing the limit).
- **Worker is a separate Deployment** with its own replica count (**start at 1**, scale deliberately). It owns the rate limiter, so total send rate is controlled regardless of how the web app scales.
- **Postgres is the source of truth** for suppression + consent (RGPD-mandatory durable audit) and the job log — so a pod restart resumes exactly where it left off (at-least-once delivery with a dedup key).

## Kubernetes specifics

### Secrets: K8s Secret → env vars

Dockerfile already reads everything from runtime env, so **no image change needed**. Secret lives in the **infra/deploy repo**, not the app repo.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: hargile-email
  namespace: <your-ns>
type: Opaque
stringData:
  SCW_TEM_API_KEY: "<IAM key, TEM-scoped>"
  SCW_TEM_PROJECT_ID: "<project id>"
  CONTACT_FORM_FROM_EMAIL: "info@hargile.be"
  CONTACT_FORM_TO_EMAIL: "charles@hargile.be"
  BULK_FROM_EMAIL: "agent@send.hargile.be"
```

Reference it in the Deployment:

```yaml
    envFrom:
      - secretRef:
          name: hargile-email
```

> ⚠️ **Don't commit the Secret with real values.** Use **Sealed Secrets** or **External Secrets Operator** (pulling from Scaleway Secret Manager or Vault) so the encrypted form is safe in git. Pick whichever is already in the cluster.

### Shared state must be external

Pods are replicated and ephemeral, so rate-limit counters, suppression list, and send log **cannot live in pod memory** — they live in Postgres (see schema).

## Scaleway TEM setup

1. Console → **Transactional Email** → add `hargile.be` **and** `send.hargile.be` as **two separate verified domains**.
2. Add the DNS records Scaleway generates (per domain), at the DNS host for hargile.be:
   - **SPF:** `v=spf1 include:_spf.tem.scaleway.com ~all`
   - **DKIM:** the unique TXT key Scaleway generates per domain
   - **DMARC:** start soft — `v=DMARC1; p=none; rua=mailto:dmarc@hargile.be` — tighten to `p=quarantine` after ~1 week of clean reports
   - **MX:** their verification record
3. Generate an **IAM API key scoped to TEM only** (not a full-account key).

DNS verification can take a few hours to propagate.

## Postgres schema (RGPD-critical)

Provision **Scaleway Managed PostgreSQL** in `fr-par`.

```sql
-- Every address you may NOT email. Checked before every single send.
CREATE TABLE suppression_list (
  email        TEXT PRIMARY KEY,
  reason       TEXT NOT NULL,        -- 'unsubscribe' | 'bounce' | 'complaint' | 'manual'
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Lawful-basis record per recipient (RGPD Art. 6).
CREATE TABLE consent_records (
  email        TEXT NOT NULL,
  basis        TEXT NOT NULL,        -- 'consent' | 'legitimate_interest'
  source       TEXT,                 -- where/how obtained
  captured_at  TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (email, captured_at)
);

-- Job queue mirror + audit log. Dedup key makes retries idempotent.
CREATE TABLE email_jobs (
  id           UUID PRIMARY KEY,
  dedup_key    TEXT UNIQUE NOT NULL,
  to_email     TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending', -- pending|sent|failed|suppressed
  attempts     INT  DEFAULT 0,
  tem_msg_id   TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  sent_at      TIMESTAMPTZ
);
```

## Repo layout

**This repo (`hargile_website`):**
```
src/lib/email/
  client.js         # Scaleway TEM fetch wrapper (shared)
  transactional.js  # sendTransactional() — used by contact route
  enqueue.js        # AI agents call this to queue bulk jobs
src/app/api/contact/route.js   # swap nodemailer → sendTransactional()
```

**Separate worker (own image/deploy — its own repo or a `/worker` dir):**
```
worker/
  index.js          # queue consumer loop
  rate-limiter.js   # token bucket, backed by DB/Redis
  suppression.js    # check + record
  bounce-webhook.js # Scaleway TEM bounce/complaint callbacks → suppression_list
```

**Infra/deploy repo:** K8s Secret (sealed), worker Deployment, queue, Postgres connection config.

## Env vars (replaces the current SMTP block)

```
SCW_TEM_API_KEY=...            # IAM key, TEM-scoped
SCW_TEM_PROJECT_ID=...
CONTACT_FORM_FROM_EMAIL=info@hargile.be
CONTACT_FORM_TO_EMAIL=charles@hargile.be
BULK_FROM_EMAIL=agent@send.hargile.be
```

## RGPD obligations for the bulk stream (non-optional)

- **Lawful basis** per recipient (consent or legitimate interest), documented in `consent_records`.
- **One-click unsubscribe** header + link on every bulk email.
- **Suppression list** honored before every send.
- Keep all data in EU region (`fr-par`).

## Rollout order (each step independently shippable)

1. **Scaleway TEM: verify `hargile.be`** + DNS → **swap contact form to `sendTransactional()`.** Small, low-risk, proves the pipeline. *Only step touching this repo's existing code.*
   - Keep Gmail SMTP live until TEM domain verification passes, then flip → zero downtime.
2. **Provision Postgres** (Scaleway Managed, fr-par) + create schema.
3. **Verify `send.hargile.be`** as a separate TEM domain + DNS.
4. **Build the worker** + queue, wire `enqueue.js` into agents.
5. **Warm up** `send.hargile.be`: ~50/day ramping over 2–3 weeks before full volume. Cold-blasting thousands day one gets you blocked.

## Open questions to resolve before coding

- **Sealed Secrets vs. External Secrets Operator** — which is in the cluster already?
- **Queue tech** — Redis / NATS / Scaleway Messaging (SQS-compatible)?
- **Who controls DNS for hargile.be** (to apply SPF/DKIM/DMARC)?
- **Confirm** keeping Gmail live until TEM verification passes (recommended).

## Vendor comparison (for reference)

| | Resend | **Scaleway TEM** (chosen) | Amazon SES |
|---|---|---|---|
| DX / setup | Best-in-class | Basic API, functional | Powerful but clunky |
| Cost | 3k/mo free, then $20/mo/50k | ~€0.25/1k | ~$0.10/1k at scale |
| EU residency (RGPD) | US co. (EU options) | **French/EU-native** ✅ | AWS EU regions |
| Best for | Transactional + moderate vol | EU-first bulk | Massive scale, self-tuned |
