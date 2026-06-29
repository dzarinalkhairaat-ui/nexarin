"use server";

import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { requireAdminSession } from "@/features/admin/admin.helpers";

const PAYMENT_IMAGE_BUCKET = "news-images"; // We reuse news-images bucket to avoid needing to create a new one
const STORAGE_PREFIX = "qris";

const TARGET_IMAGE_SIZE_BYTES = 300 * 1024;
const TARGET_IMAGE_SIZE_LABEL = "300 KB";
const MAX_INPUT_IMAGE_SIZE_MB = 10;
const MAX_INPUT_IMAGE_SIZE_BYTES = MAX_INPUT_IMAGE_SIZE_MB * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1200;
const MIN_IMAGE_DIMENSION = 300;

function normalizeText(value) {
  return String(value || "").trim();
}

function formatFileSize(bytes) {
  const size = Number(bytes || 0);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(size >= 100 * 1024 ? 0 : 1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "ENV Supabase belum lengkap. Pastikan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY tersedia."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function isAllowedImage(file) {
  const type = String(file?.type || "").toLowerCase();
  const name = String(file?.name || "").toLowerCase();

  if (type.startsWith("image/")) {
    return true;
  }
  return /\.(jpg|jpeg|png|webp|gif|bmp|tiff|avif|heic|heif)$/i.test(name);
}

function createStoragePath() {
  return `${STORAGE_PREFIX}/${Date.now()}-${randomUUID()}.webp`;
}

async function renderWebp(inputBuffer, maxDimension, quality) {
  const result = await sharp(inputBuffer, {
    failOn: "none",
    animated: false,
  })
    .rotate()
    .resize({
      width: maxDimension,
      height: maxDimension,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality,
      effort: 6,
      smartSubsample: true,
    })
    .toBuffer({
      resolveWithObject: true,
    });

  return {
    buffer: result.data,
    info: result.info,
    quality,
    maxDimension,
    size: result.data.length,
  };
}

async function compressImageToTargetWebp(inputBuffer) {
  let maxDimension = MAX_IMAGE_DIMENSION;
  let quality = 82;
  let bestResult = null;

  for (let attempt = 0; attempt < 28; attempt += 1) {
    const result = await renderWebp(inputBuffer, maxDimension, quality);

    if (!bestResult || result.size < bestResult.size) {
      bestResult = result;
    }

    if (result.size <= TARGET_IMAGE_SIZE_BYTES) {
      return result;
    }

    if (quality > 42) {
      quality -= 8;
    } else {
      maxDimension = Math.max(
        MIN_IMAGE_DIMENSION,
        Math.floor(maxDimension * 0.84)
      );
      quality = 74;
    }
  }

  if (!bestResult) {
    throw new Error("Gambar gagal dikompres.");
  }

  if (bestResult.size > TARGET_IMAGE_SIZE_BYTES) {
    throw new Error(
      `Gambar gagal dikompres sampai maksimal ${TARGET_IMAGE_SIZE_LABEL}. Ukuran terbaik: ${formatFileSize(
        bestResult.size
      )}. Coba gunakan gambar yang lebih ringan atau lebih kecil.`
    );
  }

  return bestResult;
}

function getStoragePathFromPublicUrl(publicUrl) {
  const url = normalizeText(publicUrl);
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);
    const marker = `/storage/v1/object/public/${PAYMENT_IMAGE_BUCKET}/`;
    const decodedPath = decodeURIComponent(parsedUrl.pathname);
    const markerIndex = decodedPath.indexOf(marker);

    if (markerIndex === -1) {
      return "";
    }

    return decodedPath.slice(markerIndex + marker.length);
  } catch {
    return "";
  }
}

export async function uploadQrisImageAction(formData) {
  try {
    const adminSession = await requireAdminSession();

    if (!adminSession.ok) {
      return adminSession;
    }

    const file = formData?.get("file");

    if (!file || typeof file.arrayBuffer !== "function") {
      return {
        ok: false,
        message: "File gambar QRIS tidak ditemukan.",
      };
    }

    if (!isAllowedImage(file)) {
      return {
        ok: false,
        message:
          "File harus berupa gambar. Gunakan JPG, PNG, WEBP, AVIF, GIF, BMP, atau TIFF.",
      };
    }

    if (file.size > MAX_INPUT_IMAGE_SIZE_BYTES) {
      return {
        ok: false,
        message: `Ukuran gambar terlalu besar. Maksimal input ${MAX_INPUT_IMAGE_SIZE_MB} MB sebelum kompres.`,
      };
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const compressedResult = await compressImageToTargetWebp(inputBuffer);
    const storagePath = createStoragePath();

    const supabase = createSupabaseAdminClient();

    const { error: uploadError } = await supabase.storage
      .from(PAYMENT_IMAGE_BUCKET)
      .upload(storagePath, compressedResult.buffer, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(PAYMENT_IMAGE_BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = data?.publicUrl || "";

    if (!publicUrl) {
      throw new Error("Public URL gambar gagal dibuat.");
    }

    return {
      ok: true,
      message: `Gambar berhasil dikompres dan diupload.`,
      qrisImageUrl: publicUrl,
      storagePath,
    };
  } catch (error) {
    console.error("Gagal upload dan kompres gambar QRIS:", error);

    return {
      ok: false,
      message:
        error?.message ||
        "Gambar gagal dikompres atau diupload. Cek Supabase Storage dan coba lagi.",
    };
  }
}

export async function deleteQrisImageAction(publicUrl) {
  try {
    const adminSession = await requireAdminSession();

    if (!adminSession.ok) {
      return adminSession;
    }

    const storagePath = getStoragePathFromPublicUrl(publicUrl);

    if (!storagePath) {
      return {
        ok: true,
        message: "URL gambar tidak valid atau tidak berasal dari Supabase Storage.",
      };
    }

    const supabase = createSupabaseAdminClient();

    const { error } = await supabase.storage
      .from(PAYMENT_IMAGE_BUCKET)
      .remove([storagePath]);

    if (error) {
      throw error;
    }

    return {
      ok: true,
      message: "File gambar QRIS berhasil dihapus dari storage.",
    };
  } catch (error) {
    console.error("Gagal menghapus gambar QRIS dari storage:", error);

    return {
      ok: false,
      message:
        error?.message ||
        "Database dihapus, tapi file storage gagal dihapus.",
    };
  }
}
