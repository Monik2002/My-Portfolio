# Testing strategy

_Updated 2026-11-01._

## Automated checks

- `npm run lint`: ESLint over JavaScript/JSX.
- `npm run typecheck`: TypeScript checks for `next.config.ts` and `src/proxy.ts`; application components remain JavaScript.
- `npm run build`: production Next.js build and framework type validation.
- `node --test`: tests for contact-form friction, GitHub response normalization, curated project fallbacks, safe URLs, React text escaping, and one-time/reduced-motion welcome behavior.
- `node scripts/security-headers-smoke.mjs`: starts the production server and checks all four route responses, CSP nonce propagation, anti-framing, MIME/referrer/opener headers, and removal of the powered-by header. HSTS is asserted only when explicitly enabled after HTTPS verification.
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

Tests cover actual security response headers, route rendering, project URL/data validation and rate-limit fallbacks, ownership of featured project links, React escaping, one-time welcome behavior, and the implemented client-side submission friction. No app API exists, so app-owned API validation, CSRF, server rate-limit, and body-size tests are not applicable. The browser cooldown/honeypot tests do not establish server-enforced spam protection. GitHub Secret Scanning is configured at the repository level only by an authorized maintainer.

## Manual UI and release checks

Check desktop and mobile widths, keyboard navigation, both themes, contact form configuration/errors, and verify the welcome screen appears only once per browser tab session. Verify route-specific titles/canonicals, `/sitemap.xml`, `/robots.txt`, HTTPS, HSTS activation only after TLS confirmation, and Vercel environment isolation before production release.
