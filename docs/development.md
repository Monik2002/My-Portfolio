# Development

_Updated 2026-11-01._

## Prerequisites and setup

Use Node.js 22.13+ or 24+ and npm. The `.npmrc` enforces the declared Node engine.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

The development server runs on `http://localhost:3000`. Contact form configuration is optional for viewing the site. To exercise contact email locally, use a verified Resend sender domain, a Resend API key, the contact recipient address, and Upstash Redis REST credentials from `.env.example`. These values are server-only; never use a `NEXT_PUBLIC_` prefix. `ENABLE_HSTS` is a server-side deployment flag and should remain false locally.

## Commands

```powershell
npm run dev
npm run lint
npm run typecheck
npm run build
npm start
npm test
npm audit --audit-level=high
```

Run `npm test` only after a successful build; its HTTP smoke test starts the production server.

## Conventions and naming

Use App Router route files under `src/app/`; route content components belong in `src/portfolio/`, shared UI belongs in `src/components/`, and reusable validation belongs in `src/lib/`. Use PascalCase React component names, kebab-case utility filenames, and descriptive test names. JavaScript is the application language; TypeScript is currently used for Next config/proxy typing.

Keep client boundaries narrow. Validate remote data before storing/rendering it; use normal React text output. Document new dependencies and security-sensitive decisions.

## Branches and pull requests

Use focused branches and pull requests. Include a summary, relevant screenshots for UI changes, tests run, and any security/deployment setting that still needs a maintainer. Do not claim CI checks passed until they have run.

## Documentation hierarchy

Follow [AGENTS.md](../AGENTS.md) and [Copilot instructions](../.github/copilot-instructions.md); then consult the relevant [architecture](./architecture.md), [security](./security.md), [UI](./ui.md), [API](./api.md), and [deployment](./deployment.md) guidance.
