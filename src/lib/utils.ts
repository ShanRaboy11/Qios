import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isNetworkOrServerDownError(err: unknown): boolean {
  if (!err) return false;

  if (typeof err === "string") {
    const lower = err.toLowerCase();
    return (
      lower.includes("fetch failed") ||
      lower.includes("enotfound") ||
      lower.includes("network") ||
      lower.includes("failed to fetch") ||
      lower.includes("connection refused") ||
      lower.includes("econnrefused") ||
      lower.includes("timed out") ||
      lower.includes("timeout") ||
      lower.includes("getaddrinfo") ||
      lower.includes("supabase admin credentials") ||
      lower.includes("service unavailable") ||
      lower.includes("503") ||
      lower.includes("502") ||
      lower.includes("504")
    );
  }

  const errorObj = err as Record<string, unknown>;
  const msg = String(
    errorObj.message || errorObj.error_description || ""
  ).toLowerCase();
  const name = String(errorObj.name || "").toLowerCase();
  const status = Number(errorObj.status || 0);

  const cause = errorObj.cause as Record<string, unknown> | undefined;
  const causeCode = String(cause?.code || "").toUpperCase();
  const causeMsg = String(cause?.message || "").toLowerCase();

  return (
    name.includes("fetch") ||
    name === "authretryablefetcherror" ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    causeCode === "ENOTFOUND" ||
    causeCode === "ECONNREFUSED" ||
    causeCode === "ETIMEDOUT" ||
    causeCode === "EHOSTUNREACH" ||
    msg.includes("fetch failed") ||
    msg.includes("enotfound") ||
    msg.includes("network") ||
    msg.includes("failed to fetch") ||
    msg.includes("connection refused") ||
    msg.includes("econnrefused") ||
    msg.includes("timed out") ||
    msg.includes("timeout") ||
    msg.includes("getaddrinfo") ||
    msg.includes("service unavailable") ||
    causeMsg.includes("enotfound") ||
    causeMsg.includes("fetch failed")
  );
}
