const AUTH_SESSION_EXPIRY_KEY = "qios-auth-expires-at";

export function setAuthSessionExpiry(hours: number) {
  if (typeof window === "undefined" || !Number.isFinite(hours) || hours <= 0) {
    return null;
  }

  const expiresAt = Date.now() + hours * 60 * 60 * 1000;
  window.localStorage.setItem(AUTH_SESSION_EXPIRY_KEY, String(expiresAt));
  return expiresAt;
}

export function getAuthSessionExpiry() {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(AUTH_SESSION_EXPIRY_KEY);
  if (!value) return null;

  const expiresAt = Number(value);
  return Number.isFinite(expiresAt) ? expiresAt : null;
}

export function clearAuthSessionExpiry() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_SESSION_EXPIRY_KEY);
}

export function isAuthSessionExpired() {
  const expiresAt = getAuthSessionExpiry();
  return expiresAt !== null && Date.now() >= expiresAt;
}