# API and integration inventory

_Updated 2026-11-01._

## Application-owned endpoints

There are no Next.js Route Handlers, Server Actions, application API routes, authentication endpoints, or database endpoints. Consequently, the app has no app-owned HTTP methods, request schemas, or session/CSRF policy. Do not add an endpoint without server-side validation, rate limits, body-size controls, generic errors, and security tests.

## GitHub repositories

- **Request:** browser `GET https://api.github.com/users/Monik2002/repos` from `src/portfolio/Projects.jsx`.
- **Authentication:** none; public unauthenticated API.
- **Response:** expected GitHub repository array; only public fields used are id, name, description, fork, star count, creation time, HTML URL, and homepage.
- **Validation:** `src/lib/github-projects.js` verifies the array and each selected field, allows repository links only for `github.com/Monik2002/<repo>`, and allows demo URLs only over HTTP(S) without embedded credentials. Invalid records are discarded; invalid response shapes fail visibly in the page error path.
- **Limits/errors:** GitHub applies its public unauthenticated rate limit. The projects UI logs the failure and shows a generic toast; no private data is involved.
- **Caching:** repository data is not persisted; each page visit fetches fresh public data. No server cache is used.

## EmailJS contact form

- **Request:** the browser SDK posts the named form fields to EmailJS from `src/portfolio/Contact.jsx` using the configured public service ID, template ID, and public key.
- **Fields:** `user_name`, `user_email`, `user_subject`, and `message`; the bot honeypot must remain empty.
- **Validation/abuse controls:** browser-required inputs, minimum page dwell, honeypot, pending-submit state, and a browser-local 30-second cooldown. These do not replace provider-side validation or abuse controls and can be bypassed by a direct client.
- **Secrets/authentication:** no server credential or user authentication is used. EmailJS IDs are public configuration and should be restricted by origin and provider quotas.
- **Errors:** visitor messages are generic; diagnostic logs must not include submitted form data.

## Cross-origin policy

The app does not expose a cross-origin API. Browser `connect-src` permits only the same origin, GitHub API, and EmailJS API; fonts are limited to Google Fonts hosts in the relevant CSP directives.
