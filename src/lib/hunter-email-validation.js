export const HUNTER_QUOTA_PAUSE_SECONDS = 32 * 24 * 60 * 60;

const HUNTER_QUOTA_PAUSE_KEY = "contact:hunter:quota-paused";
const HUNTER_RESULT_TTLS = {
  valid: 24 * 60 * 60,
  invalid: 24 * 60 * 60,
  unknown: 60 * 60,
};
const HUNTER_RESULT_STATUSES = new Set(["valid", "invalid", "unknown"]);

function classifyHunterResponse(payload) {
  const status = payload?.data?.status;
  return status === "valid" || status === "invalid" ? status : "unknown";
}

export async function checkEmailWithHunter(
  email,
  {
    apiKey,
    redis,
    rateLimiter,
    ipHash,
    fetchImpl = fetch,
    hashValue,
  }
) {
  if (!apiKey) return { status: "skipped" };

  const emailHash = hashValue(email.trim().toLowerCase());
  const resultKey = `contact:hunter:result:${emailHash}`;
  const cachedResult = await redis.get(resultKey);
  if (HUNTER_RESULT_STATUSES.has(cachedResult)) {
    return { status: cachedResult };
  }

  if (await redis.get(HUNTER_QUOTA_PAUSE_KEY)) {
    return { status: "skipped" };
  }

  const ipLimit = await rateLimiter.limit(ipHash);
  if (!ipLimit.success) return { status: "skipped" };

  const url = new URL("https://api.hunter.io/v2/email-verifier");
  url.searchParams.set("email", email);
  const response = await fetchImpl(url, {
    headers: {
      Accept: "application/json",
      "X-API-KEY": apiKey,
    },
    signal: AbortSignal.timeout(5_000),
  });

  if (response.status === 429) {
    await redis.set(HUNTER_QUOTA_PAUSE_KEY, "1", {
      ex: HUNTER_QUOTA_PAUSE_SECONDS,
    });
    return { status: "skipped" };
  }

  if (!response.ok) {
    const error = new Error(`Hunter returned HTTP ${response.status}.`);
    error.name = "HunterHttpError";
    error.status = response.status;
    throw error;
  }

  const result = classifyHunterResponse(await response.json());
  await redis.set(resultKey, result, {
    ex: HUNTER_RESULT_TTLS[result],
  });
  return { status: result };
}
