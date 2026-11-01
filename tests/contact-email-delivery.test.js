import assert from "node:assert/strict";
import test from "node:test";
import { sendContactEmail } from "../src/lib/contact-email-delivery.js";

const EMAIL_ENV_KEYS = [
  "RESEND_API_KEY",
  "CONTACT_FROM_EMAIL",
  "EMAILJS_SERVICE_ID",
  "EMAILJS_CONTACT_TEMPLATE_ID",
  "EMAILJS_VERIFICATION_TEMPLATE_ID",
  "EMAILJS_PUBLIC_KEY",
  "EMAILJS_PRIVATE_KEY",
];

async function withEmailEnvironment(run) {
  const previousEnvironment = Object.fromEntries(
    EMAIL_ENV_KEYS.map((key) => [key, process.env[key]])
  );
  const originalFetch = globalThis.fetch;

  Object.assign(process.env, {
    RESEND_API_KEY: "resend-test-key",
    CONTACT_FROM_EMAIL: "Portfolio <contact@example.com>",
    EMAILJS_SERVICE_ID: "service-test",
    EMAILJS_CONTACT_TEMPLATE_ID: "template-contact",
    EMAILJS_VERIFICATION_TEMPLATE_ID: "template-verification",
    EMAILJS_PUBLIC_KEY: "emailjs-public-test",
    EMAILJS_PRIVATE_KEY: "emailjs-private-test",
  });

  try {
    await run();
  } finally {
    for (const [key, value] of Object.entries(previousEnvironment)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    globalThis.fetch = originalFetch;
  }
}

function quotaResponse(code) {
  return new Response(JSON.stringify({ name: code }), {
    status: 429,
    headers: { "Content-Type": "application/json" },
  });
}

test("uses the EmailJS verification template only after a Resend quota error", async () => {
  await withEmailEnvironment(async () => {
    const calls = [];
    globalThis.fetch = async (url, options) => {
      calls.push({ url, options });
      return calls.length === 1
        ? quotaResponse("daily_quota_exceeded")
        : new Response("OK", { status: 200 });
    };

    await sendContactEmail({
      to: "sender@example.com",
      subject: "Verify your email",
      text: "Your code is 123456.",
      emailJsType: "verification",
      emailJsTemplateParams: {
        to_email: "sender@example.com",
        verification_code: "123456",
      },
    });

    assert.equal(calls.length, 2);
    assert.equal(calls[0].url, "https://api.resend.com/emails");
    assert.equal(
      calls[1].url,
      "https://api.emailjs.com/api/v1.0/email/send"
    );
    assert.deepEqual(JSON.parse(calls[1].options.body), {
      service_id: "service-test",
      template_id: "template-verification",
      user_id: "emailjs-public-test",
      accessToken: "emailjs-private-test",
      template_params: {
        to_email: "sender@example.com",
        verification_code: "123456",
      },
    });
  });
});

test("uses the EmailJS contact template after a Resend monthly quota error", async () => {
  await withEmailEnvironment(async () => {
    const calls = [];
    globalThis.fetch = async (url, options) => {
      calls.push({ url, options });
      return calls.length === 1
        ? quotaResponse("monthly_quota_exceeded")
        : new Response("OK", { status: 200 });
    };

    await sendContactEmail({
      to: "owner@example.com",
      subject: "Portfolio contact: Hello",
      text: "A message",
      replyTo: "sender@example.com",
      emailJsType: "contact",
      emailJsTemplateParams: {
        from_name: "Monik",
        user_name: "Monik",
        user_subject: "Hello",
        message: "A message",
        reply_to: "sender@example.com",
      },
    });

    assert.equal(calls.length, 2);
    assert.equal(
      JSON.parse(calls[1].options.body).template_id,
      "template-contact"
    );
  });
});

test("does not use EmailJS for Resend rate limits or other errors", async () => {
  await withEmailEnvironment(async () => {
    for (const errorCode of ["rate_limit_exceeded", "validation_error"]) {
      let calls = 0;
      globalThis.fetch = async () => {
        calls += 1;
        return quotaResponse(errorCode);
      };

      await assert.rejects(
        sendContactEmail({
          to: "sender@example.com",
          subject: "Subject",
          text: "Message",
          emailJsType: "verification",
          emailJsTemplateParams: {},
        }),
        { name: "ResendHttpError", code: errorCode }
      );
      assert.equal(calls, 1);
    }
  });
});

test("does not use EmailJS when the Resend outcome is uncertain", async () => {
  await withEmailEnvironment(async () => {
    let calls = 0;
    globalThis.fetch = async () => {
      calls += 1;
      throw new TypeError("network failure");
    };

    await assert.rejects(
      sendContactEmail({
        to: "sender@example.com",
        subject: "Subject",
        text: "Message",
        emailJsType: "verification",
        emailJsTemplateParams: {},
      }),
      { name: "TypeError" }
    );
    assert.equal(calls, 1);
  });
});

test("reports a fallback failure instead of treating it as a successful send", async () => {
  await withEmailEnvironment(async () => {
    let calls = 0;
    globalThis.fetch = async () => {
      calls += 1;
      return calls === 1
        ? quotaResponse("daily_quota_exceeded")
        : new Response("Template error", { status: 400 });
    };

    await assert.rejects(
      sendContactEmail({
        to: "sender@example.com",
        subject: "Subject",
        text: "Message",
        emailJsType: "verification",
        emailJsTemplateParams: {},
      }),
      { name: "EmailJsHttpError", provider: "emailjs", status: 400 }
    );
    assert.equal(calls, 2);
  });
});
