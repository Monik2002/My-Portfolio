# Changelog

## Unreleased

- Updated the About page with Monik's current role, technical interests, career goals, and verified credentials linked to the public Credly profile.
- Refined the home page with a clearer introduction, project and contact links, a responsive portrait treatment, and featured projects ahead of highlights.
- Widened the shared layout, improved theme tokens and focus visibility, and clarified the theme control and heading semantics.
- Extended shared surfaces and control states to About, Projects, and Contact; added a skip link, improved project link names and date contrast, and corrected footer icon proportions.
- Reset project pagination when refreshed data arrives, so a shorter fallback does not leave visitors on an empty page.
- Added a staggered hero entrance, progressive scroll reveals, a featured project layout, and reduced-motion-aware card and navigation feedback.
- Named the About technology icons using matched icon references and excluded local skill scripts from repository lint.
- Increased touch target sizes for project links, footer controls, About social links, and contact buttons.

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
