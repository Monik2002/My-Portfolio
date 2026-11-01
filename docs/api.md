# API and integration inventory

_Updated 2026-11-01._

## Application-owned endpoints

The application exposes a read-only GitHub Route Handler and contact form Route Handlers. Contact endpoints are public, but require a short-lived email-verification token to send mail.

## GitHub repositories

- **Request:** browser `GET /api/projects`; `src/app/api/projects/route.js` requests `https://api.github.com/users/Monik2002/repos?per_page=100` from the server.
- **Authentication:** optional server-only `GITHUB_TOKEN` sent as a bearer token. A token is not required for local development; never expose it with a `NEXT_PUBLIC_` prefix.
- **Response:** expected GitHub repository array; only public fields used are id, name, description, fork, star count, creation time, HTML URL, and homepage.
- **Validation:** `src/lib/github-projects.js` verifies the array and each selected field, allows repository links only for `github.com/Monik2002/<repo>`, and allows demo URLs only over HTTP(S) without embedded credentials. Invalid records are discarded; invalid response shapes fail visibly in the page error path.
- **Limits/errors:** an authenticated token increases GitHub's rate limit; unauthenticated requests remain subject to the public limit. Upstream errors are logged server-side and returned as generic errors for the existing curated-project fallback.
- **Caching:** successful repository responses are cached for one hour and may be served stale for up to one day while revalidating. Error responses are not cached.
- **Abuse surface:** the route is a public, read-only GET with no caller-supplied URL, request body, or user-specific data. Keep the upstream URL fixed and do not return the token or GitHub error payloads.

## Verified contact form

- **Request code:** `POST /api/contact/verification` accepts an email address and honeypot. It sends a cryptographically random six-digit code through Resend, falling back to EmailJS only for Resend daily/monthly quota errors; the HMAC of the code is stored in Upstash Redis for 10 minutes.
- **Verify code:** `POST /api/contact/verification/confirm` accepts the email and code. Redis atomically consumes the code and stores a hash of a random one-time submission token for 15 minutes.
- **Submit:** `POST /api/contact` accepts the name, email, subject, message, honeypot, and one-time token. It validates all fields, atomically reserves a send against the two-message daily quota, and sends plain text through Resend with the verified email as `reply_to`; EmailJS is attempted only for explicit Resend daily/monthly quota errors.
- **Limits:** verification-code sends are limited to 3 per normalized email and 5 per IP per 15 minutes; code attempts are limited to 5 per email and 10 per IP per 15 minutes; message submissions are limited to 10 per IP per 15 minutes. The persistent per-email quota resets at UTC midnight. Gmail dot/plus aliases are grouped; other addresses are case-insensitive.
- **Secrets/data:** `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_RECIPIENT_EMAIL`, optional `EMAILJS_*` settings, and Upstash credentials are server-only. Redis keys contain HMAC-derived identifiers, not raw email addresses. Never log codes, tokens, message contents, or credentials.
- **Failure handling:** requests fail closed if Redis is unavailable. A failed Resend delivery attempts to roll back the reserved quota; if rollback itself fails, the quota remains conservatively consumed.

## Cross-origin policy

The app does not enable cross-origin API access. Browser `connect-src` permits only the same origin; GitHub and Resend are called from the server. Fonts are limited to Google Fonts hosts in the relevant CSP directives.
