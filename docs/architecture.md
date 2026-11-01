# Architecture

_Updated 2026-11-01._

## Stack and rendering

- Next.js App Router 16, React 19, JavaScript/JSX, TypeScript for Next configuration and the request proxy.
- Tailwind CSS 3 plus the existing global styles in `src/App.css` and `src/index.css`.
- Next renders route markup on the server. Interactive navigation, theme, contact, project loading, and the one-time welcome animation hydrate as client components. The About page and most presentational components remain server-renderable.
- There is no application database, authentication system, Route Handler, Server Action, or server-side project API.

## Routes and folder structure

| Route | Route module | Page component |
|---|---|---|
| `/` | `src/app/page.jsx` | `src/portfolio/Home.jsx` |
| `/me` | `src/app/me/page.jsx` | `src/portfolio/About.jsx` |
| `/projects` | `src/app/projects/page.jsx` | `src/portfolio/Projects.jsx` |
| `/contact` | `src/app/contact/page.jsx` | `src/portfolio/Contact.jsx` |

`src/app/layout.jsx` owns document metadata, global CSS, the shared navigation/footer, and providers. `src/portfolio/` holds the route content components (kept separate from the legacy `pages` routing convention); `src/components/` holds reusable UI; `src/lib/` holds project and contact validation; `src/assets/` contains imported static images; `public/` contains public files; `src/proxy.ts` adds the per-request CSP nonce.

## Component hierarchy and data flow

`RootLayout` → `SiteProviders` (theme and toast context) → welcome overlay, `Navigation`, route content, and `Footer`. Route content is passed through the server layout rather than imported into a client shell.

The projects page fetches repositories from the same-origin `/api/projects` Route Handler, which calls GitHub server-side using the optional `GITHUB_TOKEN` environment variable and caches successful responses for one hour. The token is never exposed to the browser. The client normalizes the response and shows curated projects plus an explicit retry/profile link if GitHub is unavailable. The contact form submits directly from the browser to EmailJS using public identifiers.

## External integrations and dependencies

- GitHub REST API: `https://api.github.com/users/Monik2002/repos` via `src/app/api/projects/route.js`. `GITHUB_TOKEN` is optional and server-only; without it, the public unauthenticated rate limit still applies.
- EmailJS browser SDK: contact-form delivery.
- Google Fonts CSS/font files: Inter and IBM Plex Mono.
- The welcome screen uses a small CSS animation and session storage to display once per browser tab session; reduced-motion preferences skip it.
- The canonical production origin is taken from the GitHub repository homepage URL in `src/lib/site-metadata.js`.

Other dependencies are listed in `package.json`; Dependabot and `npm audit` monitor them.

## Constraints

- Do not move browser-only code into server execution.
- Keep server components as the default; limit client boundaries to actual interactivity.
- EmailJS identifiers are public browser configuration, not private credentials.
- The shared server-side cache contains only public GitHub repository data. No private user data is stored. Theme preference and a contact cooldown timestamp are the only app values stored in browser local storage. See [security model](./security.md) and [API inventory](./api.md).
