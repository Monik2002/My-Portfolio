import assert from "node:assert/strict";
import test from "node:test";
import {
  checkEmailWithHunter,
  HUNTER_QUOTA_PAUSE_SECONDS,
} from "../src/lib/hunter-email-validation.js";

function createServices() {
  const values = new Map();
  const expiries = new Map();
  return {
    values,
    expiries,
    redis: {
      async get(key) {
        return values.get(key) ?? null;
      },
      async set(key, value, { ex }) {
        values.set(key, value);
        expiries.set(key, ex);
      },
    },
    rateLimiter: {
      async limit() {
        return { success: true };
      },
    },
  };
}

function response(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

test("Hunter only rejects an explicitly invalid result", async () => {
  const cases = [
    [{ data: { status: "valid" } }, "valid"],
    [{ data: { status: "invalid" } }, "invalid"],
    [{ data: { status: "accept_all" } }, "unknown"],
    [{ data: {} }, "unknown"],
  ];

  for (const [payload, expected] of cases) {
    const services = createServices();
    const result = await checkEmailWithHunter("person@example.com", {
      apiKey: "test-key",
      ...services,
      ipHash: "ip-hash",
      hashValue: () => expected,
      fetchImpl: async () => response(payload),
    });
    assert.deepEqual(result, { status: expected });
  }
});

test("missing Hunter configuration skips the provider request", async () => {
  const result = await checkEmailWithHunter("person@example.com", {
    apiKey: "",
    fetchImpl: async () => {
      throw new Error("Hunter must not be called without a key.");
    },
  });
  assert.deepEqual(result, { status: "skipped" });
});

test("Hunter usage-limit responses pause checks without blocking the form", async () => {
  const services = createServices();
  let requests = 0;
  const options = {
    apiKey: "test-key",
    ...services,
    ipHash: "ip-hash",
    hashValue: () => "email-hash",
    fetchImpl: async () => {
      requests += 1;
      return response({ errors: ["usage limit"] }, 429);
    },
  };

  assert.deepEqual(
    await checkEmailWithHunter("person@example.com", options),
    { status: "skipped" }
  );
  assert.equal(
    services.expiries.get("contact:hunter:quota-paused"),
    HUNTER_QUOTA_PAUSE_SECONDS
  );
  assert.deepEqual(
    await checkEmailWithHunter("person@example.com", options),
    { status: "skipped" }
  );
  assert.equal(requests, 1, "the exhausted provider should not be called again");
});

test("Hunter request throttling is not treated as exhausted monthly credits", async () => {
  const services = createServices();
  await assert.rejects(
    checkEmailWithHunter("person@example.com", {
      apiKey: "test-key",
      ...services,
      ipHash: "ip-hash",
      hashValue: () => "email-hash",
      fetchImpl: async () => response({ errors: ["rate limit"] }, 403),
    }),
    { name: "HunterHttpError", status: 403 }
  );
  assert.equal(services.values.has("contact:hunter:quota-paused"), false);
});

test("a cached result avoids another Hunter credit and request", async () => {
  const services = createServices();
  let requests = 0;
  const options = {
    apiKey: "test-key",
    ...services,
    ipHash: "ip-hash",
    hashValue: () => "email-hash",
    fetchImpl: async () => {
      requests += 1;
      return response({ data: { status: "valid" } });
    },
  };

  assert.deepEqual(
    await checkEmailWithHunter("person@example.com", options),
    { status: "valid" }
  );
  assert.deepEqual(
    await checkEmailWithHunter("person@example.com", options),
    { status: "valid" }
  );
  assert.equal(requests, 1);
});
