# Deployment

_Updated 2026-11-01._

## Hosting and production configuration

The repository is configured for a Next.js deployment on Vercel. No `vercel.json` rewrite is needed; the former SPA catch-all rewrite was removed so App Router paths resolve normally. Use Node.js 20.19+, 22.13+, or 24+ (CI uses Node 24).

The canonical origin and sitemap/robots URLs use the repository's configured homepage, `https://monikanchan-chatterjee-portfolio.vercel.app`. The live site returned HTTP 200 over HTTPS on 2026-11-01; verify that this remains the primary production domain if the Vercel domain changes.

Configure the `NEXT_PUBLIC_EMAILJS_*` values separately for Preview and Production if the contact form should work in those environments. They are browser-visible identifiers, not secrets. Do not add private credentials under a `NEXT_PUBLIC_` prefix.

## Build and verification

Vercel should install from `package-lock.json`, run `npm run build`, and serve the Next.js production output. CI additionally runs lint, TypeScript checks, dependency audit, unit tests, and a production HTTP smoke test. Do not deploy when a required release check fails.

## HTTPS and security headers

The production hostname served HTTPS and Vercel returned `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` on 2026-11-01. Vercel's edge supplies HSTS for the live deployment. The app-level `ENABLE_HSTS` flag separately enables HSTS and `upgrade-insecure-requests`; avoid enabling it redundantly without checking the resulting response. Other security headers and the nonce-based CSP are configured in the app.

Configure repository secret scanning/push protection in GitHub settings and review Vercel project access and environment separation. Their remote state cannot be inferred from local files.

## Rollback and recovery

Use the hosting provider's previous known-good deployment rollback after a failed release; redeploy the last verified commit if needed. Keep CI artifacts/logs free of credentials. Recheck `/`, `/me`, `/projects`, `/contact`, and response headers after rollback or domain changes.

## Unverified items

Vercel project settings, access controls, environment values, deployment permissions, and rollback procedure have not been inspected from this workspace. The public domain's HTTPS and HSTS response were verified; recheck after deployment.
