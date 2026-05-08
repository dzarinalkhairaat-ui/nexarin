export function safeText(value, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim() || fallback;
}
