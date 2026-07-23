// app/api/unsubscribe/route.js
//
// Opt-out endpoint for prospection emails (RGPD right to object + RFC 8058
// one-click). The mail's List-Unsubscribe header and body link both point here:
//
//   https://hargile.com/api/unsubscribe?t=TOKEN
//
// GET  → confirmation page (link clicked in the mail body)
// POST → records the opt-out (browser form, or the mail client's automatic
//        one-click POST with body "List-Unsubscribe=One-Click")
//
// The token is base64url(email) + "." + base64url(HMAC-SHA256(email)) signed
// with UNSUBSCRIBE_SECRET — the same secret used by the workspace script that
// generates the links (chatseo-workspace/scripts/make-unsubscribe-link.mjs).
// No token, no action: prevents forged opt-outs and email enumeration.
//
// Storage: the durable target is Dorian's Postgres suppression_list (posted to
// SUPPRESSION_API_URL when configured). Until it exists, every opt-out fires an
// alert email via Resend so nothing is ever lost. If NEITHER channel succeeds
// we answer 500 — losing an opt-out is worse than asking the client to retry.

import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { Resend } from "resend";

const SECRET = process.env.UNSUBSCRIBE_SECRET;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ALERT_TO =
  process.env.UNSUBSCRIBE_ALERT_TO || process.env.CONTACT_FORM_TO_EMAIL;
const ALERT_FROM = process.env.CONTACT_FORM_FROM_EMAIL;
const SUPPRESSION_API_URL = process.env.SUPPRESSION_API_URL;
const SUPPRESSION_API_KEY = process.env.SUPPRESSION_API_KEY;

const b64url = (buf) => Buffer.from(buf).toString("base64url");

function verifyToken(token) {
  if (!SECRET) {
    console.error(
      // IMPORTANT: Keep for startup diagnostics
      "CRITICAL WARNING (API /api/unsubscribe): UNSUBSCRIBE_SECRET not set. Opt-out links WILL FAIL."
    );
    return null;
  }
  if (!token || typeof token !== "string" || token.length > 512) return null;
  const [emailPart, sigPart] = token.split(".");
  if (!emailPart || !sigPart) return null;
  let email;
  try {
    email = Buffer.from(emailPart, "base64url").toString("utf8");
  } catch {
    return null;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  const expected = b64url(
    crypto.createHmac("sha256", SECRET).update(email.toLowerCase()).digest()
  );
  const a = Buffer.from(sigPart);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return email.toLowerCase();
}

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const page = (title, body, status = 200) =>
  new NextResponse(
    `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)} — HARGILE</title>
    <style>
      body{font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;margin:0;padding:24px;background:#f4f4f7;color:#333}
      .card{max-width:480px;margin:40px auto;padding:32px;background:#fff;border-radius:8px;border:1px solid #e1e1e6;box-shadow:0 4px 15px rgba(0,0,0,.08)}
      h1{font-size:20px;color:#2c3e50;margin:0 0 16px}
      p{font-size:15px;line-height:1.6;color:#555}
      button{background:#2c3e50;color:#fff;border:none;border-radius:6px;padding:12px 24px;font-size:15px;cursor:pointer}
      a{color:#3498db;text-decoration:none}
      .footer{margin-top:24px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#888}
    </style></head><body><div class="card"><h1>${escapeHtml(title)}</h1>${body}
    <div class="footer">HARGILE SRL — Tech Studio · <a href="mailto:charles@hargile.com">charles@hargile.com</a></div>
    </div></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );

const invalidPage = () =>
  page(
    "Lien invalide",
    `<p>Ce lien de désinscription est invalide ou incomplet.</p>
     <p>Pour ne plus recevoir nos messages, écrivez simplement à
     <a href="mailto:charles@hargile.com?subject=D%C3%A9sinscription">charles@hargile.com</a>
     — votre demande sera traitée immédiatement.</p>`
  );

// Records the opt-out. Returns true as soon as ONE durable channel succeeded.
async function recordOptOut(email, source) {
  // IMPORTANT: Keep — pod logs are the last-resort trace of every opt-out.
  console.log(`[API /api/unsubscribe] opt-out: ${email} (${source})`);
  let recorded = false;

  if (SUPPRESSION_API_URL) {
    try {
      const res = await fetch(SUPPRESSION_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(SUPPRESSION_API_KEY
            ? { Authorization: `Bearer ${SUPPRESSION_API_KEY}` }
            : {}),
        },
        body: JSON.stringify({ email, reason: "unsubscribe", source }),
      });
      recorded = res.ok;
      if (!res.ok)
        console.error(
          `[API /api/unsubscribe] suppression API answered ${res.status}`
        );
    } catch (error) {
      console.error("[API /api/unsubscribe] suppression API error:", error);
    }
  }

  if (RESEND_API_KEY && ALERT_FROM && ALERT_TO) {
    try {
      const resend = new Resend(RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: `Désinscription prospection <${ALERT_FROM}>`,
        to: [ALERT_TO],
        subject: `Désinscription : ${email}`,
        text: `${email} s'est désinscrit de la prospection (${source}, ${new Date().toISOString()}).\n\nÀ reporter dans la suppression_list — ne plus JAMAIS contacter cette adresse.`,
      });
      if (error) {
        console.error("[API /api/unsubscribe] Resend alert error:", error);
      } else {
        recorded = true;
      }
    } catch (error) {
      console.error("[API /api/unsubscribe] Resend alert error:", error);
    }
  }

  return recorded;
}

export async function GET(req) {
  const token = new URL(req.url).searchParams.get("t");
  const email = verifyToken(token);
  if (!email) return invalidPage();

  return page(
    "Se désinscrire",
    `<p>Ne plus jamais recevoir de message de notre part à l'adresse
     <strong>${escapeHtml(email)}</strong> ?</p>
     <form method="POST" action="/api/unsubscribe?t=${encodeURIComponent(token)}">
       <input type="hidden" name="confirm" value="1">
       <button type="submit">Confirmer la désinscription</button>
     </form>`
  );
}

export async function POST(req) {
  const token = new URL(req.url).searchParams.get("t");
  const email = verifyToken(token);
  if (!email)
    return NextResponse.json({ success: false }, { status: 400 });

  // One-click (RFC 8058): the mail client POSTs "List-Unsubscribe=One-Click".
  const contentType = req.headers.get("content-type") || "";
  let source = "form";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const body = await req.text().catch(() => "");
    if (body.includes("List-Unsubscribe=One-Click")) source = "one-click";
  }

  const recorded = await recordOptOut(email, source);
  if (!recorded) {
    // Nothing durable captured the opt-out → make the caller retry.
    return source === "one-click"
      ? NextResponse.json({ success: false }, { status: 500 })
      : page(
          "Une erreur est survenue",
          `<p>Votre désinscription n'a pas pu être enregistrée automatiquement.</p>
           <p>Écrivez à <a href="mailto:charles@hargile.com?subject=D%C3%A9sinscription">charles@hargile.com</a>
           et votre demande sera traitée immédiatement.</p>`,
          500
        );
  }

  return source === "one-click"
    ? NextResponse.json({ success: true }, { status: 200 })
    : page(
        "Désinscription confirmée",
        `<p><strong>${escapeHtml(email)}</strong> ne recevra plus aucun message
         de prospection de notre part. Effet immédiat.</p>`
      );
}
