"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useTutorials } from "@/context/TutorialContext";
import { useNotification } from "@/context/NotificationContext";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/feedback/ConfirmModal";
import {
  GraduationCap,
  BookOpen,
  Plus,
  Search,
  Filter,
  Layers,
  Clock,
  Star,
  Users,
  CheckSquare,
  Square,
  MinusSquare,
  Trash2,
  Edit,
  Eye,
  ExternalLink,
  RefreshCw,
  Sparkles,
  ChevronRight,
  FolderPlus,
  PlayCircle,
  FileText,
  AlertTriangle,
  Award
} from "lucide-react";
import { TutorialCourse, DifficultyLevel, TutorialModule } from "@/types/tutorial";

export default function AdminTutorialsPage() {
  const {
    courses,
    categories,
    createCourse,
    updateCourse,
    deleteCourse,
    deleteMultipleCourses,
    refreshCourses
  } = useTutorials();
  const { showToast } = useNotification();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Selection & Bulk Delete State
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Single Item Delete Target
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  // Modal State: Create / Edit Course
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<TutorialCourse | null>(null);

  // Modal State: Manage Curriculum / Modules
  const [curriculumCourse, setCurriculumCourse] = useState<TutorialCourse | null>(null);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formTagline, setFormTagline] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("ai-engineering");
  const [formLevel, setFormLevel] = useState<DifficultyLevel>("Beginner");
  const [formDuration, setFormDuration] = useState("3 Jam 30 Menit");
  const [formThumbnail, setFormThumbnail] = useState("https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop");
  const [formInstructorName, setFormInstructorName] = useState("Rins");
  const [formInstructorRole, setFormInstructorRole] = useState("Lead AI Engineer & Nexarin Founder");
  const [formTags, setFormTags] = useState("AI, React, Next.js");
  const [formWhatYouWillLearn, setFormWhatYouWillLearn] = useState("Konsep fundamental, Praktek coding langsung, Deployment");

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" ||
        c.categoryId === selectedCategory ||
        c.categoryName.toLowerCase() === selectedCategory.toLowerCase();

      const matchesLevel = selectedLevel === "all" || c.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, searchQuery, selectedCategory, selectedLevel]);

  // Overall Analytics
  const totalCourses = courses.length;
  const totalModules = courses.reduce((sum, c) => sum + (c.modules?.length || 0), 0);
  const totalLessons = courses.reduce(
    (sum, c) =>
      sum + (c.modules ? c.modules.reduce((mSum, m) => mSum + (m.lessons?.length || 0), 0) : c.lessonCount || 0),
    0
  );
  const totalLearners = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);

  // Selection Handlers
  const handleToggleSelectCourse = (id: string) => {
    setSelectedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedCourseIds.length === filteredCourses.length) {
      setSelectedCourseIds([]);
    } else {
      setSelectedCourseIds(filteredCourses.map((c) => c.id));
    }
  };

  // Open Add / Edit Form Modal
  const handleOpenForm = (course?: TutorialCourse) => {
    if (course) {
      setEditingCourse(course);
      setFormTitle(course.title);
      setFormSlug(course.slug);
      setFormTagline(course.tagline);
      setFormDescription(course.description);
      setFormCategory(course.categoryId);
      setFormLevel(course.level);
      setFormDuration(course.duration);
      setFormThumbnail(course.thumbnail);
      setFormInstructorName(course.instructor.name);
      setFormInstructorRole(course.instructor.role);
      setFormTags(course.tags.join(", "));
      setFormWhatYouWillLearn(course.whatYouWillLearn.join(", "));
    } else {
      setEditingCourse(null);
      setFormTitle("");
      setFormSlug("");
      setFormTagline("");
      setFormDescription("");
      setFormCategory(categories[0]?.id || "ai-engineering");
      setFormLevel("Beginner");
      setFormDuration("4 Jam");
      setFormThumbnail("https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop");
      setFormInstructorName("Rins");
      setFormInstructorRole("Lead AI Engineer & Nexarin Founder");
      setFormTags("AI, Software Engineering, Architecture");
      setFormWhatYouWillLearn("Pemahaman mendalam, Implementasi kode real-world, Tips performa");
    }
    setIsFormModalOpen(true);
  };

  // Save Form Handler
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) return;

    const catObj = categories.find((c) => c.id === formCategory) || categories[0];
    const slug = formSlug.trim() || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const coursePayload = {
      title: formTitle,
      slug,
      tagline: formTagline || formTitle,
      description: formDescription,
      categoryId: catObj?.id || "ai-engineering",
      categoryName: catObj?.name || "AI & Machine Learning",
      subcategoryId: catObj?.subcategories[0]?.id || "ai-agents",
      subcategoryName: catObj?.subcategories[0]?.name || "AI Agents & Tool Use",
      level: formLevel,
      duration: formDuration,
      lessonCount: editingCourse?.lessonCount || 6,
      rating: editingCourse?.rating || 5.0,
      reviewCount: editingCourse?.reviewCount || 12,
      enrolledCount: editingCourse?.enrolledCount || 140,
      thumbnail: formThumbnail,
      instructor: {
        name: formInstructorName,
        role: formInstructorRole,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        bio: "Senior software engineer dan kontributor ekosistem Nexarin Tech."
      },
      whatYouWillLearn: formWhatYouWillLearn.split(",").map((s) => s.trim()).filter(Boolean),
      requirements: ["Dasar pemrograman komputer", "Koneksi internet dan web browser modern"],
      modules: editingCourse?.modules || [
        {
          id: `mod-${Date.now().toString().slice(-4)}`,
          courseId: editingCourse?.id || "new",
          title: "Modul 1: Konsep Fundamental & Setup Environment",
          description: "Pengenalan materi dasar dan instalasi tools yang dibutuhkan.",
          order: 1,
          lessons: [
            {
              id: `les-1`,
              courseId: editingCourse?.id || "new",
              moduleId: `mod-1`,
              title: "Pengenalan Materi & Arsitektur Utama",
              slug: "pengenalan-materi-dan-arsitektur-utama",
              duration: "15 Menit",
              order: 1,
              contentType: "tutorial",
              contentMarkdown: "### Pengantar Kelas\n\nSelamat datang di kelas ini. Di sesi ini kita akan membahas dasar-dasar penting...",
              keyTakeaways: ["Memahami arsitektur", "Setup environment lokal"],
              isPreviewAvailable: true
            }
          ]
        }
      ],
      contentType: "course" as const,
      tags: formTags.split(",").map((t) => t.trim()).filter(Boolean)
    };

    if (editingCourse) {
      await updateCourse(editingCourse.id, coursePayload);
    } else {
      await createCourse(coursePayload);
    }

    setIsFormModalOpen(false);
  };

  // Delete Handlers
  const handleConfirmSingleDelete = async () => {
    if (!deleteTarget) return;
    await deleteCourse(deleteTarget.id);
    setSelectedCourseIds((prev) => prev.filter((id) => id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleConfirmBulkDelete = async () => {
    await deleteMultipleCourses(selectedCourseIds);
    setSelectedCourseIds([]);
    setIsBulkDeleteModalOpen(false);
  };

  // Add Module Handler
  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!curriculumCourse || !newModuleTitle.trim()) return;

    const newModule: TutorialModule = {
      id: `mod-${Date.now().toString().slice(-4)}`,
      courseId: curriculumCourse.id,
      title: newModuleTitle,
      order: (curriculumCourse.modules?.length || 0) + 1,
      lessons: [
        {
          id: `les-${Date.now().toString().slice(-4)}`,
          courseId: curriculumCourse.id,
          moduleId: `mod-new`,
          title: "Materi Pengantar Modul",
          slug: "materi-pengantar-modul-" + Date.now().toString().slice(-3),
          duration: "10 Menit",
          order: 1,
          contentType: "tutorial",
          contentMarkdown: "### Materi Baru\n\nSilakan tuliskan rangkuman dan kode materi di sini...",
          keyTakeaways: ["Poin penting pembelajaran"],
          isPreviewAvailable: true
        }
      ]
    };

    const updatedModules = [...(curriculumCourse.modules || []), newModule];
    const totalLessons = updatedModules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);

    const res = await updateCourse(curriculumCourse.id, {
      modules: updatedModules,
      lessonCount: totalLessons
    });

    if (res.data) {
      setCurriculumCourse(res.data);
    }
    setNewModuleTitle("");
    showToast({
      type: "success",
      title: "Modul Ditambahkan",
      message: `Modul '${newModuleTitle}' berhasil ditambahkan ke kurikulum kelas.`
    });
  };
  // Delete Module Handler
  const handleDeleteModule = async (moduleId: string) => {
    if (!curriculumCourse) return;
    const updatedModules = (curriculumCourse.modules || []).filter((m) => m.id !== moduleId);
    const totalLessons = updatedModules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);

    const res = await updateCourse(curriculumCourse.id, {
      modules: updatedModules,
      lessonCount: totalLessons
    });

    if (res.data) {
      setCurriculumCourse(res.data);
    }
    showToast({
      type: "info",
      title: "Modul Dihapus",
      message: "Modul dan pelajaran terkait berhasil dihapus dari kurikulum."
    });
  };

  // Add Lesson to Module Handler
  const handleAddLesson = async (moduleId: string, lessonTitle: string, duration = "15 Menit") => {
    if (!curriculumCourse || !lessonTitle.trim()) return;

    const slug = lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString().slice(-3);
    const updatedModules = (curriculumCourse.modules || []).map((mod) => {
      if (mod.id === moduleId) {
        const newLesson = {
          id: `les-${Date.now().toString().slice(-4)}`,
          courseId: curriculumCourse.id,
          moduleId: mod.id,
          title: lessonTitle,
          slug,
          duration,
          order: (mod.lessons?.length || 0) + 1,
          contentType: "tutorial" as const,
          contentMarkdown: `### ${lessonTitle}\n\nSelamat datang di sesi pelajaran ini. Silakan tuliskan panduan materi dan instruksi latihan di sini...`,
          keyTakeaways: ["Konsep penting", "Praktik implementasi"],
          isPreviewAvailable: true
        };
        return {
          ...mod,
          lessons: [...(mod.lessons || []), newLesson]
        };
      }
      return mod;
    });

    const totalLessons = updatedModules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
    const res = await updateCourse(curriculumCourse.id, {
      modules: updatedModules,
      lessonCount: totalLessons
    });

    if (res.data) {
      setCurriculumCourse(res.data);
    }
    showToast({
      type: "success",
      title: "Materi Ditambahkan",
      message: `Pelajaran '${lessonTitle}' berhasil ditambahkan ke modul.`
    });
  };

  // Delete Lesson from Module Handler
  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!curriculumCourse) return;

    const updatedModules = (curriculumCourse.modules || []).map((mod) => {
      if (mod.id === moduleId) {
        return {
          ...mod,
          lessons: (mod.lessons || []).filter((l) => l.id !== lessonId)
        };
      }
      return mod;
    });

    const totalLessons = updatedModules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
    const res = await updateCourse(curriculumCourse.id, {
      modules: updatedModules,
      lessonCount: totalLessons
    });

    if (res.data) {
      setCurriculumCourse(res.data);
    }
    showToast({
      type: "info",
      title: "Materi Dihapus",
      message: "Pelajaran berhasil dihapus dari kurikulum."
    });
  };


  const isAllSelected =
    filteredCourses.length > 0 && selectedCourseIds.length === filteredCourses.length;

  return (
    <div suppressHydrationWarning className="space-y-8 max-w-7xl">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <AdminPageHeader
          title="Manajemen Kelas &amp; Kurikulum Tutorial"
          description="Kelola direktori kelas coding &amp; AI, modul kurikulum interaktif, video, materi markdown, dan tingkat kesulitan."
          badge={`${totalCourses} Kelas Aktif`}
        />

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={refreshCourses}
            className="text-xs border-white/[0.10] text-[#94A3B8] hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            Sync DB
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => handleOpenForm()}
            className="font-bold text-xs shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Kelas Baru
          </Button>
        </div>
      </div>

      {/* 2. Top Stats Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A]/80 border border-white/[0.08] backdrop-blur-md space-y-1.5">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-mono">
            <span>Total Kelas</span>
            <GraduationCap className="w-4 h-4 text-[#2DD4F5]" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white">{totalCourses}</p>
          <span className="text-[11px] text-[#7CF2C3] font-mono block">Kurikulum Lengkap</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A]/80 border border-white/[0.08] backdrop-blur-md space-y-1.5">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-mono">
            <span>Total Modul &amp; Bab</span>
            <Layers className="w-4 h-4 text-[#7CF2C3]" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white">{totalModules}</p>
          <span className="text-[11px] text-[#94A3B8] font-mono block">{totalLessons} Materi Pelajaran</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A]/80 border border-white/[0.08] backdrop-blur-md space-y-1.5">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-mono">
            <span>Pelajar Terdaftar</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-cyan-400">
            {totalLearners.toLocaleString()}
          </p>
          <span className="text-[11px] text-[#64748B] font-mono block">Siswa &amp; Developer</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A]/80 border border-white/[0.08] backdrop-blur-md space-y-1.5">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-mono">
            <span>Rating Rata-rata</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-400">4.9 / 5.0</p>
          <span className="text-[11px] text-[#94A3B8] font-mono block">Ulasan Komunitas</span>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0F172A]/90 border border-white/[0.08] flex flex-col lg:flex-row items-center justify-between gap-4 backdrop-blur-md">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kelas, teknologi, instruktur..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0B1120] border border-white/[0.08] text-xs text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#2DD4F5]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#64748B] font-mono">Kategori:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 rounded-xl bg-[#0B1120] border border-white/[0.08] text-xs text-[#F8FAFC] px-3 focus:outline-none focus:border-[#2DD4F5]"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#64748B] font-mono">Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="h-9 rounded-xl bg-[#0B1120] border border-white/[0.08] text-xs text-[#F8FAFC] px-3 focus:outline-none focus:border-[#2DD4F5]"
            >
              <option value="all">Semua Level</option>
              <option value="Beginner">Beginner (Pemula)</option>
              <option value="Intermediate">Intermediate (Menengah)</option>
              <option value="Advanced">Advanced (Lanjutan)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Bulk Action Toolbar */}
      {filteredCourses.length > 0 && (
        <div
          suppressHydrationWarning
          className="p-3 sm:p-4 rounded-2xl bg-[#0F172A]/90 border border-white/[0.08] flex items-center justify-between gap-3 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B1120] border border-white/[0.10] hover:border-cyan-400 text-xs font-semibold text-white transition-colors"
            >
              {isAllSelected ? (
                <CheckSquare className="w-4 h-4 text-[#2DD4F5]" />
              ) : selectedCourseIds.length > 0 ? (
                <MinusSquare className="w-4 h-4 text-[#2DD4F5]" />
              ) : (
                <Square className="w-4 h-4 text-[#64748B]" />
              )}
              <span>{isAllSelected ? "Batalkan Semua" : "Centang Semua"}</span>
            </button>

            <span className="text-xs font-mono text-[#94A3B8]">
              {selectedCourseIds.length > 0 ? (
                <strong className="text-[#2DD4F5]">
                  {selectedCourseIds.length} dari {filteredCourses.length} kelas terpilih
                </strong>
              ) : (
                <span>Total {filteredCourses.length} kelas tutorial ditemukan</span>
              )}
            </span>
          </div>

          {selectedCourseIds.length > 0 && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="font-bold text-xs shadow-lg shadow-rose-500/20 animate-in fade-in"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Hapus ({selectedCourseIds.length}) Kelas Terpilih
            </Button>
          )}
        </div>
      )}

      {/* 5. Tutorials Directory Cards */}
      <div className="space-y-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const isSelected = selectedCourseIds.includes(course.id);
            const totalCourseLessons = course.modules
              ? course.modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0)
              : course.lessonCount || 0;

            return (
              <AdminCard
                key={course.id}
                className={`space-y-4 transition-all duration-200 ${
                  isSelected
                    ? "border-cyan-400/60 bg-cyan-500/[0.04] shadow-lg shadow-cyan-500/5"
                    : "border-white/[0.08] hover:border-cyan-500/30"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleToggleSelectCourse(course.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center mt-1 shrink-0 transition-all ${
                        isSelected
                          ? "bg-[#2DD4F5] text-slate-950 shadow-md shadow-[#2DD4F5]/30"
                          : "bg-[#0B1120] border border-white/20 text-transparent hover:border-cyan-400"
                      }`}
                      title={isSelected ? "Batalkan pilihan" : "Pilih kelas ini"}
                    >
                      <CheckSquare className="w-4 h-4" />
                    </button>

                    {/* Thumbnail Image */}
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-24 h-16 sm:w-28 sm:h-20 rounded-2xl object-cover border border-white/[0.12] shrink-0"
                    />

                    {/* Content Details */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={
                            course.level === "Beginner"
                              ? "mint"
                              : course.level === "Intermediate"
                              ? "warning"
                              : "danger"
                          }
                          size="sm"
                          className="font-mono text-[10px]"
                        >
                          {course.level}
                        </Badge>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {course.categoryName}
                        </span>
                        <span className="text-xs font-mono text-[#64748B]">
                          ID: <strong className="text-white">{course.id}</strong>
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-[#94A3B8] line-clamp-1">
                        {course.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions Group */}
                  <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap pl-10 lg:pl-0">
                    {/* View on Public Web */}
                    <Link href={`/tutorials/${course.slug}`} target="_blank">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs font-bold border-white/[0.12] text-slate-300 hover:text-white"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                        Web Publik <ExternalLink className="w-3 h-3 ml-1 text-[#64748B]" />
                      </Button>
                    </Link>

                    {/* Manage Curriculum Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurriculumCourse(course);
                        setIsCurriculumModalOpen(true);
                      }}
                      className="text-xs font-bold border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <Layers className="w-3.5 h-3.5 mr-1.5" />
                      Kurikulum ({course.modules?.length || 0} Modul)
                    </Button>

                    {/* Edit Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenForm(course)}
                      className="text-xs font-bold border-white/[0.12] text-slate-300 hover:text-white p-2"
                      title="Edit Informasi Kelas"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>

                    {/* Delete Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget({ id: course.id, title: course.title })}
                      className="text-xs font-bold border-rose-500/30 text-rose-400 hover:bg-rose-500/10 p-2"
                      title="Hapus Kelas Tutorial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Bottom Metadata Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pl-0 sm:pl-10">
                  <div className="p-3 rounded-xl bg-[#0B1120] border border-white/[0.08]">
                    <span className="text-[#64748B] block text-[11px]">Durasi Kelas:</span>
                    <strong className="text-white flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {course.duration}
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1120] border border-white/[0.08]">
                    <span className="text-[#64748B] block text-[11px]">Jumlah Materi:</span>
                    <strong className="text-[#7CF2C3] flex items-center gap-1 mt-0.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      {totalCourseLessons} Pelajaran
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1120] border border-white/[0.08]">
                    <span className="text-[#64748B] block text-[11px]">Pelajar Terdaftar:</span>
                    <strong className="text-white flex items-center gap-1 mt-0.5">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      {course.enrolledCount?.toLocaleString() || 0} Siswa
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1120] border border-white/[0.08]">
                    <span className="text-[#64748B] block text-[11px]">Instruktur:</span>
                    <span className="text-[#94A3B8] font-bold block truncate mt-0.5">
                      {course.instructor.name}
                    </span>
                  </div>
                </div>
              </AdminCard>
            );
          })
        ) : (
          <div className="p-12 rounded-3xl bg-[#0F172A]/70 border border-white/[0.08] text-center space-y-3">
            <GraduationCap className="w-10 h-10 text-[#64748B] mx-auto" />
            <h3 className="text-base font-bold text-white">Tidak Ada Kelas Ditemukan</h3>
            <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
              Tidak ditemukan kelas tutorial dengan kata kunci pencarian atau filter yang dipilih.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedLevel("all");
              }}
              className="text-xs mt-2 border-white/[0.12]"
            >
              Reset Filter
            </Button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 6. MODAL FORM: TAMBAH / EDIT KELAS TUTORIAL                               */}
      {/* ========================================================================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] bg-[#0F172A] border border-white/[0.15] rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#2DD4F5]" />
                <h3 className="text-base font-bold text-white">
                  {editingCourse ? "Edit Informasi Kelas Tutorial" : "Tambah Kelas Tutorial Baru"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="text-[#64748B] hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#94A3B8]">
                  Judul Kelas *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Masterclass Arsitektur AI Agentic Coding 2026"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#94A3B8]">
                    Custom URL Slug (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="masterclass-arsitektur-ai"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#94A3B8]">
                    Kategori Kelas
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#94A3B8]">
                  Tagline Ringkas
                </label>
                <input
                  type="text"
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  placeholder="Panduan komprehensif implementasi agen AI mandiri dari scratch..."
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#94A3B8]">
                  Deskripsi Lengkap
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Penjelasan silabus dan materi yang dipelajari..."
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#94A3B8]">
                    Tingkat Kesulitan
                  </label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value as DifficultyLevel)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                  >
                    <option value="Beginner">Beginner (Pemula)</option>
                    <option value="Intermediate">Intermediate (Menengah)</option>
                    <option value="Advanced">Advanced (Lanjutan)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#94A3B8]">
                    Estimasi Durasi
                  </label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="Contoh: 4 Jam 15 Menit"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#94A3B8]">
                    Instruktur Utama
                  </label>
                  <input
                    type="text"
                    value={formInstructorName}
                    onChange={(e) => setFormInstructorName(e.target.value)}
                    placeholder="Nama Instruktur"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#94A3B8]">
                  URL Gambar Thumbnail (16:9)
                </label>
                <input
                  type="url"
                  value={formThumbnail}
                  onChange={(e) => setFormThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#94A3B8]">
                  Poin Pembelajaran (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formWhatYouWillLearn}
                  onChange={(e) => setFormWhatYouWillLearn(e.target.value)}
                  placeholder="Arsitektur AI, Memory buffer, Tool-calling, Error recovery"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2DD4F5]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFormModalOpen(false)}
                  className="text-xs border-white/[0.12]"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="text-xs font-bold"
                >
                  {editingCourse ? "Simpan Perubahan Kelas" : "Terbitkan Kelas Baru"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: KELOLA KURIKULUM & MODUL KELAS                                  */}
      {/* ========================================================================= */}
      {isCurriculumModalOpen && curriculumCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] bg-[#0F172A] border border-white/[0.15] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#2DD4F5]" />
                  <h3 className="text-lg font-bold text-white">
                    Kurikulum: {curriculumCourse.title}
                  </h3>
                </div>
                <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                  {curriculumCourse.modules?.length || 0} Modul Aktif • ID: {curriculumCourse.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCurriculumModalOpen(false)}
                className="text-[#64748B] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modules List Container */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {curriculumCourse.modules && curriculumCourse.modules.length > 0 ? (
                curriculumCourse.modules.map((mod, mIdx) => (
                  <div
                    key={mod.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#0B1120] border border-white/[0.08] space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">
                          {mIdx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-white">{mod.title}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-[#64748B]">
                          {mod.lessons?.length || 0} Pelajaran
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteModule(mod.id)}
                          className="p-1 rounded text-[#64748B] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Hapus Modul Ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Lessons list */}
                    <div className="space-y-2 pl-2 sm:pl-4 border-l border-white/[0.08]">
                      {mod.lessons && mod.lessons.length > 0 ? (
                        mod.lessons.map((les, lIdx) => (
                          <div
                            key={les.id}
                            className="p-2.5 rounded-xl bg-slate-950/60 border border-white/[0.04] flex items-center justify-between text-xs group"
                          >
                            <div className="flex items-center gap-2">
                              <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-white font-medium">
                                {lIdx + 1}. {les.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-[#64748B]">
                                {les.duration}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteLesson(mod.id, les.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                                title="Hapus Pelajaran"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-[#64748B] italic">Belum ada materi pelajaran.</p>
                      )}

                      {/* Quick Add Lesson to this Module */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            const title = prompt("Masukkan Judul Pelajaran Baru:");
                            if (title && title.trim()) {
                              handleAddLesson(mod.id, title.trim());
                            }
                          }}
                          className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> + Tambah Pelajaran ke Modul Ini
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-2xl bg-[#0B1120] border border-white/[0.08] text-center space-y-2">
                  <BookOpen className="w-8 h-8 text-[#64748B] mx-auto" />
                  <p className="text-xs text-[#94A3B8]">Belum ada modul kurikulum.</p>
                </div>
              )}
            </div>

            {/* Add New Module Form */}
            <form onSubmit={handleAddModule} className="p-4 rounded-2xl bg-[#0B1120] border border-cyan-500/30 flex items-center gap-3">
              <input
                type="text"
                required
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                placeholder="Judul modul baru (misal: Modul 2: State Management & Tool-calling)..."
                className="flex-1 rounded-xl border border-white/[0.08] bg-[#0F172A] text-white px-3.5 py-2 text-xs focus:outline-none focus:border-cyan-400"
              />
              <Button type="submit" variant="mint" size="sm" className="font-bold text-xs shrink-0 text-slate-950">
                <FolderPlus className="w-3.5 h-3.5 mr-1" />
                + Tambah Modul
              </Button>
            </form>

            <div className="pt-2 border-t border-white/[0.08] flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCurriculumModalOpen(false)}
                className="text-xs"
              >
                Selesai
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Single Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmSingleDelete}
        title="Hapus Kelas Tutorial?"
        description={`Apakah Anda yakin ingin menghapus kelas "${deleteTarget?.title}"? Seluruh modul dan pelajaran terkait akan ikut terhapus.`}
        confirmText="Ya, Hapus Kelas"
        variant="danger"
      />

      {/* 9. Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0F172A] border border-rose-500/30 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-white">
                Hapus {selectedCourseIds.length} Kelas Tutorial?
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Anda akan menghapus secara massal{" "}
                <strong className="text-white">{selectedCourseIds.length} kelas tutorial terpilih</strong>. Tindakan ini permanen.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/[0.08]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="text-xs border-white/[0.12]"
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleConfirmBulkDelete}
                className="text-xs font-bold shadow-lg shadow-rose-500/20"
              >
                Ya, Hapus ({selectedCourseIds.length}) Kelas
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
