# Security architecture and threat model

_Updated 2026-11-01._

## Assets and trust boundaries

Assets are the public portfolio content, contact submissions, and integrity/availability of the deployment. The browser, GitHub response, user-submitted form fields, npm packages, GitHub Actions, Resend, Upstash Redis, Google Fonts, and hosting platform are separate trust boundaries. Public visitors can access every route.

The site has no user account system or Server Action. It has a read-only GitHub Route Handler and public contact Route Handlers protected by short-lived email verification. Upstash Redis is the shared server-side store for OTPs, rate limits, and daily quotas.

## Threat scenarios and current classification

| Scenario | Risk | Controls and residual risk |
|---|---|---|
| XSS from project/API or form text | Low | React text rendering, no `dangerouslySetInnerHTML`, normalized remote records, CSP with response nonce. Keep this invariant in tests. |
| CSRF | Low | Contact APIs accept JSON POSTs and no cookies authorize the caller; verification tokens are returned only to the same-origin browser. Cross-origin API access is not enabled. |
| SQL/NoSQL injection | Low | Contact Redis uses fixed Lua scripts and HMAC-derived keys; user values are passed as script arguments, never interpolated into script source. |
| SSRF | Low | The projects Route Handler uses a fixed GitHub API URL and accepts no caller-supplied URL. |
| API abuse / denial of service | Medium | The public read-only GitHub route caches responses for one hour; contact code requests and submissions have shared Upstash limits by HMAC-hashed IP/email. Provider quotas also bound Resend traffic. |
| Contact spam | Medium | A sender must receive an OTP, verification tokens are one-time, code attempts are limited, and two messages per normalized email are reserved atomically per UTC day. Gmail dot/plus aliases share a quota. |
| Secret leakage | Low | `GITHUB_TOKEN`, `RESEND_API_KEY`, and `UPSTASH_REDIS_REST_TOKEN` are server-only. Contact recipient/sender configuration must not use a `NEXT_PUBLIC_` prefix. |
| Dependency/supply-chain compromise | Medium | Lockfile, `npm ci`, audit gate, Dependabot, CodeQL, least-permission CI. GitHub Actions use major-version tags rather than immutable SHAs; review updates. |
| Open redirect | Low | No redirect endpoint exists. GitHub repository URLs are constrained to the expected owner; demo URLs accept only HTTP(S) and disallow credentials. |
| Clickjacking | Low | `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'`. |
| Security misconfiguration | Medium | Security headers are centralized and tested. HSTS is deliberately gated on verified production HTTPS; review Vercel settings before enabling. |
| Cache poisoning / unintended caching | Low | Only public GitHub repository data is cached for one hour, with stale revalidation; responses are not user-specific. Browser storage contains only the non-sensitive theme preference; the one-time contact token remains in component state. |
| Unauthorized server functionality | Low | Contact endpoints are unauthenticated but require a short-lived email-verification token; Redis is fail-closed and message quotas are enforced server-side. Protect future side-effecting handlers independently. |
| Compromised third-party scripts | Low | No third-party script is loaded from a CDN. Font CSS is fetched from Google; runtime libraries are bundled from npm. |

## Browser and HTTP controls

`src/proxy.ts` generates a cryptographically random nonce per request and applies a CSP that restricts scripts to the same origin and nonce. The policy allows the existing inline styles and Google Fonts CSS/font hosts; `style-src 'unsafe-inline'` is retained because the current UI uses inline styles. Production does not allow `unsafe-eval`. Development relaxes script evaluation for the dev server only.

`next.config.ts` disables the powered-by header and configures `nosniff`, frame denial, strict-origin referrer policy, a restrictive Permissions-Policy, same-origin opener policy, and disables the obsolete XSS filter. The app-level HSTS and `upgrade-insecure-requests` directives are conditional on `ENABLE_HSTS=true`. The live Vercel edge returned `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` on 2026-11-01; avoid enabling a redundant app-level header without checking the deployed response. No custom CORS policy is needed because the app exposes no cross-origin application API.

## Input, API, and data handling

- `src/app/api/projects/route.js` calls only GitHub's fixed public repositories endpoint, keeps optional `GITHUB_TOKEN` server-side, and caches successful responses for one hour.
- `src/lib/github-projects.js` validates response shape, repository ownership/URLs, dates, counts, and HTTP(S) demo URLs before display.
- React renders descriptions as text; do not introduce unsafe HTML rendering.
- Contact fields are validated again in the server Route Handler. Verification codes expire after 10 minutes, can be attempted at most five times per 15-minute window, and successful verification tokens expire after 15 minutes. A Redis Lua script atomically consumes the token and reserves the sender's daily message slot before Resend is called.
- Redis keys use HMAC-derived email/IP identifiers and store only a hash of each OTP and verification token. Mail contents are sent to Resend and are not written to application logs or Redis.
- Errors shown to visitors are generic. Logs must not include form values or credentials.
- The projects endpoint is a public read-only GET with no user input or request body; it returns generic errors and does not expose the upstream error payload or token. Reassess abuse controls if it gains caller-controlled inputs or side effects.

## Environment and secret management

`GITHUB_TOKEN` is optional and server-only; add it to Vercel Preview/Production environment variables to raise the GitHub API rate limit. Use a fine-grained token with no repository permissions for public repository reads, set an expiry, and never prefix it with `NEXT_PUBLIC_`. Contact delivery requires server-only `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_RECIPIENT_EMAIL`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN` values. Verify the sending domain in Resend and configure variables separately for each Vercel environment.

## Dependency and release security

Run `npm audit --audit-level=high`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test`. CI runs these checks; Dependabot creates update PRs and CodeQL analyzes JavaScript/TypeScript. Do not force upgrades; review compatibility and advisory details first. `npm test` verifies actual production response headers/routes and tests data normalization, text escaping, and contact-form friction.

The 2026-11-01 full audit reports five moderate records in the ESLint/minimatch development-tooling chain and zero high/critical findings; the production-only audit reports zero vulnerabilities. The available automatic fix requires an incompatible dependency downgrade, so the remaining upstream advisory is monitored rather than force-overridden.

## Vulnerability reporting and incident response

Use the private process in [SECURITY.md](../SECURITY.md). For exposed private credentials, revoke/rotate first, investigate repository history and deployment logs, then document remediation. Do not run destructive production penetration tests.

## Known residual risks

- Contact delivery depends on the Resend domain being verified and both Resend/Upstash staying within their free-tier limits; if Redis is unavailable, contact APIs intentionally fail closed.
- The production HTTPS endpoint is verified and Vercel's edge supplies HSTS; the app-level `ENABLE_HSTS` flag remains off.
- GitHub repository-level Secret Scanning and push protection require repository-owner settings; they cannot be enabled from the local project files.
- `GITHUB_TOKEN`, Resend, and Upstash environment values must be configured separately in Vercel; no credentials are committed to the repository.
