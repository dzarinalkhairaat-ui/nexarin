"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminTopbar from "@/features/admin/components/AdminTopbar";
import AdminNewsNav from "@/features/admin/news/components/AdminNewsNav";
import {
  createNewsArticleAction,
  updateNewsArticleAction,
} from "@/features/admin/news/write/adminNewsArticle.actions";
import {
  deleteNewsCoverImageAction,
  uploadNewsCoverImageAction,
} from "@/features/admin/news/write/adminNewsImage.actions";

const NEXARIN_LOGO = "/images/logo/nexarin-logo.png";
const NEWS_IMAGE_BUCKET = "news-images";
const TARGET_IMAGE_SIZE_LABEL = "300 KB";
const MAX_INPUT_IMAGE_SIZE_MB = 25;

function createInitialForm(categorySlug = "", article = null) {
  if (article) {
    return {
      id: article?.id || "",
      title: article?.title || "",
      slug: article?.slug || "",
      summary: article?.summary || "",
      youtubeUrl: article?.youtubeUrl || "",
      sourceType: article?.sourceType || "artikel-website",
      sourceName: article?.sourceName || "",
      sourceUrl: article?.sourceUrl || "",
      sourceNote:
        article?.sourceNote ||
        "Artikel ini dirangkum dan dikurasi dari sumber tersebut.",
      videoSourceName: article?.videoSourceName || "",
      videoSourceUrl: article?.videoSourceUrl || "",
      content: article?.content || "",
      status: article?.status || "draft",
      categorySlug: article?.categorySlug || categorySlug,
      isHeadline: Boolean(article?.isHeadline),
      isFeatured: Boolean(article?.isFeatured),
      coverImageUrl: article?.coverImageUrl || "",
    };
  }

  return {
    id: "",
    title: "",
    slug: "",
    summary: "",
    youtubeUrl: "",
    sourceType: "artikel-website",
    sourceName: "",
    sourceUrl: "",
    sourceNote: "Artikel ini dirangkum dan dikurasi dari sumber tersebut.",
    videoSourceName: "",
    videoSourceUrl: "",
    content: "",
    status: "draft",
    categorySlug,
    isHeadline: false,
    isFeatured: false,
    coverImageUrl: "",
  };
}

const sourceTypes = [
  {
    label: "Artikel/Website",
    value: "artikel-website",
  },
  {
    label: "Youtube",
    value: "youtube",
  },
  {
    label: "Media Sosial",
    value: "media-sosial",
  },
  {
    label: "Dokumen/Rilis",
    value: "dokumen-rilis",
  },
  {
    label: "Lainnya",
    value: "lainnya",
  },
];

function createSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidCoverImageUrl(value) {
  const imageUrl = String(value || "").trim();

  if (!imageUrl) {
    return true;
  }

  if (imageUrl.startsWith("/")) {
    return true;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("blob:")) {
    try {
      new URL(imageUrl);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

function getCoverImageHelpText(value) {
  const imageUrl = String(value || "").trim();

  if (!imageUrl) {
    return "Kosongkan jika artikel belum punya gambar. Public akan memakai placeholder Nexarin.";
  }

  if (imageUrl.startsWith("/")) {
    return "Path lokal hanya valid jika file-nya ada di folder public project.";
  }

  if (imageUrl.startsWith("blob:")) {
    return "Gambar baru dipilih. Akan diunggah saat Anda menyimpan artikel.";
  }

  return "Gambar ini akan dipakai sebagai cover artikel public.";
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

function FieldLabel({ children }) {
  return (
    <span className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">
      {children}
    </span>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  readOnly = false,
  type = "text",
  disabled = false,
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      disabled={disabled}
      placeholder={placeholder}
      className={[
        "min-h-12 rounded-2xl border border-white/10 bg-slate-950/65 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-60",
        readOnly ? "cursor-not-allowed text-slate-400" : "",
      ].join(" ")}
    />
  );
}

function SelectInput({ value, onChange, children, disabled = false }) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/65 px-4 text-sm font-bold text-white outline-none transition focus:border-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </select>
  );
}

function CoverPreview({ imageUrl }) {
  const safeImageUrl = String(imageUrl || "").trim();

  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/70 shadow-xl shadow-black/20">
      <div className="relative aspect-[16/10] overflow-hidden">
        {safeImageUrl ? (
          <img
            src={safeImageUrl}
            alt="Preview cover artikel"
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_25%_20%,rgba(16,185,129,0.24),transparent_34%),radial-gradient(circle_at_78%_78%,rgba(6,182,212,0.2),transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.2),rgba(2,6,23,0.95))]">
            <div className="flex flex-col items-center justify-center px-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-300/25 bg-slate-950/70 p-3 shadow-lg shadow-cyan-950/30 backdrop-blur-xl">
                <img
                  src={NEXARIN_LOGO}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                Placeholder Nexarin
              </p>

              <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                Cover belum ditambahkan.
              </p>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
      </div>
    </div>
  );
}

