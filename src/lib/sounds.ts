export function triggerQueueSound() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("qios:sound:queue"));
}

export function triggerScanSound() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("qios:sound:scan"));
}

export function triggerStockSound() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("qios:sound:stock"));
}
