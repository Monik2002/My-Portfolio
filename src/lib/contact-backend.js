import "server-only";

import { createHmac, randomBytes, randomInt } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { isValidContactEmail } from "./contact-validation";
export { sendContactEmail } from "./contact-email-delivery";

let redis;
let rateLimiters;

export function getContactServices() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error("Contact Redis is not configured.");
  }

  if (!redis) redis = new Redis({ url, token });
  if (!rateLimiters) {
    rateLimiters = {
      verificationIp: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "15 m"),
        prefix: "contact:verification:ip",
      }),
      verificationEmail: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, "15 m"),
        prefix: "contact:verification:email",
      }),
      confirmationIp: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "15 m"),
        prefix: "contact:confirmation:ip",
      }),
      confirmationEmail: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "15 m"),
        prefix: "contact:confirmation:email",
      }),
      submissionIp: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "15 m"),
        prefix: "contact:submission:ip",
      }),
    };
  }

  return { redis, rateLimiters };
}

export function hashContactValue(value) {
  const key = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!key) throw new Error("Contact Redis is not configured.");
  return createHmac("sha256", key).update(value).digest("hex");
}

export function getClientIpHash(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  return hashContactValue(ip);
}

export function createVerificationCode() {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function createVerificationToken() {
  return randomBytes(32).toString("base64url");
}

export function isContactEmailConfigured({ requireRecipient = false } = {}) {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.CONTACT_FROM_EMAIL &&
      (!requireRecipient ||
        isValidContactEmail(process.env.CONTACT_RECIPIENT_EMAIL))
  );
}

export function logContactError(message, error) {
  const detail = {
    name: error instanceof Error && error.name ? error.name : "UnknownError",
    ...(typeof error?.provider === "string" ? { provider: error.provider } : {}),
    ...(Number.isInteger(error?.status) ? { status: error.status } : {}),
    ...(typeof error?.code === "string" ? { code: error.code } : {}),
  };
  console.error(message, detail);
}

export const CONSUME_VERIFICATION_CODE_SCRIPT = `
  if redis.call("GET", KEYS[1]) ~= ARGV[1] then
    return 0
  end
  redis.call("DEL", KEYS[1])
  redis.call("SET", KEYS[2], ARGV[2], "EX", ARGV[3])
  return 1
`;

export const RESERVE_CONTACT_MESSAGE_SCRIPT = `
  if redis.call("GET", KEYS[1]) ~= ARGV[1] then
    return -1
  end
  local count = tonumber(redis.call("GET", KEYS[2]) or "0")
  if count >= 2 then
    return 0
  end
  redis.call("INCR", KEYS[2])
  redis.call("EXPIRE", KEYS[2], tonumber(ARGV[2]))
  redis.call("DEL", KEYS[1])
  return 1
`;

export const RESERVE_VERIFICATION_EMAIL_SCRIPT = `
  local count = tonumber(redis.call("GET", KEYS[1]) or "0")
  if count >= 2 then
    return 0
  end
  redis.call("INCR", KEYS[1])
  redis.call("EXPIRE", KEYS[1], tonumber(ARGV[1]))
  return 1
`;
