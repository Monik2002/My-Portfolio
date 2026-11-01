import assert from "node:assert/strict";
import test from "node:test";
import {
  markWelcomeShown,
  shouldShowWelcome,
  WELCOME_SESSION_KEY,
} from "../src/lib/welcome-session.js";

test("shows the welcome animation only once per browser session", () => {
  const values = new Map();
  const sessionStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };

  assert.equal(shouldShowWelcome(sessionStorage), true);
  markWelcomeShown(sessionStorage);
  assert.equal(shouldShowWelcome(sessionStorage), false);
  assert.equal(values.get(WELCOME_SESSION_KEY), "true");
});

test("skips the welcome animation when reduced motion is preferred", () => {
  const sessionStorage = {
    getItem() {
      assert.fail("Storage should not be read when motion is reduced.");
    },
    setItem() {
      assert.fail("Storage should not be written when motion is reduced.");
    },
  };

  assert.equal(shouldShowWelcome(sessionStorage, true), false);
});

test("surfaces browser storage failures for the caller to handle", () => {
  const sessionStorage = {
    getItem() {
      throw new Error("storage blocked");
    },
    setItem() {
      assert.fail("Should not write when storage cannot be read.");
    },
  };

  assert.throws(() => shouldShowWelcome(sessionStorage), /storage blocked/);
});

test("surfaces failures while marking the welcome session", () => {
  assert.throws(
    () => markWelcomeShown({ setItem() { throw new Error("storage blocked"); } }),
    /storage blocked/
  );
});
