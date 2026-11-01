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

## In progress / owner actions

- Add an expiring, no-repository-permissions GitHub fine-grained token as the Vercel `GITHUB_TOKEN` variable to enable the higher authenticated rate limit.
- Configure the EmailJS public identifiers in Vercel Production and enforce allowed origins, quotas, and provider-side abuse protection; a live test attempt found them missing, and no email was sent.

## Known limitations and accepted risks

- Contact spam friction is client-side and bypassable; no server proxy/rate limiter/CAPTCHA was added.
- Without `GITHUB_TOKEN`, server-side GitHub API calls still use the unauthenticated rate limit; the Projects page shows curated projects when that limit is exhausted.
- Inline styles remain allowed by `style-src` to preserve existing UI behavior.
- GitHub Actions are version-tagged rather than pinned to immutable commit SHAs.
- Full `npm audit` reports five moderate findings in the ESLint/minimatch development-tooling chain; `npm audit --omit=dev` reports none. Automatic fixes propose an incompatible downgrade, so no forced fix was applied.
- No authentication or database exists; the only application API is the read-only, cached GitHub projects endpoint.
- The production hostname returned HTTP 200 over HTTPS and Vercel sent `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` on 2026-11-01. The app-level `ENABLE_HSTS` flag is separate; Vercel's edge already supplies HSTS.
- Deployment environment values are controlled by Vercel and must be configured separately from this repository.

## Next priorities

1. Configure the Vercel `GITHUB_TOKEN` value and EmailJS public identifiers, then verify live project loading and contact delivery.
2. Review the moderate development-tooling audit findings and upgrade through compatible upstream releases.
3. Verify CodeQL runs after changes to the security workflow or source.
4. Verify Vercel TLS, then enable HSTS only if the existing edge header changes.
