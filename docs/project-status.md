# Project status

_Updated 2026-11-01._

## Completed in this migration

- Next.js App Router routes for home, about, projects, and contact.
- Shared layout, Next navigation, theme/toast providers, and a one-time welcome animation.
- Vite and React Router build/runtime removal.
- Project response/URL normalization, React text escaping coverage, and contact-form client-side abuse friction.
- Production security headers/CSP, Dependabot, CI, CodeQL workflow, security reporting policy, and documentation.
- Local lint, typecheck, production build, route/header smoke tests, unit tests, high/critical audit gate, and production dependency audit pass.
- Desktop and narrow-mobile browser checks cover all four routes; navigation fits without horizontal overflow.
- Contact has a page-level H1, the LinkedIn footer icon has the correct accessible name, and routes now expose distinct titles and Open Graph/Twitter descriptions.
- Welcome animation is shown at most once per browser tab session; it does not block pointer interaction and respects reduced-motion preferences.
- Shepherd tours, their CSS, and their dependencies have been removed.
- Verified the deployed Vercel origin from the GitHub repository homepage; canonical URLs, sitemap, and robots directives use that origin.
- Corrected home-page project cards to link only to verified owner repositories; the GitHub project list omits blank descriptions and displays available language metadata.
- Added a curated-project fallback and retry/profile links when GitHub's public API rate limit prevents loading the full project list.
- Added a server-side GitHub repositories endpoint with optional `GITHUB_TOKEN`, one-hour response caching, and tests for authenticated/unauthenticated requests and upstream rate-limit failures.
- Added Vercel Speed Insights integration and updated the supported Node.js engine range to remove end-of-life Node 20.
- Replaced browser EmailJS delivery with a Resend/Upstash email-verification flow and a server-enforced two-messages-per-verified-email daily quota.

## In progress / owner actions

- Add an expiring, no-repository-permissions GitHub fine-grained token as the Vercel `GITHUB_TOKEN` variable to enable the higher authenticated rate limit.
- Verify `monikportfolio.tech` in Resend, add its requested DNS records, and add the Resend, contact-recipient, and Upstash variables to Vercel Preview/Production before enabling live contact delivery.
- Disable the old EmailJS contact template so existing deployments or direct public-key requests cannot bypass the new server-side quota.
- Change Vercel's project Node.js default from discontinued 20.x to 24.x; the existing production override is 26.x.
- Deploy the Speed Insights integration and confirm events appear in the Vercel dashboard.

## Known limitations and accepted risks

- Contact APIs require an email OTP and enforce a shared two-message-per-day quota; abuse remains bounded by provider free-tier caps and rate limits.
- Without `GITHUB_TOKEN`, server-side GitHub API calls still use the unauthenticated rate limit; the Projects page shows curated projects when that limit is exhausted.
- Inline styles remain allowed by `style-src` to preserve existing UI behavior.
- GitHub Actions are version-tagged rather than pinned to immutable commit SHAs.
- Full `npm audit` reports five moderate findings in the ESLint/minimatch development-tooling chain; `npm audit --omit=dev` reports none. Automatic fixes propose an incompatible downgrade, so no forced fix was applied.
- There is no user account system or relational database; Upstash Redis stores short-lived verification state and rate-limit counters.
- The production hostname returned HTTP 200 over HTTPS and Vercel sent `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` on 2026-11-01. The app-level `ENABLE_HSTS` flag is separate; Vercel's edge already supplies HSTS.
- Deployment environment values are controlled by Vercel and must be configured separately from this repository.

## Next priorities

1. Configure the Resend sending domain, Vercel server-only environment variables, and disable the legacy EmailJS template; then test OTP and daily-limit behavior on the deployed site.
2. Review the moderate development-tooling audit findings and upgrade through compatible upstream releases.
3. Verify CodeQL runs after changes to the security workflow or source.
4. Verify Vercel TLS, then enable HSTS only if the existing edge header changes.
