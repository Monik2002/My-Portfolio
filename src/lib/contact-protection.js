export const CONTACT_COOLDOWN_MS = 30_000;
export const CONTACT_MINIMUM_DWELL_MS = 2_000;

export function getContactSubmissionBlockReason({
  honeypotValue,
  formLoadedAt,
  lastSubmission,
  now = Date.now(),
}) {
  if (honeypotValue) return "honeypot";
  if (now - formLoadedAt < CONTACT_MINIMUM_DWELL_MS) return "too-early";
  if (
    Number.isFinite(lastSubmission) &&
    lastSubmission > 0 &&
    now - lastSubmission < CONTACT_COOLDOWN_MS
  ) {
    return "rate-limited";
  }
  return null;
}
