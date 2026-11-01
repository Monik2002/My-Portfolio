# Deployment

_Updated 2026-11-01._

## Hosting and production configuration

The repository is configured for a Next.js deployment on Vercel. No `vercel.json` rewrite is needed; the former SPA catch-all rewrite was removed so App Router paths resolve normally. Use Node.js 22.13+ or 24+ (local Node and CI use Node 24). Node.js 20 reached end of life and should not be used. The Vercel project default was changed to 24.x on 2026-11-01; its production override is 26.x, which is also supported.

The canonical origin and sitemap/robots URLs use `https://monikportfolio.tech`. The custom domain returned HTTP 200 over HTTPS on 2026-11-01, and `www.monikportfolio.tech` permanently redirects to the apex domain. The stable `vercel.app` URL remains available as a fallback; a redirect from an expired custom domain cannot be guaranteed.

Vercel Web Analytics is enabled for the project and integrated in `src/app/layout.jsx`. It records page views after deployment. The Hobby plan includes up to 50,000 events per month; Vercel pauses collection after its free allowance is exceeded. Review current [Web Analytics limits and pricing](https://vercel.com/docs/analytics/limits-and-pricing) in Vercel before changing plans.

Vercel Speed Insights is integrated in `src/app/layout.jsx`. Its free tier includes 10,000 events per team every 30 days. Redeploy after adding the SDK; real-user data appears after visitors generate events.

The contact form requires a verified sending domain in Resend and these server-only Vercel variables in Preview and Production: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_RECIPIENT_EMAIL`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN`. Add DNS records from Resend to the domain's DNS provider and wait for verification before testing. The form emails a one-time code to the sender; successful code entry confirms access to that mailbox. EmailJS is not used: Resend sends both verification codes and contact messages server-side, while Upstash enforces rate limits and the daily quota. Keep the legacy EmailJS template disabled so it cannot bypass the server-side limits.

The OTP and message-submission APIs fail closed when Resend or Upstash is unavailable. Redis stores hashed email/IP keys, one-time code hashes (10-minute expiry), short-lived verification tokens (15-minute expiry), and a UTC-day counter. Gmail dot/plus aliases share a quota. Resend and Upstash free tiers have usage limits; review provider pricing before scaling.

To raise the Projects page's GitHub API quota, add an expiring fine-grained personal access token as the server-only `GITHUB_TOKEN` environment variable in Vercel Preview and Production. Public repository reads need no repository permissions. GitHub tokens and Vercel environment variables are available without purchasing a separate service; Vercel usage remains subject to the project's plan limits. Never paste the token into chat or commit it to the repository.

## Build and verification

Vercel should install from `package-lock.json`, run `npm run build`, and serve the Next.js production output. CI additionally runs lint, TypeScript checks, dependency audit, unit tests, and a production HTTP smoke test. Do not deploy when a required release check fails.

## HTTPS and security headers

The production hostname served HTTPS and Vercel returned `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` on 2026-11-01. Vercel's edge supplies HSTS for the live deployment. The app-level `ENABLE_HSTS` flag separately enables HSTS and `upgrade-insecure-requests`; avoid enabling it redundantly without checking the resulting response. Other security headers and the nonce-based CSP are configured in the app.

Configure repository secret scanning/push protection in GitHub settings and review Vercel project access and environment separation. Their remote state cannot be inferred from local files.

## Rollback and recovery

Use the hosting provider's previous known-good deployment rollback after a failed release; redeploy the last verified commit if needed. Keep CI artifacts/logs free of credentials. Recheck `/`, `/me`, `/projects`, `/contact`, and response headers after rollback or domain changes.

## Unverified items

Vercel access controls, environment values, deployment permissions, and rollback procedure have not been inspected from this workspace. The public domain's HTTPS and HSTS response were verified; recheck after deployment.
