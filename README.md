# Monik Chatterjee — Portfolio

A personal portfolio built with Next.js App Router, React, Tailwind CSS, and custom CSS. It presents the home, about, projects, and contact pages.

## Preview

[Watch the portfolio walkthrough](https://github.com/Monik2002/My-Portfolio/assets/87751450/858f1901-9755-4db7-a145-f8e3b744fd56).

![Portfolio preview](https://github.com/Monik2002/My-Portfolio/assets/87751450/e8c18e15-6c27-40b8-a4a2-9507c433adea)

## Requirements

- Node.js 22.13+ or 24+
- npm

## Local setup

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

The site is available at `https://monikanchan-chatterjee-portfolio.vercel.app/`. Contact email delivery requires server-only Resend and Upstash credentials; see [development setup](./docs/development.md).

## Routes

- `/` — home
- `/me` — about
- `/projects` — public GitHub projects
- `/contact` — contact form

## Quality and security checks

```powershell
npm run lint
npm run typecheck
npm run build
npm test
npm audit --audit-level=high
```

Run `npm test` after a successful production build; it runs unit/security-control tests and starts the built site to verify routes and response headers.

## Project guidance

Read [AGENTS.md](./AGENTS.md), then the relevant files in [`docs/`](./docs/). Report vulnerabilities privately as described in [SECURITY.md](./SECURITY.md).
