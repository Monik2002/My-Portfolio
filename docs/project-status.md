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

## In progress / owner actions

- Run the repository CI workflow on GitHub and review the remaining moderate development-tooling audit findings.
- Enable GitHub Secret Scanning and push protection in repository settings if available.
- Recheck the live Vercel deployment after publishing these changes.
- Set EmailJS browser identifiers in Preview/Production and enforce allowed origins, quotas, and provider-side abuse protection.
- Verify contact form delivery and responsive behavior in the deployed environment.

## Known limitations and accepted risks

- Contact spam friction is client-side and bypassable; no server proxy/rate limiter/CAPTCHA was added.
- External GitHub API calls use the public unauthenticated rate limit.
- Inline styles remain allowed by `style-src` to preserve existing UI behavior.
- GitHub Actions are version-tagged rather than pinned to immutable commit SHAs.
- Full `npm audit` reports five moderate findings in the ESLint/minimatch development-tooling chain; `npm audit --omit=dev` reports none. Automatic fixes propose an incompatible downgrade, so no forced fix was applied.
- No application API, authentication, or database exists; adding one requires a new threat model and endpoint tests.
- The production hostname returned HTTP 200 over HTTPS and Vercel sent `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` on 2026-11-01. The app-level `ENABLE_HSTS` flag is separate; Vercel's edge already supplies HSTS.
- Vercel settings, GitHub secret-scanning state, and deployment environment values are unverified from this workspace.

## Next priorities

1. Review the moderate development-tooling audit findings and upgrade through compatible upstream releases.
2. Enable GitHub repository-level secret scanning/push protection and verify CodeQL runs.
3. Configure EmailJS restrictions/quotas and production environment values.
4. Verify Vercel TLS, then enable HSTS.
5. Verify contact form delivery on the deployed site.
6. Confirm the Vercel deployment rebuilt from the updated GitHub branch and verify its generated SEO metadata.
