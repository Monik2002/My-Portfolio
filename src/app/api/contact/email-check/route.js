import { NextResponse } from "next/server";
import {
  getClientIpHash,
  getContactServices,
  hashContactValue,
  logContactError,
} from "../../../../lib/contact-backend";
import { isValidContactEmail } from "../../../../lib/contact-validation";
import { checkEmailWithHunter } from "../../../../lib/hunter-email-validation";

function jsonResult(status, httpStatus = 200) {
  return NextResponse.json(
    { status },
    {
      status: httpStatus,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResult("invalid", 400);
  }

  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!isValidContactEmail(email)) return jsonResult("invalid", 400);

  const apiKey = process.env.HUNTER_API_KEY?.trim();
  if (!apiKey) return jsonResult("skipped");

  try {
    const services = getContactServices();
    const result = await checkEmailWithHunter(email, {
      apiKey,
      redis: services.redis,
      rateLimiter: services.rateLimiters.emailCheckIp,
      ipHash: getClientIpHash(request),
      hashValue: hashContactValue,
    });
    return jsonResult(result.status);
  } catch (error) {
    logContactError("Hunter email precheck failed; continuing without it.", error);
    return jsonResult("skipped");
  }
}