function ImageMetaItem({ label, value, tone = "default" }) {
  const toneClass =
    tone === "emerald"
      ? "text-emerald-200"
      : tone === "cyan"
        ? "text-cyan-200"
        : "text-slate-100";

  return (
    <div className="min-w-0 rounded-[18px] border border-white/10 bg-slate-950/45 p-3">
      <p className="truncate text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>

      <p className={`mt-1 truncate text-sm font-black leading-5 ${toneClass}`}>
        {value || "-"}
      </p>
    </div>
  );
}

function ImageCompressionInfo({ imageMeta }) {
  if (!imageMeta) {
    return (
      <div className="rounded-[22px] border border-white/10 bg-slate-950/45 p-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-slate-600" />
          <p className="text-xs font-black text-slate-300">
            Belum ada data kompres
          </p>
        </div>

        <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
          Setelah upload, ukuran asli, hasil kompres, format WEBP, dan dimensi
          gambar akan tampil di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-emerald-400/15 bg-emerald-400/[0.055] shadow-xl shadow-black/10">
      <div className="border-b border-white/10 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-2 text-xs font-black leading-5 text-white">
              {imageMeta.originalName || "gambar-artikel"}
            </p>

            <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-500">
              Sharp compression result
            </p>
          </div>

          <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-200">
            {imageMeta.outputFormat || "WEBP"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3">
        <ImageMetaItem
          label="Asli"
          value={
            imageMeta.originalSizeLabel || formatFileSize(imageMeta.originalSize)
          }
        />

        <ImageMetaItem
          label="Kompres"
          value={
            imageMeta.compressedSizeLabel ||
            formatFileSize(imageMeta.compressedSize)
          }
          tone="emerald"
        />

        <ImageMetaItem
          label="Target"
          value={`≤ ${imageMeta.targetSizeLabel || TARGET_IMAGE_SIZE_LABEL}`}
          tone="cyan"
        />

        <ImageMetaItem
          label="Dimensi"
          value={`${imageMeta.width || 0}×${imageMeta.height || 0}px`}
        />

        <ImageMetaItem
          label="Hemat"
          value={`${imageMeta.savedPercent || 0}%`}
          tone="emerald"
        />

        <ImageMetaItem
          label="Bucket"
          value={NEWS_IMAGE_BUCKET}
          tone="cyan"
        />
      </div>
    </div>
  );
}

function CoverImageUrlField({ value, disabled, onChange }) {
  const safeValue = String(value || "").trim();
  const isValid = isValidCoverImageUrl(safeValue);

  return (
    <label className="grid gap-2">
      <FieldLabel>Cover Image URL</FieldLabel>

      <div
        className={[
          "min-w-0 overflow-hidden rounded-2xl border bg-slate-950/65 px-4",
          isValid ? "border-white/10" : "border-red-400/30",
        ].join(" ")}
      >
        <input
          type="text"
          value={safeValue}
          disabled={disabled}
          onChange={onChange}
          placeholder="Otomatis terisi setelah upload..."
          className="h-12 w-full min-w-0 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {safeValue ? (
        <div className="min-w-0 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.045] px-3 py-2">
          <p className="truncate text-[11px] font-semibold leading-5 text-cyan-100">
            {safeValue}
          </p>
        </div>
      ) : null}

      <p
        className={
          isValid
            ? "text-xs font-semibold leading-5 text-slate-500"
            : "text-xs font-semibold leading-5 text-red-300"
        }
      >
        {isValid
          ? getCoverImageHelpText(safeValue)
          : "URL tidak valid. Gunakan http/https atau path yang diawali /."}
      </p>
    </label>
  );
}

