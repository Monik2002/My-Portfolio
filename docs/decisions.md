# Architecture decisions

_Updated 2026-11-01._

## ADR 0001 — Migrate the Vite SPA to Next.js App Router

- **Status:** accepted.
- **Context:** preserve the portfolio routes while moving to a server-rendered Next.js application.
- **Decision:** use App Router route modules in `src/app/`, adapt the existing page components, and keep client boundaries only where browser behavior is required.
- **Alternatives:** keep Vite/React Router, or wrap the SPA as one client-only Next page. The latter would preserve less server rendering and metadata value.
- **Consequences:** Vite configuration and catch-all rewrites were removed; browser-only dependencies were isolated; production rendering and nonce-based CSP now require the Next server/proxy.

## ADR 0002 — Nonce-based CSP and gated HSTS

- **Status:** accepted.
- **Context:** Next.js needs its inline bootstrap scripts authorized, while the existing design uses inline style attributes and Google Fonts.
- **Decision:** generate a per-request nonce in `src/proxy.ts`, prohibit un-nonced scripts in production, permit inline styles for current UI compatibility, and gate HSTS/HTTPS upgrades behind verified production TLS.
- **Alternatives:** no CSP, or broad `unsafe-inline` script policy. The latter weakens XSS defenses; a nonce was selected.
- **Consequences:** nonce CSP makes route responses request-specific; inline style allowance remains a documented limitation; HSTS is a deployment owner action.

## ADR 0003 — Keep EmailJS as a browser integration

- **Status:** superseded by ADR 0004.
- **Context:** existing contact functionality sends directly through EmailJS and uses public identifiers.
- **Decision:** keep the existing provider integration, load its identifiers from `NEXT_PUBLIC_*`, add client-side spam friction, and document provider-side origin/quota controls as required.
- **Alternatives:** introduce a server proxy, database, captcha vendor, or authentication.
- **Consequences:** identifiers are public and client checks are bypassable; direct EmailJS calls can bypass a site-side per-sender quota.

## ADR 0004 — Verify contact email and enforce quotas server-side

- **Status:** accepted.
- **Context:** a syntactically valid address does not prove mailbox access, and browser-side EmailJS sends cannot reliably enforce a daily sender cap.
- **Decision:** verify sender mailbox access using a one-time email code, send mail from a server-side Resend API key, and store rate limits, verification state, and a two-per-day quota in Upstash Redis. Gmail dot/plus aliases share quota; the daily window uses UTC.
- **Alternatives:** retain EmailJS and accept a bypassable limit, or add a different server-side email provider.
- **Consequences:** production contact delivery requires a verified sending domain and server-only Resend/Upstash environment variables; Redis failures fail closed.
