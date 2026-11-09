# Instructions for AI coding agents

## Before changing code

1. Read [README.md](./README.md) and this file.
2. Read [docs/architecture.md](./docs/architecture.md) before architecture changes.
3. Read [docs/security.md](./docs/security.md) before API, environment, integration, or deployment changes.
4. Read [docs/ui.md](./docs/ui.md) before changing shared UI or styling.
5. Read the other relevant `docs/` pages and inspect the implementation; code is the source of truth when documentation is stale.

## Structure and documentation hierarchy

- `src/app/` owns Next.js App Router routes and the root layout.
- `src/portfolio/` contains portfolio page components rendered by App Router routes.
- `src/components/` contains shared UI and client-side providers.
- `src/lib/` contains input normalization and browser-side helpers.
- `public/` contains public static assets; `src/assets/` contains imported assets.
- `docs/` describes architecture, security, UI, development, APIs, deployment, tests, decisions, maintenance, and current status.
- `README.md` is the quick start; this file is the general agent policy; `.github/copilot-instructions.md` adds Copilot-specific requirements; `SECURITY.md` is the vulnerability reporting policy.

Resolve conflicts by inspecting the running code, documenting verified facts, and updating the relevant pages. Do not silently change documented decisions.

## Coding conventions

- Use the Next.js App Router. Keep server components as the default and put `"use client"` only on components that need browser APIs, state, effects, or event handlers.
- Preserve the existing visual system and routes unless the requested change requires otherwise.
- Validate data from external APIs and browser storage before using it. Render user/API text as normal React text; do not use `dangerouslySetInnerHTML`.
- Keep private credentials server-side. `NEXT_PUBLIC_*` values are public; contact delivery uses server-only Resend and Upstash credentials.
- Avoid new dependencies unless necessary; document the reason and verify compatibility/security.
- Handle errors explicitly. Do not hide failures with broad catches or success-shaped fallbacks.
- Do not add authentication, a database, or API routes unless the product requires them.

## Required checks

After code changes, run the smallest relevant checks and normally:

```powershell
npm run lint
npm run typecheck
npm run build
npm test
npm audit --audit-level=high
```

`npm test` includes a production HTTP smoke test, so build first. Check desktop and mobile layouts for UI changes. Do not report unrun checks as passed.

## Security expectations

- Read [docs/security.md](./docs/security.md) before changing a trust boundary.
- Treat all remote and browser-stored data as untrusted; validate URLs and inputs.
- Do not add server actions or route handlers without server-side validation, abuse controls, and security tests.
- Never commit `.env.local`, secrets, tokens, or private credentials.
- Keep CSP and response-header tests passing; do not weaken controls merely to make a build pass.
- Document residual risks and deployment settings that require human/GitHub access.

## Completion

Update the relevant documentation and [CHANGELOG.md](./CHANGELOG.md) for meaningful changes. Update [docs/project-status.md](./docs/project-status.md) accurately, including deferred or externally controlled work. Summarize changed files, checks, and remaining user actions.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
