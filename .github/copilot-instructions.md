# GitHub Copilot instructions

Before making changes, read [README.md](../README.md) and [AGENTS.md](../AGENTS.md). Read the relevant pages in [`docs/`](../docs/); architecture, security, and UI changes require reading their corresponding documents first. Inspect the implementation rather than assuming the documentation is current.

Follow the Next.js App Router in `src/app/`; keep server components as the default, isolate browser behavior behind small client components, and preserve the portfolio's routes and visual language. Validate external API and browser data, keep Resend and Upstash credentials server-side, and never render untrusted HTML.

Run lint, typecheck, production build, tests, and `npm audit --audit-level=high` as applicable. `npm test` expects a production build and verifies actual response headers and route rendering. Update relevant documentation and `CHANGELOG.md`; record unfinished or externally controlled tasks in `docs/project-status.md`. Never claim an unrun test or unverified GitHub/Vercel setting is complete.