export default function AdminNewsWriteClient({
  categories = [],
  errorMessage = "",
  initialArticle = null,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const safeCategories = Array.isArray(categories)
    ? categories.filter((item) => item?.slug)
    : [];
  const defaultCategorySlug =
    initialArticle?.categorySlug || safeCategories?.[0]?.slug || "";
  const isEditMode = Boolean(initialArticle?.id);

  const [form, setForm] = useState(() =>
    createInitialForm(defaultCategorySlug, initialArticle)
  );
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [imageMeta, setImageMeta] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [alertModal, setAlertModal] = useState({ isOpen: false, message: "", isError: false });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: "", onConfirm: null });

  const showAlert = (message, isError = true) => setAlertModal({ isOpen: true, message, isError });
  const showConfirm = (message, onConfirm) => setConfirmModal({ isOpen: true, message, onConfirm });

  const isFormBusy = isPending || isUploadingImage || isDeletingImage;

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "title" ? { slug: createSlug(value) } : {}),
    }));

    if (field === "coverImageUrl") {
      setImageMeta(null);
    }

    if (statusMessage) {
      setStatusMessage("");
    }
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    setSelectedImageFile(file);
    setImageMeta(null);
    
    setForm((current) => ({
      ...current,
      coverImageUrl: URL.createObjectURL(file),
    }));

    setStatusType("success");
    setStatusMessage(`Gambar dipilih: ${file.name}. Klik Simpan Artikel untuk mengunggah.`);
  }

  async function handleClearCoverImage() {
    showConfirm("Apakah Anda yakin ingin menghapus gambar cover ini?", async () => {
      const previousCoverImageUrl = form.coverImageUrl;
      const nextForm = {
        ...form,
        coverImageUrl: "",
      };

      setForm(nextForm);
      setImageMeta(null);
      setSelectedImageFile(null);

      if (previousCoverImageUrl && previousCoverImageUrl.startsWith("blob:")) {
        setStatusType("success");
        setStatusMessage("Gambar pilihan dibatalkan.");
        return;
      }

      if (!previousCoverImageUrl) {
        setStatusType("success");
        setStatusMessage("Gambar sudah kosong.");
        return;
      }

      if (!isEditMode) {
        const deleteResult = await deleteNewsCoverImageAction(previousCoverImageUrl);

        setStatusType(deleteResult?.ok ? "success" : "error");
        setStatusMessage(
          deleteResult?.message ||
          "Gambar dihapus dari form. Simpan artikel jika ingin menyimpan perubahan."
        );
        return;
      }

      setIsDeletingImage(true);
      setStatusType("success");
      setStatusMessage("Menghapus gambar dari database dan storage...");

      try {
        const updateResult = await updateNewsArticleAction(nextForm);

        if (!updateResult?.ok) {
          setForm(form);
          setStatusType("error");
          setStatusMessage(
            updateResult?.message ||
            "Gambar gagal dihapus dari database. Coba lagi."
          );
          return;
        }

        const deleteResult = await deleteNewsCoverImageAction(
          previousCoverImageUrl
        );

        setStatusType(deleteResult?.ok ? "success" : "error");
        setStatusMessage(
          deleteResult?.ok
            ? "Gambar berhasil dihapus dari database dan storage."
            : "Database sudah dikosongkan, tapi file storage gagal dihapus. Cek Supabase Storage."
        );

        router.refresh();
      } catch (error) {
        console.error("Gagal menghapus gambar artikel:", error);

        setForm(form);
        setStatusType("error");
        setStatusMessage(
          error?.message || "Gambar gagal dihapus. Cek database dan coba lagi."
        );
      } finally {
        setIsDeletingImage(false);
      }
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (isUploadingImage) {
      setStatusType("error");
      setStatusMessage("Tunggu upload gambar selesai dulu sebelum menyimpan.");
      return;
    }

    if (isDeletingImage) {
      setStatusType("error");
      setStatusMessage("Tunggu proses hapus gambar selesai dulu.");
      return;
    }

    if (!safeCategories.length) {
      setStatusType("error");
      setStatusMessage(
        "Kategori belum tersedia. Tambahkan kategori dulu sebelum membuat artikel."
      );
      return;
    }

    if (!form.title.trim() || !form.summary.trim() || !form.content.trim()) {
      setStatusType("error");
      setStatusMessage("Judul, ringkasan, dan isi artikel wajib diisi dulu.");
      return;
    }

    if (!form.categorySlug) {
      setStatusType("error");
      setStatusMessage("Kategori artikel wajib dipilih dulu.");
      return;
    }

    if (!isValidCoverImageUrl(form.coverImageUrl)) {
      setStatusType("error");
      setStatusMessage(
        "Cover Image URL tidak valid. Gunakan URL http/https atau path lokal yang diawali /."
      );
      return;
    }

    setIsUploadingImage(true);
    setStatusType("success");
    setStatusMessage("Menyimpan artikel...");

    startTransition(async () => {
      let finalCoverUrl = form.coverImageUrl;

      if (selectedImageFile) {
        setStatusMessage("Mengunggah gambar...");
        try {
          const formData = new FormData();
          formData.append("file", selectedImageFile);
          formData.append("title", form.title || "");
          formData.append("slug", form.slug || "");

          const uploadResult = await uploadNewsCoverImageAction(formData);

          if (!uploadResult?.ok) {
            setStatusType("error");
            setStatusMessage(uploadResult?.message || "Gambar gagal diupload.");
            setIsUploadingImage(false);
            return;
          }

          finalCoverUrl = uploadResult.coverImageUrl;
          setImageMeta(uploadResult.meta || null);
        } catch (error) {
          console.error("Gagal upload gambar artikel:", error);
          setStatusType("error");
          setStatusMessage("Gambar gagal diupload. Coba gunakan gambar lain.");
          setIsUploadingImage(false);
          return;
        }
      }

      const payload = { ...form, coverImageUrl: finalCoverUrl };

      const result = isEditMode
        ? await updateNewsArticleAction(payload)
        : await createNewsArticleAction(payload);

      if (!result?.ok) {
        if (selectedImageFile && finalCoverUrl && finalCoverUrl !== form.coverImageUrl) {
          await deleteNewsCoverImageAction(finalCoverUrl);
        }
        
        setStatusType("error");
        setStatusMessage(
          result?.message || "Artikel gagal disimpan ke database."
        );
        setIsUploadingImage(false);
        return;
      }

      setStatusType("success");
      setStatusMessage(result?.message || "Artikel berhasil disimpan.");

      router.push("/admin/news/artikel");
      router.refresh();
    });
  }

  function handleReset() {
    showConfirm(isEditMode ? "Apakah Anda yakin ingin membatalkan perubahan dan mereset form?" : "Apakah Anda yakin ingin mengosongkan form?", () => {
      setForm(createInitialForm(defaultCategorySlug, initialArticle));
      setImageMeta(null);
      setSelectedImageFile(null);
      setStatusMessage("");
      setStatusType("success");
    });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <AdminTopbar />
      <AdminNewsNav />

      <section className="relative overflow-hidden bg-slate-950">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
              {isEditMode ? "Perbarui Artikel" : "Tulis Artikel"}
            </h1>
            <p className="text-sm font-medium text-slate-400">
              {isEditMode
                ? "Ubah judul, sumber, isi artikel, kategori, dan gambar."
                : "Lengkapi judul, sumber, isi artikel, kategori, dan gambar."}
            </p>
          </div>

          {errorMessage ? (
            <div className="mt-6 rounded-[26px] border border-red-400/20 bg-red-400/[0.08] p-4">
              <p className="text-sm font-bold leading-6 text-red-200">
                {errorMessage}
              </p>
            </div>
          ) : null}

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start"
          >
            <div className="grid gap-5">
              <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
                <div className="relative z-10 grid gap-4">
                  <div className="grid gap-2">
                    <FieldLabel>Judul Artikel</FieldLabel>
                    <TextInput
                      value={form.title}
                      disabled={isFormBusy}
                      onChange={(event) =>
                        updateField("title", event.target.value)
                      }
                      placeholder="Masukkan judul artikel..."
                    />
                  </div>

                  <div className="grid gap-2">
                    <FieldLabel>Slug URL</FieldLabel>
                    <TextInput
                      value={form.slug}
                      readOnly
                      placeholder="terisi-otomatis-dari-judul"
                    />
                  </div>

                  <div className="grid gap-2">
                    <FieldLabel>Ringkasan</FieldLabel>
                    <textarea
                      value={form.summary}
                      disabled={isFormBusy}
                      onChange={(event) =>
                        updateField("summary", event.target.value)
                      }
                      placeholder="Tulis ringkasan singkat artikel..."
                      rows={4}
                      className="rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3 text-sm font-semibold leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <div className="grid gap-2">
                    <FieldLabel>Link Youtube</FieldLabel>
                    <TextInput
                      type="url"
                      value={form.youtubeUrl}
                      disabled={isFormBusy}
                      onChange={(event) =>
                        updateField("youtubeUrl", event.target.value)
                      }
                      placeholder="Opsional jika artikel punya video..."
                    />
                  </div>
                </div>
              </section>

              <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
                <div className="relative z-10 grid gap-4">
                  <div>
                    <p className="text-lg font-black tracking-[-0.04em] text-white">
                      Sumber Rujukan
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Isi informasi sumber artikel jika tersedia.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <FieldLabel>Tipe Sumber</FieldLabel>
                      <SelectInput
                        value={form.sourceType}
                        disabled={isFormBusy}
                        onChange={(event) =>
                          updateField("sourceType", event.target.value)
                        }
                      >
                        {sourceTypes.map((source) => (
                          <option key={source.value} value={source.value}>
                            {source.label}
                          </option>
                        ))}
                      </SelectInput>
                    </div>

                    <div className="grid gap-2">
                      <FieldLabel>Nama Sumber</FieldLabel>
                      <TextInput
                        value={form.sourceName}
                        disabled={isFormBusy}
                        onChange={(event) =>
                          updateField("sourceName", event.target.value)
                        }
                        placeholder="Kompas.com, Detik.com, iNews..."
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <FieldLabel>Link Sumber</FieldLabel>
                    <TextInput
                      type="url"
                      value={form.sourceUrl}
                      disabled={isFormBusy}
                      onChange={(event) =>
                        updateField("sourceUrl", event.target.value)
                      }
                      placeholder="Opsional jika ada link sumber..."
                    />
                  </div>

                  <div className="grid gap-2">
                    <FieldLabel>Catatan Sumber</FieldLabel>
                    <textarea
                      value={form.sourceNote}
                      disabled={isFormBusy}
                      onChange={(event) =>
                        updateField("sourceNote", event.target.value)
                      }
                      rows={3}
                      className="rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3 text-sm font-semibold leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <FieldLabel>Nama Sumber Video</FieldLabel>
                      <TextInput
                        value={form.videoSourceName}
                        disabled={isFormBusy}
                        onChange={(event) =>
                          updateField("videoSourceName", event.target.value)
                        }
                        placeholder="Nama channel/video..."
                      />
                    </div>

                    <div className="grid gap-2">
                      <FieldLabel>Link Video/Channel</FieldLabel>
                      <TextInput
                        type="url"
                        value={form.videoSourceUrl}
                        disabled={isFormBusy}
                        onChange={(event) =>
                          updateField("videoSourceUrl", event.target.value)
                        }
                        placeholder="Link video atau channel..."
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
                <div className="relative z-10 grid gap-2">
                  <FieldLabel>Isi Artikel</FieldLabel>

                  <textarea
                    value={form.content}
                    disabled={isFormBusy}
                    onChange={(event) =>
                      updateField("content", event.target.value)
                    }
                    placeholder="Tulis isi artikel di sini..."
                    rows={12}
                    className="rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3 text-sm font-semibold leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </section>
            </div>

            <aside className="grid gap-5">
              <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
                <div className="relative z-10 grid gap-4">
                  <div>
                    <p className="text-lg font-black tracking-[-0.04em] text-white">
                      Publish Setting
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Atur status dan kategori artikel.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <FieldLabel>Status</FieldLabel>
                    <SelectInput
                      value={form.status}
                      disabled={isFormBusy}
                      onChange={(event) =>
                        updateField("status", event.target.value)
                      }
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </SelectInput>
                  </div>

                  <div className="grid gap-2">
                    <FieldLabel>Kategori</FieldLabel>
                    <SelectInput
                      value={form.categorySlug}
                      disabled={isFormBusy || !safeCategories.length}
                      onChange={(event) =>
                        updateField("categorySlug", event.target.value)
                      }
                    >
                      {safeCategories.length ? (
                        safeCategories.map((category) => (
                          <option key={category.slug} value={category.slug}>
                            {category.name}
                          </option>
                        ))
                      ) : (
                        <option value="">Belum ada kategori</option>
                      )}
                    </SelectInput>
                  </div>

                  <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-3">
                    <input
                      type="checkbox"
                      checked={form.isHeadline}
                      disabled={isFormBusy}
                      onChange={(event) =>
                        updateField("isHeadline", event.target.checked)
                      }
                      className="mt-1 h-4 w-4 accent-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <span>
                      <span className="block text-sm font-black text-white">
                        Jadikan Headline
                      </span>
                      <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">
                        Artikel akan masuk area headline News.
                      </span>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-3">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      disabled={isFormBusy}
                      onChange={(event) =>
                        updateField("isFeatured", event.target.checked)
                      }
                      className="mt-1 h-4 w-4 accent-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <span>
                      <span className="block text-sm font-black text-white">
                        Jadikan Featured/Popular
                      </span>
                      <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">
                        Artikel akan masuk area featured atau popular.
                      </span>
                    </span>
                  </label>
                </div>
              </section>

              <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
                <div className="relative z-10 grid gap-3">
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-3">
                    <p className="text-lg font-black tracking-[-0.04em] text-white">
                      Gambar Artikel
                    </p>

                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                      Upload gambar, otomatis dikompres server-side memakai Sharp menjadi
                      WEBP maksimal {TARGET_IMAGE_SIZE_LABEL}.
                    </p>
                  </div>

                  <CoverPreview imageUrl={form.coverImageUrl} />

                  <ImageCompressionInfo imageMeta={imageMeta} />

                  <label className="grid gap-2 rounded-[24px] border border-white/10 bg-slate-950/35 p-3">
                    <FieldLabel>Choose File</FieldLabel>

                    <input
                      type="file"
                      accept="image/*"
                      disabled={isFormBusy}
                      onChange={handleImageChange}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/65 px-3 py-3 text-xs font-semibold text-slate-300 file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-400 file:px-3 file:py-2 file:text-xs file:font-black file:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <p className="text-xs font-semibold leading-5 text-slate-500">
                      Input maksimal {MAX_INPUT_IMAGE_SIZE_MB} MB. Output otomatis WEBP
                      maksimal {TARGET_IMAGE_SIZE_LABEL} sebelum masuk bucket{" "}
                      {NEWS_IMAGE_BUCKET}.
                    </p>
                  </label>

                  <CoverImageUrlField
                    value={form.coverImageUrl}
                    disabled={isFormBusy}
                    onChange={(event) => updateField("coverImageUrl", event.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={isFormBusy}
                      onClick={handleClearCoverImage}
                      className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-black text-white transition hover:border-red-400/25 hover:bg-red-400/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDeletingImage ? "Menghapus..." : "Hapus"}
                    </button>

                    <button
                      type="button"
                      disabled={isFormBusy}
                      onClick={() => {
                        setStatusType("error");
                        setStatusMessage(
                          "Media Library belum aktif. Untuk sekarang upload langsung lewat Choose File."
                        );
                      }}
                      className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-black text-white transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Media
                    </button>
                  </div>
                </div>
              </section>

              {statusMessage ? (
                <div
                  className={
                    statusType === "error"
                      ? "rounded-[26px] border border-red-400/20 bg-red-400/[0.08] p-4"
                      : "rounded-[26px] border border-emerald-400/20 bg-emerald-400/[0.08] p-4"
                  }
                >
                  <p
                    className={
                      statusType === "error"
                        ? "text-sm font-bold leading-6 text-red-200"
                        : "text-sm font-bold leading-6 text-emerald-200"
                    }
                  >
                    {statusMessage}
                  </p>
                </div>
              ) : null}

              <div className="grid gap-3">
                <button
                  type="submit"
                  disabled={isFormBusy}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploadingImage
                    ? "Kompres/upload gambar..."
                    : isDeletingImage
                      ? "Menghapus gambar..."
                      : isPending
                        ? isEditMode
                          ? "Memperbarui..."
                          : "Menyimpan..."
                        : isEditMode
                          ? "Update Artikel"
                          : "Simpan Artikel"}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isFormBusy}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-3 text-sm font-black text-white transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isEditMode ? "Reset Perubahan" : "Reset Form"}
                </button>

                <Link
                  href="/admin/news/artikel"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-3 text-sm font-black text-white transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-200"
                >
                  Batal
                </Link>
              </div>
            </aside>
          </form>
        </div>
      </section>

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 text-center transform transition-all">
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${alertModal.isError ? 'bg-red-400/10 text-red-400' : 'bg-emerald-400/10 text-emerald-400'} mb-4`}>
              {alertModal.isError ? '❌' : '✅'}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{alertModal.isError ? 'Terjadi Kesalahan' : 'Berhasil'}</h3>
            <p className="text-sm text-slate-400 mb-6">{alertModal.message}</p>
            <button 
              onClick={() => setAlertModal({ isOpen: false, message: "", isError: false })}
              className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/20 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 text-center transform transition-all">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400 mb-4">
              ❓
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Konfirmasi Aksi</h3>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">{confirmModal.message}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmModal({ isOpen: false, message: "", onConfirm: null })}
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  if (confirmModal.onConfirm) confirmModal.onConfirm();
                  setConfirmModal({ isOpen: false, message: "", onConfirm: null });
                }}
                className="flex-1 rounded-xl bg-cyan-500/20 border border-cyan-500/30 px-4 py-3 text-sm font-bold text-cyan-400 hover:bg-cyan-500/30 transition-colors"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}