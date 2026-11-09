const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hasHeaderControlCharacters(value) {
  return Array.from(value).some((character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  });
}

function hasDisallowedMessageControls(value) {
  return Array.from(value).some((character) => {
    const code = character.charCodeAt(0);
    return (
      (code < 32 && code !== 9 && code !== 10 && code !== 13) ||
      code === 127
    );
  });
}

export function isValidContactEmail(value) {
  return (
    typeof value === "string" &&
    value.trim().length <= 254 &&
    EMAIL_PATTERN.test(value.trim())
  );
}

export function normalizeEmailForContactLimit(value) {
  if (!isValidContactEmail(value)) return null;

  const [localPart, domainPart] = value.trim().toLowerCase().split("@");
  const domain =
    domainPart === "googlemail.com" ? "gmail.com" : domainPart;

  if (domain === "gmail.com") {
    return `${localPart.split("+", 1)[0].replaceAll(".", "")}@gmail.com`;
  }

  return `${localPart}@${domain}`;
}

export function getDailyContactQuotaWindow(now = Date.now()) {
  const instant = new Date(now);
  if (!Number.isFinite(instant.getTime())) {
    throw new RangeError("The contact quota date must be valid.");
  }

  const nextUtcMidnight = Date.UTC(
    instant.getUTCFullYear(),
    instant.getUTCMonth(),
    instant.getUTCDate() + 1
  );
  return {
    date: instant.toISOString().slice(0, 10),
    expiresInSeconds: Math.max(
      60,
      Math.ceil((nextUtcMidnight - instant.getTime()) / 1000) + 60
    ),
  };
}

export function validateContactSubmission(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { error: "invalid" };
  }

  const name = typeof value.name === "string" ? value.name.trim() : "";
  const email = typeof value.email === "string" ? value.email.trim() : "";
  const subject =
    typeof value.subject === "string" ? value.subject.trim() : "";
  const message =
    typeof value.message === "string" ? value.message.trim() : "";

  if (
    !name ||
    name.length > 100 ||
    hasHeaderControlCharacters(name) ||
    !isValidContactEmail(email) ||
    !subject ||
    subject.length > 150 ||
    hasHeaderControlCharacters(subject) ||
    !message ||
    message.length > 3000 ||
    hasDisallowedMessageControls(message)
  ) {
    return { error: "invalid" };
  }

  return {
    value: { name, email, subject, message },
  };
}
