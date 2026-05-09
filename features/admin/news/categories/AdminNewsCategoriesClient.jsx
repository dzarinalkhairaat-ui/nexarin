"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminTopbar from "@/features/admin/components/AdminTopbar";
import AdminNewsNav from "@/features/admin/news/components/AdminNewsNav";
import {
  createNewsCategoryAction,
  deleteNewsCategoryAction,
  updateNewsCategoryAction,
} from "@/features/admin/news/categories/adminNewsCategory.actions";

const initialForm = {
  name: "",
  slug: "",
  description: "",
};

function createSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function FieldLabel({ children }) {
  return (
    <span className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">
      {children}
    </span>
  );
}

function AdminCategoriesEmptyState({ errorMessage }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-5 text-center">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
        Belum Ada Kategori
      </p>

      <h3 className="mt-3 text-xl font-black tracking-[-0.04em] text-white">
        Database kategori masih kosong.
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-7 text-slate-400">
        Setelah kategori dibuat atau seed dijalankan, daftar kategori akan
        tampil otomatis di sini.
      </p>

      {errorMessage ? (
        <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-xs font-bold leading-6 text-red-200">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

export default function AdminNewsCategoriesClient({
  categories = [],
  errorMessage = "",
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingCategoryId, setEditingCategoryId] = useState("");
  const [deletingCategoryId, setDeletingCategoryId] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");

  const safeCategories = Array.isArray(categories)
    ? categories.filter((category) => category?.slug !== "semua")
    : [];

  const isEditing = Boolean(editingCategoryId);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "name" ? { slug: createSlug(value) } : {}),
    }));

    if (statusMessage) {
      setStatusMessage("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      setStatusType("error");
      setStatusMessage("Nama kategori dan deskripsi wajib diisi dulu.");
      return;
    }

    startTransition(async () => {
      const actionPayload = {
        id: editingCategoryId,
        name: form.name,
        description: form.description,
      };

      const result = isEditing
        ? await updateNewsCategoryAction(actionPayload)
        : await createNewsCategoryAction(actionPayload);

      if (!result?.ok) {
        setStatusType("error");
        setStatusMessage(
          result?.message || "Kategori gagal disimpan ke database."
        );
        return;
      }

      setForm(initialForm);
      setEditingCategoryId("");
      setStatusType("success");
      setStatusMessage(
        result?.message || "Kategori berhasil disimpan ke database."
      );

      router.refresh();
    });
  }

  function handleEditCategory(category) {
    setEditingCategoryId(category?.id || "");
    setForm({
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
    });
    setDeleteConfirmation(null);
    setStatusType("success");
    setStatusMessage(
      `Mode edit aktif untuk kategori “${category?.name || "Kategori"}”.`
    );
  }

  function handleDeleteCategory(category) {
    const categoryId = category?.id || "";

    if (!categoryId) {
      setStatusType("error");
      setStatusMessage("ID kategori tidak valid.");
      return;
    }

    setDeletingCategoryId(categoryId);
    setStatusMessage("");
    setDeleteConfirmation(null);

    startTransition(async () => {
      const result = await deleteNewsCategoryAction({
        categoryId,
        forceDeleteArticles: false,
      });

      if (result?.needsConfirmation) {
        setStatusType("error");
        setStatusMessage("");
        setDeleteConfirmation({
          categoryId: result?.categoryId || categoryId,
          categoryName:
            result?.categoryName || category?.name || "Kategori ini",
          articleCount: Number(result?.articleCount || 0),
          message:
            result?.message ||
            "Kategori ini masih punya artikel. Konfirmasi untuk menghapus permanen.",
        });
        setDeletingCategoryId("");
        return;
      }

      if (!result?.ok) {
        setStatusType("error");
        setStatusMessage(
          result?.message || "Kategori gagal dihapus dari database."
        );
        setDeletingCategoryId("");
        return;
      }

      if (editingCategoryId === categoryId) {
        setEditingCategoryId("");
        setForm(initialForm);
      }

      setStatusType("success");
      setStatusMessage(
        result?.message || "Kategori berhasil dihapus dari database."
      );
      setDeletingCategoryId("");

      router.refresh();
    });
  }

  function handleConfirmDeleteWithArticles() {
    const categoryId = deleteConfirmation?.categoryId || "";

    if (!categoryId) {
      setDeleteConfirmation(null);
      setStatusType("error");
      setStatusMessage("ID kategori tidak valid.");
      return;
    }

    setDeletingCategoryId(categoryId);
    setStatusMessage("");

    startTransition(async () => {
      const result = await deleteNewsCategoryAction({
        categoryId,
        forceDeleteArticles: true,
      });

      if (!result?.ok) {
        setStatusType("error");
        setStatusMessage(
          result?.message ||
            "Kategori dan artikel di dalamnya gagal dihapus dari database."
        );
        setDeletingCategoryId("");
        return;
      }

      if (editingCategoryId === categoryId) {
        setEditingCategoryId("");
        setForm(initialForm);
      }

      setDeleteConfirmation(null);
      setStatusType("success");
      setStatusMessage(
        result?.message ||
          "Kategori dan artikel di dalamnya berhasil dihapus permanen."
      );
      setDeletingCategoryId("");

      router.refresh();
    });
  }

  function handleCancelDeleteConfirmation() {
    if (isPending) {
      return;
    }

    setDeleteConfirmation(null);
    setDeletingCategoryId("");
    setStatusMessage("");
    setStatusType("success");
  }

  function handleReset() {
    setForm(initialForm);
    setEditingCategoryId("");
    setStatusMessage("");
    setStatusType("success");
    setDeleteConfirmation(null);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <AdminTopbar />
      <AdminNewsNav />

      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />

        <img
          src="/images/logo/nexarin-logo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-20 h-72 w-72 rotate-12 object-contain opacity-[0.035] sm:h-96 sm:w-96"
          loading="lazy"
          decoding="async"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-8 lg:px-8">
          <div className="text-center lg:text-left">
            <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 shadow-lg shadow-emerald-400/5">
              Kategori News
            </p>

            <h1 className="mx-auto mt-4 max-w-3xl text-[2.1rem] font-black leading-[0.96] tracking-[-0.065em] text-white sm:text-6xl lg:mx-0">
              Kelola kategori News.
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base sm:leading-8 lg:mx-0">
              Tambah kategori, slug URL, dan deskripsi singkat untuk halaman
              News.
            </p>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(340px,1fr)] lg:items-start">
            <form
              onSubmit={handleSubmit}
              className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="relative z-10 grid gap-4">
                <div>
                  <p className="text-lg font-black tracking-[-0.04em] text-white">
                    {isEditing ? "Edit Kategori" : "Tambah Kategori"}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {isEditing
                      ? "Ubah nama dan deskripsi kategori. Slug URL ikut diperbarui dari nama kategori."
                      : "Slug URL akan otomatis dibuat dari nama kategori."}
                  </p>
                </div>

                <label className="grid gap-2">
                  <FieldLabel>Nama Kategori</FieldLabel>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Contoh: Teknologi"
                    disabled={isPending}
                    className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/65 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>

                <label className="grid gap-2">
                  <FieldLabel>Slug URL</FieldLabel>

                  <input
                    type="text"
                    value={form.slug}
                    readOnly
                    placeholder="terisi-otomatis"
                    className="min-h-12 cursor-not-allowed rounded-2xl border border-white/10 bg-slate-950/65 px-4 text-sm font-semibold text-slate-400 outline-none"
                  />
                </label>

                <label className="grid gap-2">
                  <FieldLabel>Deskripsi Singkat</FieldLabel>

                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    placeholder="Tulis deskripsi singkat kategori..."
                    rows={5}
                    disabled={isPending}
                    className="rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3 text-sm font-semibold leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>

                {statusMessage ? (
                  <div
                    className={
                      statusType === "error"
                        ? "rounded-[24px] border border-red-400/20 bg-red-400/[0.08] p-4"
                        : "rounded-[24px] border border-emerald-400/20 bg-emerald-400/[0.08] p-4"
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

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPending
                      ? isEditing
                        ? "Memperbarui..."
                        : "Menyimpan..."
                      : isEditing
                        ? "Update Kategori"
                        : "Simpan"}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isPending}
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-3 text-sm font-black text-white transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isEditing ? "Batal Edit" : "Batal"}
                  </button>
                </div>
              </div>
            </form>

            <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-lg font-black tracking-[-0.04em] text-white">
                      Daftar Kategori
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Kategori dari database News.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">
                    {safeCategories.length} Item
                  </span>
                </div>

                {safeCategories.length === 0 ? (
                  <AdminCategoriesEmptyState errorMessage={errorMessage} />
                ) : (
                  <div className="grid gap-3">
                    {safeCategories.map((category) => {
                      const isDeleting = deletingCategoryId === category?.id;
                      const isCurrentEditing =
                        editingCategoryId === category?.id;

                      return (
                        <article
                          key={category?.id || category?.slug}
                          className={[
                            "rounded-[24px] border bg-slate-950/45 p-4 transition",
                            isCurrentEditing
                              ? "border-emerald-400/35"
                              : "border-white/10",
                          ].join(" ")}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-base font-black text-white">
                                {category?.name || "Kategori"}
                              </p>

                              <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                                /news/kategori/{category?.slug || "slug"}
                              </p>

                              {category?.description ? (
                                <p className="mt-3 line-clamp-2 text-xs font-semibold leading-6 text-slate-400">
                                  {category.description}
                                </p>
                              ) : null}
                            </div>

                            <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                              {isCurrentEditing
                                ? "Editing"
                                : category?.isActive
                                  ? "Aktif"
                                  : "Nonaktif"}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              disabled={isPending}
                              onClick={() => handleEditCategory(category)}
                              className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-black text-slate-300 transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isCurrentEditing ? "Sedang Edit" : "Edit"}
                            </button>

                            <button
                              type="button"
                              disabled={isPending}
                              onClick={() => handleDeleteCategory(category)}
                              className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-3 py-2 text-xs font-black text-red-200 transition hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isDeleting ? "Mengecek..." : "Hapus"}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}

                <Link
                  href="/admin/news"
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-3 text-sm font-black text-white transition hover:border-emerald-400/25 hover:bg-emerald-400/10 hover:text-emerald-200"
                >
                  Kembali ke Dashboard News
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>

      {deleteConfirmation ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 px-5 pb-28 pt-6 backdrop-blur-md sm:px-6 sm:py-8">
          <div className="w-full max-w-lg -translate-y-6 overflow-hidden rounded-[30px] border border-red-400/25 bg-slate-950 p-5 shadow-2xl shadow-black/50 sm:translate-y-0">
            <div className="rounded-[24px] border border-red-400/15 bg-red-400/[0.08] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-200">
                Konfirmasi Hapus Permanen
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.045em] text-white">
                Hapus kategori dan semua artikelnya?
              </h2>

              <p className="mt-3 text-sm font-semibold leading-7 text-red-100/90">
                Kategori{" "}
                <span className="font-black text-white">
                  “{deleteConfirmation.categoryName}”
                </span>{" "}
                masih memiliki{" "}
                <span className="font-black text-white">
                  {deleteConfirmation.articleCount} artikel
                </span>
                .
              </p>

              <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
                Jika dilanjutkan, kategori ini dan semua artikel di dalamnya
                akan dihapus permanen dari database. Tindakan ini tidak bisa
                dibatalkan.
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleCancelDeleteConfirmation}
                disabled={isPending}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-3 text-sm font-black text-white transition hover:bg-white/[0.085] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteWithArticles}
                disabled={isPending}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-red-400/25 bg-red-400 px-5 py-3 text-sm font-black text-white shadow-xl shadow-red-400/10 transition hover:bg-red-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Menghapus..." : "Hapus Permanen"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}