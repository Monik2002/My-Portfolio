import assert from "node:assert/strict";
import test from "node:test";
import {
  getDailyContactQuotaWindow,
  isValidContactEmail,
  normalizeEmailForContactLimit,
  validateContactSubmission,
} from "../src/lib/contact-validation.js";

test("validates email syntax without claiming mailbox ownership", () => {
  assert.equal(isValidContactEmail(" person@example.com "), true);
  assert.equal(isValidContactEmail("not-an-email"), false);
  assert.equal(isValidContactEmail(""), false);
  assert.equal(isValidContactEmail(`${"a".repeat(243)}@example.com`), false);
});

test("groups Gmail aliases under one daily contact quota", () => {
  assert.equal(
    normalizeEmailForContactLimit("Some.Name+portfolio@gmail.com"),
    "somename@gmail.com"
  );
  assert.equal(
    normalizeEmailForContactLimit("s.o.m.e.n.a.m.e@googlemail.com"),
    "somename@gmail.com"
  );
});

test("normalizes other addresses without changing provider-specific aliases", () => {
  assert.equal(
    normalizeEmailForContactLimit(" Person+tag@Example.com "),
    "person+tag@example.com"
  );
  assert.equal(normalizeEmailForContactLimit("invalid"), null);
});

test("resets the sender quota at UTC midnight", () => {
  assert.deepEqual(
    getDailyContactQuotaWindow(Date.UTC(2026, 10, 1, 23, 59, 0)),
    { date: "2026-11-01", expiresInSeconds: 120 }
  );
  assert.throws(() => getDailyContactQuotaWindow(Number.NaN), RangeError);
});

test("validates and trims contact fields within their limits", () => {
  assert.deepEqual(
    validateContactSubmission({
      name: "  Monik  ",
      email: " person@example.com ",
      subject: "  Hello ",
      message: "  A message ",
    }),
    {
      value: {
        name: "Monik",
        email: "person@example.com",
        subject: "Hello",
        message: "A message",
      },
    }
  );
});

test("rejects invalid and overlong contact payloads", () => {
  assert.deepEqual(validateContactSubmission(null), { error: "invalid" });
  assert.deepEqual(
    validateContactSubmission({
      name: "n".repeat(101),
      email: "person@example.com",
      subject: "Hello",
      message: "A message",
    }),
    { error: "invalid" }
  );
  assert.deepEqual(
    validateContactSubmission({
      name: "Monik",
      email: "person@example.com",
      subject: "Hello",
      message: "m".repeat(3001),
    }),
    { error: "invalid" }
  );
  assert.deepEqual(
    validateContactSubmission({
      name: "Monik",
      email: "person@example.com",
      subject: "Hello\r\nBcc: other@example.com",
      message: "A message",
    }),
    { error: "invalid" }
  );
});
