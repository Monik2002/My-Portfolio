# Maintenance

_Updated 2026-11-01._

## Dependency and security updates

Review Dependabot PRs weekly for npm dependencies and monthly for GitHub Actions. Check release notes, peer compatibility, build/test results, and `npm audit` advisories before merging; do not use forced upgrades as a substitute for review. Keep `package-lock.json` committed and use `npm ci` in CI/deploys.

For security patches, assess affected direct/transitive packages, update to a compatible fixed release, run the full release checks, and document any accepted residual risk. If private credentials are ever added and exposed, revoke/rotate them before cleanup.

## Framework and platform upgrades

Review Next.js, React, Node.js, Tailwind, and Node engine support before upgrades. Check App Router/proxy changes, security advisories, CSP behavior, route smoke tests, and Vercel compatibility. Reconfirm TLS before enabling HSTS.

## Troubleshooting

- Missing UI assets: inspect static imports under `src/assets/` and Next image build output.
- Contact form unavailable: confirm the Resend sender domain is verified and all five required server-only `RESEND_*`, `CONTACT_*`, and `UPSTASH_REDIS_*` variables are configured for the deployment.
- Contact messages rejected/spammed: review Resend delivery logs and Upstash quotas; the server enforces OTP attempts, IP/email request windows, and two messages per verified normalized email per UTC day.
- CSP blocks a resource: identify the actual required host and narrowly add it to the correct directive; never broadly permit arbitrary scripts.
- Header test fails: inspect the production `next start` output and `src/proxy.ts`/`next.config.ts`.

## Backup, rollback, and routine checklist

Git history is the source backup; use the previous verified Vercel deployment for rollback. Verify provider access and secrets independently. Monthly: review Dependabot, CI/CodeQL, secret scanning settings, audit output, TLS/HSTS, contact abuse reports, and documentation status.
