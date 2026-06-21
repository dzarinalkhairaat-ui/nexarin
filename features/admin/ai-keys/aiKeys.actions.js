"use server";

import { requireAdminSession } from "@/features/admin/admin.helpers";
import { prisma } from "@/lib/prisma";
import { parseRawAiKeysText } from "./aiKeyParser";
import { encryptAiKey, hashAiKey } from "@/lib/ai/aiKeyCrypto";

/**
 * Core action to process and store keys from raw formatted text.
 */
export async function processAiKeysUpload(rawText) {
  await requireAdminSession();
  
  const parsedItems = parseRawAiKeysText(rawText);
  
  let insertedCount = 0;
  let duplicateCount = 0;
  let invalidCount = 0;
  let accountCreatedCount = 0;
  const logs = [];

  for (const item of parsedItems) {
    const preview = item.preview || "Tidak_Diketahui";

    if (!item.provider) {
      invalidCount++;
      logs.push({ status: "error", message: `Ditolak: Format Key "${preview}" tidak valid. Harus diawali dengan 'AIzaSy' atau 'AQ.' (Gemini) atau 'gsk_' (Groq).` });
      continue;
    }

    const hashedKey = hashAiKey(item.key);
    
    // Check if key already exists
    const existingKey = await prisma.aiApiKey.findUnique({
      where: { keyHash: hashedKey }
    });

    if (existingKey) {
      duplicateCount++;
      logs.push({ status: "warning", message: `Diabaikan: Key ${item.provider} "${preview}" sudah ada di database.` });
      continue;
    }

    // Upsert or fetch account
    let account = await prisma.aiApiAccount.findUnique({
      where: { email: item.email }
    });

    if (!account) {
      account = await prisma.aiApiAccount.create({
        data: { email: item.email }
      });
      accountCreatedCount++;
    }

    // Insert new key
    await prisma.aiApiKey.create({
      data: {
        accountId: account.id,
        provider: item.provider,
        keyCipher: encryptAiKey(item.key),
        keyHash: hashedKey,
        keyPreview: item.preview
      }
    });

    insertedCount++;
    logs.push({ status: "success", message: `Diterima: Key ${item.provider} "${preview}" berhasil disimpan untuk akun ${item.email}.` });
  }

  return {
    success: true,
    data: {
      totalRead: parsedItems.length,
      insertedCount,
      duplicateCount,
      invalidCount,
      accountCreatedCount,
      logs
    }
  };
}

/**
 * Action specifically for the manual input form.
 */
export async function processManualAiKeys(email, keysText) {
  await requireAdminSession();
  
  if (!email || !keysText) {
    return { success: false, error: "Email dan API Key wajib diisi" };
  }

  // Format manual input to match the parser's expected format
  const rawText = `- ${email}\n${keysText}`;
  return processAiKeysUpload(rawText);
}

/**
 * Fetch stats for the dashboard.
 */
export async function getAiKeysStats() {
  await requireAdminSession();
  
  const totalAccounts = await prisma.aiApiAccount.count();
  const geminiKeys = await prisma.aiApiKey.count({ where: { provider: "GEMINI" } });
  const groqKeys = await prisma.aiApiKey.count({ where: { provider: "GROQ" } });
  
  return {
    success: true,
    data: {
      totalAccounts,
      geminiKeys,
      groqKeys,
      totalKeys: geminiKeys + groqKeys
    }
  };
}

/**
 * Get all active API keys with their account details.
 */
export async function getActiveAiKeys() {
  await requireAdminSession();
  
  try {
    const keys = await prisma.aiApiKey.findMany({
      include: {
        account: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return { success: true, data: keys };
  } catch (error) {
    console.error("Error fetching keys:", error);
    return { success: false, error: "Gagal mengambil data keys." };
  }
}

/**
 * Delete a specific API key and its account if no keys remain.
 */
export async function deleteAiKey(keyId) {
  await requireAdminSession();
  
  try {
    const key = await prisma.aiApiKey.findUnique({
      where: { id: keyId },
      include: { account: true }
    });
    
    if (!key) return { success: false, error: "Key tidak ditemukan." };
    
    // Delete the key
    await prisma.aiApiKey.delete({ where: { id: keyId } });
    
    // Check if the account has any other keys left
    const remainingKeys = await prisma.aiApiKey.count({
      where: { accountId: key.accountId }
    });
    
    if (remainingKeys === 0) {
      await prisma.aiApiAccount.delete({
        where: { id: key.accountId }
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting key:", error);
    return { success: false, error: "Gagal menghapus key." };
  }
}

