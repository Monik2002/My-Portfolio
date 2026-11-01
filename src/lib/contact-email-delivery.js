const RESEND_EMAIL_URL = "https://api.resend.com/emails";
const EMAILJS_SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";

function createDeliveryError(message, { name, provider, status, code } = {}) {
  const error = new Error(message);
  error.name = name;
  error.provider = provider;
  if (Number.isInteger(status)) error.status = status;
  if (typeof code === "string") error.code = code;
  return error;
}

function getResendErrorCode(payload) {
  if (typeof payload?.name === "string") return payload.name;
  if (typeof payload?.type === "string") return payload.type;
  return undefined;
}

function isResendQuotaError(error) {
  return (
    error.provider === "resend" &&
    (error.code === "daily_quota_exceeded" ||
      error.code === "monthly_quota_exceeded")
  );
}

function getEmailJsConfig(type) {
  const templateId =
    type === "verification"
      ? process.env.EMAILJS_VERIFICATION_TEMPLATE_ID
      : type === "contact"
        ? process.env.EMAILJS_CONTACT_TEMPLATE_ID
        : undefined;

  const config = {
    serviceId: process.env.EMAILJS_SERVICE_ID,
    templateId,
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
    privateKey: process.env.EMAILJS_PRIVATE_KEY,
  };

  if (Object.values(config).some((value) => !value)) {
    throw createDeliveryError("EmailJS fallback is not fully configured.", {
      name: "EmailJsConfigurationError",
      provider: "emailjs",
    });
  }

  return config;
}

export async function sendContactEmail({
  to,
  subject,
  text,
  replyTo,
  emailJsType,
  emailJsTemplateParams,
} = {}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error("Resend is not configured.");
  }

  const resendResponse = await fetch(RESEND_EMAIL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (resendResponse.ok) return;

  let resendPayload;
  try {
    resendPayload = await resendResponse.json();
  } catch {
    resendPayload = null;
  }

  const resendError = createDeliveryError(
    `Resend returned HTTP ${resendResponse.status}.`,
    {
      name: "ResendHttpError",
      provider: "resend",
      status: resendResponse.status,
      code: getResendErrorCode(resendPayload),
    }
  );

  if (!isResendQuotaError(resendError)) throw resendError;

  const { serviceId, templateId, publicKey, privateKey } =
    getEmailJsConfig(emailJsType);
  const emailJsResponse = await fetch(EMAILJS_SEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: emailJsTemplateParams,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!emailJsResponse.ok) {
    throw createDeliveryError(
      `EmailJS returned HTTP ${emailJsResponse.status}.`,
      {
        name: "EmailJsHttpError",
        provider: "emailjs",
        status: emailJsResponse.status,
      }
    );
  }
}
