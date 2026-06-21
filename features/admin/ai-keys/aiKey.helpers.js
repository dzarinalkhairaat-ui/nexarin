/**
 * Detects whether the provided key belongs to Gemini or Groq based on prefix.
 * @param {string} key - Raw API key
 * @returns {"GEMINI" | "GROQ" | null} Provider enum string or null if invalid
 */
export function detectAiProvider(key) {
  if (!key) return null;
  const trimmed = key.trim();
  // Mendukung format lama (AIza) dan format baru (AQ.) dari Google AI Studio
  if (trimmed.startsWith("AIza") || trimmed.startsWith("AQ.")) return "GEMINI";
  if (trimmed.startsWith("gsk_")) return "GROQ";
  return null;
}

/**
 * Masks the API key for safe UI display (e.g. AIzaSy...9xQp)
 * @param {string} key - Raw API key
 * @returns {string} Masked preview string
 */
export function getPreviewAiKey(key) {
  if (!key || key.length < 10) return "INVALID";
  const trimmed = key.trim();
  const first = trimmed.slice(0, 6);
  const last = trimmed.slice(-4);
  return `${first}...${last}`;
}
