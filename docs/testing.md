# Testing strategy

_Updated 2026-11-01._

## Automated checks

- `npm run lint`: ESLint over JavaScript/JSX.
- `npm run typecheck`: TypeScript checks for `next.config.ts` and `src/proxy.ts`; application components remain JavaScript.
- `npm run build`: production Next.js build and framework type validation.
- `node --test`: tests for contact-form validation and quotas, Hunter result classification/caching/quota pause, server-side GitHub token handling, response caching, generic upstream errors, repository normalization, curated project fallbacks, safe URLs, React text escaping, and one-time/reduced-motion welcome behavior.
- `node scripts/security-headers-smoke.mjs`: starts the production server and checks all four route responses, CSP nonce propagation, anti-framing, MIME/referrer/opener headers, removal of the powered-by header, and the Hunter-disabled contact precheck fallback. HSTS is asserted only when explicitly enabled after HTTPS verification.
- `npm audit --audit-level=high`: dependency advisory gate.

Run the combined suite after building:

```powershell
npm run lint
npm run typecheck
npm audit --audit-level=high
npm run build
npm test
```

CI runs those commands for pushes and pull requests to `main`.

## Security coverage and limits

Tests cover actual security response headers, route rendering, server-only GitHub token handling, cached public project data, generic upstream failures, project URL/data validation and rate-limit fallbacks, ownership of featured project links, React escaping, one-time welcome behavior, contact input/quota-window validation, Hunter's usage-limit cooldown, and fail-open behavior when Hunter is unavailable or unconfigured. Before production release, manually verify OTP expiry, one-time token use, the server-side daily quota, and fail-closed behavior with Redis unavailable. GitHub Secret Scanning is configured at the repository level only by an authorized maintainer.

## Manual UI and release checks

Check desktop and mobile widths, keyboard navigation, both themes, contact form validation/errors, email verification, single-use verification tokens, the two-per-day quota, and verify the welcome screen appears only once per browser tab session. Verify route-specific titles/canonicals, `/sitemap.xml`, `/robots.txt`, HTTPS, HSTS activation only after TLS confirmation, and Vercel environment isolation before production release.
