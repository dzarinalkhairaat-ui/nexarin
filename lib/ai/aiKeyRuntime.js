import { prisma } from "@/lib/prisma";
import { decryptAiKey } from "./aiKeyCrypto";
import { sendAiKeyOffEmail } from "@/lib/email/sendAiKeyOffEmail";

/**
 * Fetches active keys for a specific provider, ordered by oldest updated first.
 */
async function getKeysForProvider(provider) {
  return await prisma.aiApiKey.findMany({
    where: { provider },
    include: { account: true },
    orderBy: { updatedAt: 'asc' }
  });
}

/**
 * Handles the failure of a key (401/403). Deletes the key and optionally the account, then sends SMTP alert.
 */
async function handleKeyFailure(key) {
  try {
    // Delete the key
    await prisma.aiApiKey.delete({ where: { id: key.id } });
    
    // Check remaining keys for the account
    const remaining = await prisma.aiApiKey.count({ where: { accountId: key.accountId } });
    let accountDeleted = false;
    
    if (remaining === 0) {
      await prisma.aiApiAccount.delete({ where: { id: key.accountId } });
      accountDeleted = true;
    }
    
    // Send email alert
    await sendAiKeyOffEmail({
      accountEmail: key.account.email,
      provider: key.provider,
      accountDeleted
    });
  } catch (err) {
    console.error("Error handling key failure:", err);
  }
}

/**
 * Updates the timestamp to mark that we just used this key.
 */
async function markKeyAsUsed(keyId) {
  await prisma.aiApiKey.update({
    where: { id: keyId },
    data: { updatedAt: new Date() }
  });
}

/**
 * Main AI Execution Runtime with Auto-Rotation and Fallback.
 * @param {Function} executorFn - An async function that takes (plainKey, provider) and returns the AI result. Must throw an Error object with a `status` property if it fails.
 * @returns The result of executorFn
 */
export async function executeWithRotatedKey(executorFn) {
  // 1. Coba Gemini terlebih dahulu
  let geminiKeys = await getKeysForProvider("GEMINI");
  
  for (const key of geminiKeys) {
    try {
      const plainKey = decryptAiKey(key.keyCipher);
      await markKeyAsUsed(key.id);
      
      const result = await executorFn(plainKey, "GEMINI");
      return result; // Jika sukses, langsung kembalikan hasil
    } catch (error) {
      const status = error.status || error.response?.status;
      
      if (status === 401 || status === 403) {
        // Key mati atau dibanned
        await handleKeyFailure(key);
        continue; // Lanjut coba key Gemini lainnya
      } else {
        // Status 429 (Rate Limit), 500, atau lainnya -> skip dan coba key lain tanpa menghapus key
        continue;
      }
    }
  }
  
  // 2. Jika semua Gemini gagal/habis limit, fallback ke Groq
  let groqKeys = await getKeysForProvider("GROQ");
  
  for (const key of groqKeys) {
    try {
      const plainKey = decryptAiKey(key.keyCipher);
      await markKeyAsUsed(key.id);
      
      const result = await executorFn(plainKey, "GROQ");
      return result;
    } catch (error) {
      const status = error.status || error.response?.status;
      
      if (status === 401 || status === 403) {
        await handleKeyFailure(key);
        continue;
      } else {
        continue;
      }
    }
  }

  // 3. Jika semua key (Gemini & Groq) gagal dicoba
  throw new Error("Semua API Key (Gemini & Groq) sedang limit atau tidak valid. Silakan tambah API Key baru.");
}
