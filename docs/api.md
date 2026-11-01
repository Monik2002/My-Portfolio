# API and integration inventory

_Updated 2026-11-01._

## Application-owned endpoints

The application exposes one read-only Next.js Route Handler. There are no Server Actions, authentication endpoints, or database endpoints.

## GitHub repositories

- **Request:** browser `GET /api/projects`; `src/app/api/projects/route.js` requests `https://api.github.com/users/Monik2002/repos?per_page=100` from the server.
- **Authentication:** optional server-only `GITHUB_TOKEN` sent as a bearer token. A token is not required for local development; never expose it with a `NEXT_PUBLIC_` prefix.
- **Response:** expected GitHub repository array; only public fields used are id, name, description, fork, star count, creation time, HTML URL, and homepage.
- **Validation:** `src/lib/github-projects.js` verifies the array and each selected field, allows repository links only for `github.com/Monik2002/<repo>`, and allows demo URLs only over HTTP(S) without embedded credentials. Invalid records are discarded; invalid response shapes fail visibly in the page error path.
- **Limits/errors:** an authenticated token increases GitHub's rate limit; unauthenticated requests remain subject to the public limit. Upstream errors are logged server-side and returned as generic errors for the existing curated-project fallback.
- **Caching:** successful repository responses are cached for one hour and may be served stale for up to one day while revalidating. Error responses are not cached.
- **Abuse surface:** the route is a public, read-only GET with no caller-supplied URL, request body, or user-specific data. Keep the upstream URL fixed and do not return the token or GitHub error payloads.

## EmailJS contact form

- **Request:** the browser SDK posts the named form fields to EmailJS from `src/portfolio/Contact.jsx` using the configured public service ID, template ID, and public key.
- **Fields:** `user_name`, `user_email`, `user_subject`, and `message`; the bot honeypot must remain empty.
- **Validation/abuse controls:** browser-required inputs, minimum page dwell, honeypot, pending-submit state, and a browser-local 30-second cooldown. These do not replace provider-side validation or abuse controls and can be bypassed by a direct client.
- **Secrets/authentication:** no server credential or user authentication is used. EmailJS IDs are public configuration and should be restricted by origin and provider quotas.
- **Errors:** visitor messages are generic; diagnostic logs must not include submitted form data.

## Cross-origin policy

The app does not expose a cross-origin API. Browser `connect-src` permits only the same origin and EmailJS API; the GitHub API is called only from the server. Fonts are limited to Google Fonts hosts in the relevant CSP directives.
