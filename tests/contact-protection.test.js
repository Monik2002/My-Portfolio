import assert from "node:assert/strict";
import test from "node:test";
import {
  CONTACT_COOLDOWN_MS,
  CONTACT_MINIMUM_DWELL_MS,
  getContactSubmissionBlockReason,
} from "../src/lib/contact-protection.js";

test("blocks honeypot submissions", () => {
  assert.equal(
    getContactSubmissionBlockReason({
      honeypotValue: "filled by bot",
      formLoadedAt: 0,
      now: 10_000,
    }),
    "honeypot"
  );
});

test("requires a minimum form dwell time", () => {
  assert.equal(
    getContactSubmissionBlockReason({
      formLoadedAt: 10_000,
      now: 10_000 + CONTACT_MINIMUM_DWELL_MS - 1,
    }),
    "too-early"
  );
});

test("applies a cooldown after a recent submission", () => {
  assert.equal(
    getContactSubmissionBlockReason({
      formLoadedAt: 0,
      lastSubmission: 10_000,
      now: 10_000 + CONTACT_COOLDOWN_MS - 1,
    }),
    "rate-limited"
  );
});

test("allows a normal submission after the cooldown", () => {
  assert.equal(
    getContactSubmissionBlockReason({
      formLoadedAt: 0,
      lastSubmission: 10_000,
      now: 10_000 + CONTACT_COOLDOWN_MS,
    }),
    null
  );
});
