export const WELCOME_SESSION_KEY = "portfolio-welcome-shown";

export function shouldShowWelcome(sessionStorage, prefersReducedMotion = false) {
  if (prefersReducedMotion) return false;
  return sessionStorage.getItem(WELCOME_SESSION_KEY) !== "true";
}

export function markWelcomeShown(sessionStorage) {
  sessionStorage.setItem(WELCOME_SESSION_KEY, "true");
}
