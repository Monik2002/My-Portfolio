# Security architecture and threat model

_Updated 2026-11-01._

## Assets and trust boundaries

Assets are the public portfolio content, contact submissions, and integrity/availability of the deployment. The browser, local storage, GitHub response, user-submitted form fields, npm packages, GitHub Actions, EmailJS, Google Fonts, and hosting platform are separate trust boundaries. Public visitors can access every route.

The site has no authentication, database, or Server Action. Its only application-owned endpoint is a read-only GitHub projects Route Handler. Client-side checks are not server security boundaries. EmailJS public identifiers are intentionally browser-visible.

## Threat scenarios and current classification

| Scenario | Risk | Controls and residual risk |
|---|---|---|
| XSS from project/API or form text | Low | React text rendering, no `dangerouslySetInnerHTML`, normalized remote records, CSP with response nonce. Keep this invariant in tests. |
| CSRF | Low / not applicable | No authenticated state-changing application endpoint exists. EmailJS submission is a public third-party operation, not a session-authenticated app action. |
| SQL/NoSQL injection | Not applicable | No database or query layer exists. Reassess if one is introduced. |
| SSRF | Low | The projects Route Handler uses a fixed GitHub API URL and accepts no caller-supplied URL. |
| API abuse / denial of service | Medium | The public read-only GitHub route caches responses for one hour and uses GitHub's rate limits; contact form has a honeypot, minimum dwell, and client-side cooldown. Those client checks are bypassable; configure EmailJS allowed origins, CAPTCHA/abuse controls, and quota alerts in its dashboard. |
| Contact spam | Medium | Same client-side friction and generic failure messages; provider-side enforcement remains necessary and is not controlled by this repository. |
| Secret leakage | Low | Optional `GITHUB_TOKEN` is read only by the server Route Handler and is not required for local or production startup. Store it only as a Vercel server-side environment variable, never with `NEXT_PUBLIC_`; `.env*` is ignored. |
| Dependency/supply-chain compromise | Medium | Lockfile, `npm ci`, audit gate, Dependabot, CodeQL, least-permission CI. GitHub Actions use major-version tags rather than immutable SHAs; review updates. |
| Open redirect | Low | No redirect endpoint exists. GitHub repository URLs are constrained to the expected owner; demo URLs accept only HTTP(S) and disallow credentials. |
| Clickjacking | Low | `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'`. |
| Security misconfiguration | Medium | Security headers are centralized and tested. HSTS is deliberately gated on verified production HTTPS; review Vercel settings before enabling. |
| Cache poisoning / unintended caching | Low | Only public GitHub repository data is cached for one hour, with stale revalidation; responses are not user-specific. Browser storage contains only the non-sensitive theme preference and contact cooldown timestamp. |
| Unauthorized server functionality | Low | No authenticated server functionality or write endpoints exist. Protect any future handler independently. |
| Compromised third-party scripts | Low | No third-party script is loaded from a CDN. Font CSS is fetched from Google; runtime libraries are bundled from npm. |

## Browser and HTTP controls

`src/proxy.ts` generates a cryptographically random nonce per request and applies a CSP that restricts scripts to the same origin and nonce. The policy allows the existing inline styles and Google Fonts CSS/font hosts; `style-src 'unsafe-inline'` is retained because the current UI uses inline styles. Production does not allow `unsafe-eval`. Development relaxes script evaluation for the dev server only.

`next.config.ts` disables the powered-by header and configures `nosniff`, frame denial, strict-origin referrer policy, a restrictive Permissions-Policy, same-origin opener policy, and disables the obsolete XSS filter. The app-level HSTS and `upgrade-insecure-requests` directives are conditional on `ENABLE_HSTS=true`. The live Vercel edge returned `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` on 2026-11-01; avoid enabling a redundant app-level header without checking the deployed response. No custom CORS policy is needed because the app exposes no cross-origin application API.

## Input, API, and data handling

- `src/app/api/projects/route.js` calls only GitHub's fixed public repositories endpoint, keeps optional `GITHUB_TOKEN` server-side, and caches successful responses for one hour.
- `src/lib/github-projects.js` validates response shape, repository ownership/URLs, dates, counts, and HTTP(S) demo URLs before display.
- React renders descriptions as text; do not introduce unsafe HTML rendering.
- Contact fields use browser-required validation. The honeypot, time-to-submit check, and local cooldown are usability/abuse friction only; they do not replace provider-side rate limits or CAPTCHA.
- Errors shown to visitors are generic. Logs must not include form values or credentials.
- The projects endpoint is a public read-only GET with no user input or request body; it returns generic errors and does not expose the upstream error payload or token. Reassess abuse controls if it gains caller-controlled inputs or side effects.

## Environment and secret management

`GITHUB_TOKEN` is optional and server-only; add it to Vercel Preview/Production environment variables to raise the GitHub API rate limit. Use a fine-grained token with no repository permissions for public repository reads, set an expiry, and never prefix it with `NEXT_PUBLIC_`. `NEXT_PUBLIC_EMAILJS_*` values are public and are only checked before contact submission. Verify them against the EmailJS dashboard and configure them in each deployment environment; never put private credentials in `NEXT_PUBLIC_*`.

## Dependency and release security

Run `npm audit --audit-level=high`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test`. CI runs these checks; Dependabot creates update PRs and CodeQL analyzes JavaScript/TypeScript. Do not force upgrades; review compatibility and advisory details first. `npm test` verifies actual production response headers/routes and tests data normalization, text escaping, and contact-form friction.

The 2026-11-01 full audit reports five moderate records in the ESLint/minimatch development-tooling chain and zero high/critical findings; the production-only audit reports zero vulnerabilities. The available automatic fix requires an incompatible dependency downgrade, so the remaining upstream advisory is monitored rather than force-overridden.

## Vulnerability reporting and incident response

Use the private process in [SECURITY.md](../SECURITY.md). For exposed private credentials, revoke/rotate first, investigate repository history and deployment logs, then document remediation. Do not run destructive production penetration tests.

## Known residual risks

- Contact abuse controls in the browser can be bypassed. Configure EmailJS origin restrictions and provider-side abuse controls before relying on the form at scale.
- The production HTTPS endpoint is verified and Vercel's edge supplies HSTS; the app-level `ENABLE_HSTS` flag remains off.
- GitHub repository-level Secret Scanning and push protection require repository-owner settings; they cannot be enabled from the local project files.
- `GITHUB_TOKEN` and EmailJS environment values must be configured separately in Vercel; no credentials are committed to the repository.
