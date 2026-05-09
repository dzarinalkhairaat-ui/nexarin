"use server";

import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { requireAdminSession } from "@/features/admin/admin.helpers";

const NEWS_IMAGE_BUCKET = "news-images";
const TARGET_IMAGE_SIZE_BYTES = 300 * 1024;
const TARGET_IMAGE_SIZE_LABEL = "300 KB";
const MAX_INPUT_IMAGE_SIZE_MB = 25;
const MAX_INPUT_IMAGE_SIZE_BYTES = MAX_INPUT_IMAGE_SIZE_MB * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1400;
const MIN_IMAGE_DIMENSION = 420;

function normalizeText(value) {
  return String(value || "").trim();
}

function createSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatFileSize(bytes) {
  const size = Number(bytes || 0);

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(size >= 100 * 1024 ? 0 : 1)} KB`;
  }

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

function createStoragePath({ fileName, title, slug }) {
  const articleSlug =
    createSlug(slug || title || fileName || "artikel-news") || "artikel-news";

  return `${articleSlug}/${Date.now()}-${randomUUID()}.webp`;
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

function createImageMeta({ file, compressedResult, publicUrl, storagePath }) {
  const originalSize = Number(file?.size || 0);
  const compressedSize = Number(compressedResult?.size || 0);
  const savedPercent =
    originalSize > 0
      ? Math.max(0, Math.round((1 - compressedSize / originalSize) * 100))
      : 0;

  return {
    originalName: file?.name || "gambar-artikel",
    originalType: file?.type || "image",
    originalSize,
    originalSizeLabel: formatFileSize(originalSize),
    compressedSize,
    compressedSizeLabel: formatFileSize(compressedSize),
    outputFormat: "WEBP",
    width: compressedResult?.info?.width || 0,
    height: compressedResult?.info?.height || 0,
    quality: compressedResult?.quality || 0,
    savedPercent,
    targetSizeLabel: TARGET_IMAGE_SIZE_LABEL,
    publicUrl,
    storagePath,
  };
}

function getStoragePathFromPublicUrl(publicUrl) {
  const url = normalizeText(publicUrl);

  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);
    const marker = `/storage/v1/object/public/${NEWS_IMAGE_BUCKET}/`;
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

export async function uploadNewsCoverImageAction(formData) {
  try {
    const adminSession = await requireAdminSession();

    if (!adminSession.ok) {
      return adminSession;
    }

    const file = formData?.get("file");
    const title = normalizeText(formData?.get("title"));
    const slug = normalizeText(formData?.get("slug"));

    if (!file || typeof file.arrayBuffer !== "function") {
      return {
        ok: false,
        message: "File gambar tidak ditemukan.",
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
    const storagePath = createStoragePath({
      fileName: file.name,
      title,
      slug,
    });

    const supabase = createSupabaseAdminClient();

    const { error: uploadError } = await supabase.storage
      .from(NEWS_IMAGE_BUCKET)
      .upload(storagePath, compressedResult.buffer, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(NEWS_IMAGE_BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = data?.publicUrl || "";

    if (!publicUrl) {
      throw new Error("Public URL gambar gagal dibuat.");
    }

    return {
      ok: true,
      message: `Gambar berhasil dikompres menjadi ${formatFileSize(
        compressedResult.size
      )} dan diupload sebagai WEBP.`,
      coverImageUrl: publicUrl,
      storagePath,
      meta: createImageMeta({
        file,
        compressedResult,
        publicUrl,
        storagePath,
      }),
    };
  } catch (error) {
    console.error("Gagal upload dan kompres gambar News:", error);

    return {
      ok: false,
      message:
        error?.message ||
        "Gambar gagal dikompres atau diupload. Cek Supabase Storage dan coba lagi.",
    };
  }
}

export async function deleteNewsCoverImageAction(publicUrl) {
  try {
    const adminSession = await requireAdminSession();

    if (!adminSession.ok) {
      return adminSession;
    }

    const storagePath = getStoragePathFromPublicUrl(publicUrl);

    if (!storagePath) {
      return {
        ok: true,
        message:
          "URL gambar bukan dari bucket news-images, jadi hanya database yang dikosongkan.",
      };
    }

    const supabase = createSupabaseAdminClient();

    const { error } = await supabase.storage
      .from(NEWS_IMAGE_BUCKET)
      .remove([storagePath]);

    if (error) {
      throw error;
    }

    return {
      ok: true,
      message: "File gambar berhasil dihapus dari Supabase Storage.",
      storagePath,
    };
  } catch (error) {
    console.error("Gagal menghapus gambar News dari storage:", error);

    return {
      ok: false,
      message:
        error?.message ||
        "Database bisa dikosongkan, tapi file storage gagal dihapus.",
    };
  }
}