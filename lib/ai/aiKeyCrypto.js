import crypto from "node:crypto";

const ENCRYPTION_SECRET = process.env.AI_KEY_ENCRYPTION_SECRET || "default_dev_secret_please_change_in_production";
// Derive a 32-byte key for aes-256-gcm using sha256 hash of the secret
const getDerivedKey = () => crypto.createHash('sha256').update(ENCRYPTION_SECRET).digest();

/**
 * Encrypts a plain text API key into a secure cipher string format (IV:Cipher:AuthTag).
 */
export function encryptAiKey(plainKey) {
  if (!plainKey) return null;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", getDerivedKey(), iv);
  
  let encrypted = cipher.update(plainKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}

/**
 * Decrypts a cipher string format (IV:Cipher:AuthTag) back to the plain text API key.
 */
export function decryptAiKey(cipherText) {
  if (!cipherText) return null;
  const parts = cipherText.split(":");
  if (parts.length !== 3) throw new Error("Invalid cipher format");
  
  const iv = Buffer.from(parts[0], "hex");
  const encrypted = parts[1];
  const authTag = Buffer.from(parts[2], "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", getDerivedKey(), iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}

/**
 * Creates a stable HMAC hash for duplicate checking without exposing the plain key.
 */
export function hashAiKey(plainKey) {
  if (!plainKey) return null;
  return crypto.createHmac("sha256", ENCRYPTION_SECRET).update(plainKey).digest("hex");
}
