# Changelog

## 2026-11-01

- Migrated the portfolio from Vite and React Router to the Next.js App Router while retaining the existing routes and shared UI.
- Added nonce-based CSP, security response headers, GitHub dependency/CodeQL workflows, and CI checks.
- Added input normalization, browser-side contact-form abuse friction, security tests, and implementation documentation.
- Improved compact mobile navigation and accessible navigation labels.
- Added page-specific SEO/social metadata and corrected Contact heading and LinkedIn link accessibility.
- Added canonical production URLs, sitemap, and robots metadata based on the GitHub repository homepage.
- Limited the welcome animation to once per browser tab session and removed Shepherd guided tours and unused animation dependencies.
- Corrected featured-project ownership links, filtered blank GitHub descriptions, and displayed repository language metadata.
- Added unit coverage for session-scoped welcome behavior and GitHub project display data.
- Added featured-project fallback and retry controls for GitHub API rate-limit failures.
- Added Vercel Speed Insights for real-user performance monitoring.
- Replaced the public EmailJS contact flow with server-side Resend delivery, email OTP verification, and Upstash-backed two-per-day sender quotas.
- Added an optional server-side EmailJS fallback for explicit Resend quota exhaustion without changing OTP or sender quota enforcement.
- Removed Vite and React 18-only UI dependencies; updated the runtime requirement to Node.js 22.13+ or 24+.
