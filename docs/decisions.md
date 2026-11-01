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

- **Status:** accepted.
- **Context:** existing contact functionality sends directly through EmailJS and uses public identifiers.
- **Decision:** keep the existing provider integration, load its identifiers from `NEXT_PUBLIC_*`, add client-side spam friction, and document provider-side origin/quota controls as required.
- **Alternatives:** introduce a server proxy, database, captcha vendor, or authentication. Those require infrastructure and operational setup not justified by this static portfolio.
- **Consequences:** identifiers are public, client checks are bypassable, and provider-level restrictions remain an owner responsibility.
