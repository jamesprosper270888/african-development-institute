# ADI Go-Live Runbook — prepared 12 Aug 2026

Context: Pam call at **1pm Wed 13 Aug**. Work session planned for the morning before it.
Goal: finished site live on the root domain, checkout connected, without breaking anything.

## Current state (verified 12 Aug)

- `africandevelopmentinstitute.com` (root) → GHL "We're Tuning Up" holding page. DNS: **Cloudflare**.
- `dev.africandevelopmentinstitute.com` → finished Next.js site, all 20 routes verified live (public pages 200, /app/* correctly redirect to /login).
- GHL: Stripe connected, checkout + thank-you pages already built, contacts + some pipelines.
- Vercel project `african-development-institute` (team `james-prospers-projects`), CLI authenticated.
- Production env vars MISSING: `RESEND_API_KEY` (no emails send), `GHL_WEBHOOK_URL` (site→GHL sync coded in `src/lib/ghl.ts` but inactive), Google Sheets creds. Telegram notifications ARE working.
- Stale env vars pointing at dev domain (WILL BREAK LOGINS if not updated at switch): `NEXT_PUBLIC_APP_URL`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_DOMAIN`.

## Order of operations (morning of 13 Aug)

### Step 1 — Checkout onto its own subdomain (zero risk to root)
1. GHL: Settings → Domains → add `pay.africandevelopmentinstitute.com`; move checkout + thank-you pages onto it.
2. Cloudflare: add the CNAME GHL provides (DNS-only/grey cloud if GHL does its own SSL).
3. Verify: checkout loads on pay. URL, Stripe element initializes, prices are £49 monthly / £499 annual **recurring**, thank-you page links back to the site.

### Step 2 — Membership page buttons
1. Add "Join Monthly £49" / "Join Annual £499" buttons on the pricing cards in
   `src/app/(marketing)/membership/page.tsx`, linking to the pay. checkout URLs.
2. Update "Membership is opening soon" copy if appropriate.
3. Deploy; verify on dev.

### Step 3 — Root domain switch
1. `vercel domains add africandevelopmentinstitute.com` (+ `www.`) to the project.
2. Cloudflare: repoint root record from GHL to Vercel per Vercel's instructions; www CNAME.
3. Update Vercel production env: `NEXT_PUBLIC_APP_URL=https://africandevelopmentinstitute.com`,
   `BETTER_AUTH_URL=https://africandevelopmentinstitute.com`, `NEXT_PUBLIC_DOMAIN=africandevelopmentinstitute.com`.
4. Redeploy. Test: homepage, a form submission (Telegram ping), login flow on the new domain, checkout buttons.
5. Keep `dev.` as staging.

### Step 4 — Switch on the rest
1. `RESEND_API_KEY` in Vercel production (confirmation emails). Verify domain in Resend for `hello@africandevelopmentinstitute.com`.
2. GHL: workflow with Inbound Webhook trigger → copy URL → `GHL_WEBHOOK_URL` in Vercel production. Payload fields: `first_name`, `last_name`, `email`, `source`, `role_org`, `motivation`, `message`.
3. Backfill: export existing Neon contacts (admin CSV export) → import into GHL.
4. Export/keep the holding page's "Notify Me" list (already in GHL — just confirm before the holding page goes dark).

### Housekeeping (soon after)
- Rotate the Telegram bot token and GitHub PAT sitting in plaintext in local `.env`.
- Commit the pending `.gitignore` change.
- September roadmap: events page, newsletter signup on the full site, auto-create member accounts from GHL payments (GHL workflow → site API).

## Talking points for the 1pm call
- WhatsApp audit answers already sent (full text in `whatsapp-draft-pam.md`).
- Two-site situation explained; go-live is a wiring job, not a build job.
- Budget ask: move GHL + hosting (~£16/mo Vercel, ~£12/yr domain) into ADI's funded budget — answers Pam's own "ADI-budgeted" question.
