import { NextResponse } from "next/server";
import {
  getClientIpHash,
  getContactServices,
  hashContactValue,
  isContactEmailConfigured,
  logContactError,
  RESERVE_CONTACT_MESSAGE_SCRIPT,
  sendContactEmail,
} from "../../../lib/contact-backend";
import {
  getDailyContactQuotaWindow,
  normalizeEmailForContactLimit,
  validateContactSubmission,
} from "../../../lib/contact-validation";

function jsonError(message, status) {
  return NextResponse.json({ message }, { status });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Please check your message and try again.", 400);
  }

  if (
    typeof body?.companyWebsite === "string" &&
    body.companyWebsite.trim()
  ) {
    return NextResponse.json({ message: "Message received." });
  }

  const validation = validateContactSubmission(body);
  if (validation.error) {
    return jsonError("Please complete all fields with valid information.", 400);
  }

  const { name, email, subject, message } = validation.value;
  const verificationToken =
    typeof body.verificationToken === "string" ? body.verificationToken : "";
  if (!verificationToken) {
    return jsonError("Verify your email address before sending a message.", 403);
  }

  if (!isContactEmailConfigured({ requireRecipient: true })) {
    console.error("Resend contact email configuration is incomplete.");
    return jsonError("The contact form is temporarily unavailable.", 503);
  }

  let services;
  let quotaKey;
  try {
    services = getContactServices();
    const ipLimit = await services.rateLimiters.submissionIp.limit(
      getClientIpHash(request)
    );
    if (!ipLimit.success) {
      return jsonError("Too many messages from this network. Try again later.", 429);
    }

    const emailHash = hashContactValue(normalizeEmailForContactLimit(email));
    const { date, expiresInSeconds } = getDailyContactQuotaWindow();
    quotaKey = `contact:sent:${emailHash}:${date}`;
    const reserved = await services.redis
      .createScript(RESERVE_CONTACT_MESSAGE_SCRIPT)
      .eval(
        [
          `contact:verified:${emailHash}`,
          quotaKey,
        ],
        [hashContactValue(verificationToken), String(expiresInSeconds)]
      );

    if (reserved === 0) {
      return jsonError(
        "This email address has reached its limit of two messages today.",
        429
      );
    }
    if (reserved !== 1) {
      return jsonError("Verify your email address before sending a message.", 403);
    }
  } catch (error) {
    logContactError("Contact message quota check failed.", error);
    return jsonError("The contact form is temporarily unavailable.", 503);
  }

  try {
    await sendContactEmail({
      to: process.env.CONTACT_RECIPIENT_EMAIL,
      replyTo: email,
      subject: `Portfolio contact: ${subject}`,
      text: [
        `From: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        message,
      ].join("\n"),
    });
  } catch (error) {
    try {
      await services.redis.decr(quotaKey);
    } catch (rollbackError) {
      logContactError(
        "Could not restore a failed contact message quota.",
        rollbackError
      );
    }
    logContactError("Resend contact delivery failed.", error);
    return jsonError(
      "Could not send your message. Please request a new verification code and try again.",
      502
    );
  }

  return NextResponse.json({ message: "Message sent successfully." });
}
