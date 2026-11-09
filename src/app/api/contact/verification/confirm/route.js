import { NextResponse } from "next/server";
import {
  CONSUME_VERIFICATION_CODE_SCRIPT,
  createVerificationToken,
  getClientIpHash,
  getContactServices,
  hashContactValue,
  logContactError,
} from "../../../../../lib/contact-backend";
import {
  isValidContactEmail,
  normalizeEmailForContactLimit,
} from "../../../../../lib/contact-validation";

function jsonError(message, status) {
  return NextResponse.json({ message }, { status });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Enter the code we emailed you.", 400);
  }

  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  if (!isValidContactEmail(email) || !/^\d{6}$/.test(code)) {
    return jsonError("Enter a valid email address and six-digit code.", 400);
  }

  let services;
  let emailHash;
  let verificationToken;
  try {
    services = getContactServices();
    emailHash = hashContactValue(normalizeEmailForContactLimit(email));
    const ipHash = getClientIpHash(request);
    const [ipLimit, emailLimit] = await Promise.all([
      services.rateLimiters.confirmationIp.limit(ipHash),
      services.rateLimiters.confirmationEmail.limit(emailHash),
    ]);
    if (!ipLimit.success || !emailLimit.success) {
      return jsonError("Too many code attempts. Request a new code later.", 429);
    }

    verificationToken = createVerificationToken();
    const result = await services.redis
      .createScript(CONSUME_VERIFICATION_CODE_SCRIPT)
      .eval(
        [
          `contact:otp:${emailHash}`,
          `contact:verified:${emailHash}`,
        ],
        [hashContactValue(code), hashContactValue(verificationToken), "900"]
      );
    if (result !== 1) {
      return jsonError("That code is invalid or has expired.", 400);
    }
  } catch (error) {
    logContactError("Contact email verification failed.", error);
    return jsonError("The contact form is temporarily unavailable.", 503);
  }

  return NextResponse.json({ verificationToken });
}
