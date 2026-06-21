import { detectAiProvider, getPreviewAiKey } from "./aiKey.helpers";

/**
 * Parses raw text into a normalized array of key objects.
 * Expects format:
 * - email@gmail.com
 * AIzaSy...
 * gsk_...
 * 
 * @param {string} rawText 
 * @returns {Array<{email: string, key: string, provider: string|null, preview: string}>}
 */
export function parseRawAiKeysText(rawText) {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const results = [];
  
  let currentEmail = null;

  for (const line of lines) {
    // Detect email marker
    if (line.startsWith("-")) {
      const potentialEmail = line.replace(/^-+\s*/, "").toLowerCase().trim();
      if (potentialEmail.includes("@")) {
        currentEmail = potentialEmail;
        continue;
      }
    }
    
    // If we haven't found an email yet, skip these lines
    if (!currentEmail) {
      continue;
    }

    const provider = detectAiProvider(line);
    
    // If format isn't matched, push with null provider so it counts as invalid
    if (!provider) {
      results.push({ email: currentEmail, key: line, provider: null, preview: getPreviewAiKey(line) });
      continue;
    }

    results.push({
      email: currentEmail,
      key: line,
      provider: provider,
      preview: getPreviewAiKey(line)
    });
  }

  // Deduplicate within the same parsed batch
  const uniqueResults = [];
  const seenKeys = new Set();
  
  for (const item of results) {
    if (item.provider === null) {
      // Keep invalid items so we can report them
      uniqueResults.push(item);
      continue;
    }
    
    if (!seenKeys.has(item.key)) {
      seenKeys.add(item.key);
      uniqueResults.push(item);
    }
  }

  return uniqueResults;
}
