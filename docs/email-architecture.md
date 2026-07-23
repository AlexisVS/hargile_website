# Email Architecture — Resend, two isolated streams

> Reflects the **live** state as of 2026-07-24 (rewritten from the original
> Scaleway/`.be` planning draft, which was superseded).
>
> Two email streams are kept deliberately separate so a bulk-send reputation
> hit can never poison real business mail (`charles@hargile.com`).

## Provider: Resend (single account)

- **Vendor: Resend** — chosen over Scaleway/SES (see HARG-12). One account holds
  both the site key and the SEO-workspace key.
- The earlier plan (Scaleway TEM, `fr-par`) is **abandoned**. The two-domain
  split and the DNS work below are provider-agnostic and stay valid.
- DNS for `hargile.com` is at **Hostinger** (`ns1/2.dns-parking.com`), managed
  manually in the hPanel. No registrar change needed.

## The core principle: two separate streams

Never mix these on the same domain reputation.

| Stream | Purpose | Sending domain | Volume | Status |
|--------|---------|----------------|--------|--------|
| **Transactional** | Contact-form replies, real 1:1 mail | `hargile.com` | Low, trusted | ✅ **Live** |
| **Bulk prospection** | AI-agent outreach at scale (Workflow Audit) | **`send.hargile.com`** | High | ⏳ Blocked on HARG-71 |

Isolating bulk on `send.hargile.com` means a reputation hit there **cannot**
affect deliverability of `charles@hargile.com`.

## Stream 1 — Transactional (contact form) ✅ LIVE

The public contact form sends via Resend on the verified `hargile.com` domain.

- **Code**: `src/app/api/contact/route.js` — uses the `resend` SDK
  (`resend.emails.send({ from, to, replyTo })`).
- **Package**: `resend@^6.17.2` (no SendGrid, no nodemailer).
- **Env vars** (injected at runtime from a K8s Secret, not baked into the image):

  ```
  RESEND_API_KEY           # Resend account API key
  CONTACT_FORM_FROM_EMAIL  # must belong to a Resend-verified domain (hargile.com)
  CONTACT_FORM_TO_EMAIL    # inbox that receives submissions (charles.dl@hargile.com)
  ```

- **Secret location**: `hargile-website-secrets` SealedSecret in the
  `hargile-infra` repo (`apps/hargile-website/sealed-secret.yaml`), injected via
  `envFrom: secretRef`. Domain `hargile.com` is already verified in Resend
  (DKIM posted), so this flow is fully operational.

> History: contact form was SendGrid → Gmail SMTP (stopgap after SendGrid
> credits ran out) → **Resend** (current). The infra secret's old `SENDGRID_*`
> keys have been replaced by the three `RESEND_*`/`CONTACT_FORM_*` keys above.

## Stream 2 — Bulk prospection ⏳ (blocked — HARG-71)

Bulk outreach is driven by the **Workflow Audit** pipeline (HARG-8): leads →
ChatSEO audit → personalised email via Resend. Sending must use the **separate**
`send.hargile.com` domain to protect the transactional reputation.

**Blocker (HARG-71, Urgent):** Resend **free plan allows only 1 verified domain**,
already used by `hargile.com`. To add `send.hargile.com`, a decision is needed:

1. **Upgrade Resend Pro (~$20/mo)** — multiple domains + higher quota (50k/mo).
2. **2nd free Resend account** dedicated to prospection (100/day, 3k/mo).

Once decided, the Resend MCP (`https://mcp.resend.com/mcp`) creates the domain
and emits the exact DNS records to post.

### DNS to post for `send.hargile.com` (in Hostinger)

Resend generates these per domain (DKIM key is account-specific):

- **DKIM**: CNAME record(s) provided by Resend
- **Return-Path / MAIL FROM**: MX + TXT (SPF) on the `send` subdomain
- **DMARC**: `v=DMARC1; p=none; rua=mailto:dmarc@hargile.com` — tighten to
  `p=quarantine` after ~1 week of clean reports

The apex `*.hargile.com` wildcard A record (→ KS-5 cluster) does **not** interfere
— Resend only uses TXT/CNAME/MX on the `send.` subdomain. Propagation: a few hours.

Then set `RESEND_FROM` (e.g. `charles@send.hargile.com`) and **warm up** ~50/day
over 2–3 weeks before full volume.

## RGPD obligations for the bulk stream (non-optional)

- **Lawful basis** per recipient — B2B prospection to professional addresses is
  opt-out in Belgium (see HARG-73). Documented per lead.
- **One-click unsubscribe** header + link on every bulk email (HARG-72).
- **Suppression list** honoured before every send.
- **Max 2 relances** per lead (HARG-75).
- Keep prospection data in EU region.

## References

- **HARG-8** — Workflow Audit (prospection pipeline)
- **HARG-71** — Verify `send.hargile.com` in Resend (+ DNS) — *this blocker*
- **HARG-72** — One-click unsubscribe endpoint (RGPD)
- **HARG-73** — RGPD framework for prospection
- **HARG-12** — Resend vs Scaleway decision (→ Resend)
- Contact-form secret wiring: `hargile-infra` PR #118 (later migrated to Resend keys)
