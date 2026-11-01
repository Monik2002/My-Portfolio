import { NextResponse } from "next/server";
import {
  createVerificationCode,
  getClientIpHash,
  getContactServices,
  hashContactValue,
  isContactEmailConfigured,
  logContactError,
  sendContactEmail,
} from "../../../../lib/contact-backend";
import {
  isValidContactEmail,
  normalizeEmailForContactLimit,
} from "../../../../lib/contact-validation";

function jsonError(message, status) {
  return NextResponse.json({ message }, { status });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Please enter a valid email address.", 400);
  }

  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!isValidContactEmail(email)) {
    return jsonError("Please enter a valid email address.", 400);
  }

  if (!isContactEmailConfigured()) {
    console.error("Resend verification email configuration is incomplete.");
    return jsonError("The contact form is temporarily unavailable.", 503);
  }

  const honeypotValue =
    typeof body.companyWebsite === "string" ? body.companyWebsite.trim() : "";

  let services;
  let emailHash;
  try {
    services = getContactServices();
    emailHash = hashContactValue(normalizeEmailForContactLimit(email));
    const ipHash = getClientIpHash(request);
    const [ipLimit, emailLimit] = await Promise.all([
      services.rateLimiters.verificationIp.limit(ipHash),
      services.rateLimiters.verificationEmail.limit(emailHash),
    ]);
    if (!ipLimit.success || !emailLimit.success) {
      return jsonError("Too many code requests. Please try again later.", 429);
    }
  } catch (error) {
    logContactError("Contact verification rate limiting failed.", error);
    return jsonError("The contact form is temporarily unavailable.", 503);
  }

  if (honeypotValue) {
    return NextResponse.json({
      message: "If this address can receive email, a code has been sent.",
    });
  }

  const verificationCode = createVerificationCode();
  const verificationKey = `contact:otp:${emailHash}`;
  try {
    await services.redis.set(
      verificationKey,
      hashContactValue(verificationCode),
      { ex: 600 }
    );
    await sendContactEmail({
      to: email,
      subject: "Verify your email for Monik's portfolio",
      text: `Your verification code is ${verificationCode}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
    });
  } catch (error) {
    try {
      await services.redis.del(verificationKey);
    } catch (cleanupError) {
      logContactError(
        "Could not remove a failed contact verification code.",
        cleanupError
      );
    }
    logContactError("Resend verification delivery failed.", error);
    return jsonError(
      "Could not send a verification code. Please try again later.",
      502
    );
  }

  return NextResponse.json({
    message: "If this address can receive email, a code has been sent.",
  });
}
