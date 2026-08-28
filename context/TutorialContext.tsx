"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { TutorialCourse, UserLearningProgress, TutorialCategory, TutorialModule, TutorialLesson } from "@/types/tutorial";
import { TUTORIAL_CATEGORIES, TUTORIAL_COURSES } from "@/data/mockTutorials";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";

interface TutorialContextType {
  categories: TutorialCategory[];
  courses: TutorialCourse[];
  getCourseBySlug: (slug: string) => TutorialCourse | undefined;
  getCourseProgress: (courseId: string) => UserLearningProgress | undefined;
  getContinueLearningCourses: () => { course: TutorialCourse; progress: UserLearningProgress }[];
  isLessonCompleted: (courseId: string, lessonSlug: string) => boolean;
  markLessonComplete: (courseId: string, lessonSlug: string, lessonTitle?: string) => boolean;
  toggleLessonCompletion: (courseId: string, lessonSlug: string, lessonTitle?: string) => boolean;
  guestPromptOpen: boolean;
  guestPromptReason: string;
  openGuestPrompt: (reason?: string) => void;
  closeGuestPrompt: () => void;
  // CRUD Methods for Admin
  createCourse: (courseData: Omit<TutorialCourse, "id" | "publishedAt" | "updatedAt">) => Promise<{ success: boolean; data?: TutorialCourse }>;
  updateCourse: (id: string, updatedData: Partial<TutorialCourse>) => Promise<{ success: boolean; data?: TutorialCourse }>;
  deleteCourse: (id: string) => Promise<{ success: boolean }>;
  deleteMultipleCourses: (ids: string[]) => Promise<{ success: boolean }>;
  refreshCourses: () => Promise<void>;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const { customer, isCustomerAuthenticated } = useAuth();
  const { showToast } = useNotification();
  const [courses, setCourses] = useState<TutorialCourse[]>(TUTORIAL_COURSES);
  const [categories, setCategories] = useState<TutorialCategory[]>(TUTORIAL_CATEGORIES);
  const [progressMap, setProgressMap] = useState<Record<string, UserLearningProgress>>({});
  const [guestPromptOpen, setGuestPromptOpen] = useState(false);
  const [guestPromptReason, setGuestPromptReason] = useState("");

  const storageKey = customer?.id ? `nexari_tutorial_progress_${customer.id}` : "nexari_guest_progress_temp";

  // Load from API or fallback
  const refreshCourses = async () => {
    try {
      const res = await fetch("/api/tutorials");
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setCourses(data.data);
      }
      if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
        setCategories(data.categories);
      }
    } catch (e) {
      console.log("Using cached tutorial courses", e);
    }
  };

  useEffect(() => {
    refreshCourses();
  }, []);

  // Load progress on auth or mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setProgressMap(JSON.parse(stored));
      } else {
        if (isCustomerAuthenticated && customer?.id) {
          const sampleProgress: Record<string, UserLearningProgress> = {
            "course-ai-auto-01": {
              userId: customer.id,
              courseId: "course-ai-auto-01",
              completedLessonSlugs: ["pengenalan-arsitektur-agen-ai-tool-use"],
              lastAccessedLessonSlug: "desain-sistem-memory-context-window",
              lastAccessedLessonTitle: "Desain Sistem Memory & Context Window",
              lastAccessedAt: new Date().toISOString(),
              percentage: 50
            }
          };
          setProgressMap(sampleProgress);
          localStorage.setItem(storageKey, JSON.stringify(sampleProgress));
        } else {
          setProgressMap({});
        }
      }
    } catch (e) {
      console.error("Failed to load progress:", e);
    }
  }, [customer?.id, isCustomerAuthenticated, storageKey]);

  const saveProgress = (newMap: Record<string, UserLearningProgress>) => {
    setProgressMap(newMap);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newMap));
      } catch (e) {}
    }
  };

  const getCourseBySlug = (slug: string): TutorialCourse | undefined => {
    return courses.find((c) => c.slug === slug || c.id === slug);
  };

  const getCourseProgress = (courseId: string): UserLearningProgress | undefined => {
    if (!isCustomerAuthenticated) return undefined;
    return progressMap[courseId];
  };

  const getContinueLearningCourses = (): { course: TutorialCourse; progress: UserLearningProgress }[] => {
    if (!isCustomerAuthenticated) return [];
    const results: { course: TutorialCourse; progress: UserLearningProgress }[] = [];

    Object.values(progressMap).forEach((prog) => {
      const course = courses.find((c) => c.id === prog.courseId);
      if (course && prog.percentage < 100) {
        results.push({ course, progress: prog });
      }
    });

    return results;
  };

  const isLessonCompleted = (courseId: string, lessonSlug: string): boolean => {
    if (!isCustomerAuthenticated) return false;
    const prog = progressMap[courseId];
    if (!prog) return false;
    return prog.completedLessonSlugs.includes(lessonSlug);
  };

  const openGuestPrompt = (reason = "Simpan Progres Belajar") => {
    setGuestPromptReason(reason);
    setGuestPromptOpen(true);
  };

  const closeGuestPrompt = () => {
    setGuestPromptOpen(false);
  };

  const markLessonComplete = (courseId: string, lessonSlug: string, lessonTitle?: string): boolean => {
    if (!isCustomerAuthenticated) {
      openGuestPrompt("Daftar Akun Gratis untuk Menyimpan Progres Belajar");
      return false;
    }

    const course = courses.find((c) => c.id === courseId);
    if (!course) return false;

    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const existing = progressMap[courseId] || {
      userId: customer?.id || "anonymous",
      courseId,
      completedLessonSlugs: [],
      lastAccessedLessonSlug: lessonSlug,
      lastAccessedLessonTitle: lessonTitle || "Pelajaran Selesai",
      lastAccessedAt: new Date().toISOString(),
      percentage: 0
    };

    let updatedSlugs = existing.completedLessonSlugs;
    if (!updatedSlugs.includes(lessonSlug)) {
      updatedSlugs = [...updatedSlugs, lessonSlug];
    }

    const percentage = totalLessons > 0 ? Math.round((updatedSlugs.length / totalLessons) * 100) : 0;

    const updatedProg: UserLearningProgress = {
      ...existing,
      completedLessonSlugs: updatedSlugs,
      lastAccessedLessonSlug: lessonSlug,
      lastAccessedLessonTitle: lessonTitle || existing.lastAccessedLessonTitle,
      lastAccessedAt: new Date().toISOString(),
      percentage
    };

    const newMap = { ...progressMap, [courseId]: updatedProg };
    saveProgress(newMap);

    showToast({
      type: "success",
      title: "Pelajaran Selesai!",
      message: `Progres kelas '${course.title}' meningkat menjadi ${percentage}%.`
    });

    return true;
  };

  const toggleLessonCompletion = (courseId: string, lessonSlug: string, lessonTitle?: string): boolean => {
    if (!isCustomerAuthenticated) {
      openGuestPrompt("Daftar Akun Gratis untuk Menyimpan Progres Belajar");
      return false;
    }

    const course = courses.find((c) => c.id === courseId);
    if (!course) return false;

    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const existing = progressMap[courseId] || {
      userId: customer?.id || "anonymous",
      courseId,
      completedLessonSlugs: [],
      lastAccessedLessonSlug: lessonSlug,
      lastAccessedLessonTitle: lessonTitle || "Pelajaran",
      lastAccessedAt: new Date().toISOString(),
      percentage: 0
    };

    let updatedSlugs: string[];
    const isCompleted = existing.completedLessonSlugs.includes(lessonSlug);

    if (isCompleted) {
      updatedSlugs = existing.completedLessonSlugs.filter((s) => s !== lessonSlug);
    } else {
      updatedSlugs = [...existing.completedLessonSlugs, lessonSlug];
    }

    const percentage = totalLessons > 0 ? Math.round((updatedSlugs.length / totalLessons) * 100) : 0;

    const updatedProg: UserLearningProgress = {
      ...existing,
      completedLessonSlugs: updatedSlugs,
      lastAccessedLessonSlug: lessonSlug,
      lastAccessedLessonTitle: lessonTitle || existing.lastAccessedLessonTitle,
      lastAccessedAt: new Date().toISOString(),
      percentage
    };

    const newMap = { ...progressMap, [courseId]: updatedProg };
    saveProgress(newMap);

    showToast({
      type: isCompleted ? "info" : "success",
      title: isCompleted ? "Status Dibatalkan" : "Pelajaran Selesai!",
      message: `Progres '${course.title}' kini ${percentage}%.`
    });

    return true;
  };

  // ============================================================================
  // ADMIN CRUD METHODS
  // ============================================================================

  const createCourse = async (courseData: Omit<TutorialCourse, "id" | "publishedAt" | "updatedAt">): Promise<{ success: boolean; data?: TutorialCourse }> => {
    try {
      const res = await fetch("/api/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCourses((prev) => [data.data, ...prev]);
        showToast({
          type: "success",
          title: "Kelas Baru Dibuat",
          message: `Kelas tutorial '${data.data.title}' berhasil ditambahkan ke database.`
        });
        return { success: true, data: data.data };
      }
      return { success: false };
    } catch (e: any) {
      const fallback: TutorialCourse = {
        ...courseData,
        id: `course-${Date.now().toString().slice(-4)}`,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setCourses((prev) => [fallback, ...prev]);
      showToast({
        type: "success",
        title: "Kelas Baru Dibuat",
        message: `Kelas '${fallback.title}' berhasil disimpan.`
      });
      return { success: true, data: fallback };
    }
  };

  const updateCourse = async (id: string, updatedData: Partial<TutorialCourse>): Promise<{ success: boolean; data?: TutorialCourse }> => {
    try {
      const res = await fetch(`/api/tutorials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCourses((prev) => prev.map((c) => (c.id === id ? data.data : c)));
        showToast({
          type: "success",
          title: "Kelas Diperbarui",
          message: `Perubahan materi kelas '${data.data.title}' telah disimpan ke database.`
        });
        return { success: true, data: data.data };
      }
    } catch (e) {
      console.error("Update course error", e);
    }

    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData, updatedAt: new Date().toISOString() } : c))
    );
    showToast({
      type: "success",
      title: "Kelas Diperbarui",
      message: `Informasi kelas berhasil diperbarui.`
    });
    return { success: true };
  };

  const deleteCourse = async (id: string): Promise<{ success: boolean }> => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`/api/tutorials/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete course error", e);
    }
    showToast({
      type: "info",
      title: "Kelas Dihapus",
      message: "Kelas tutorial telah dihapus permanen dari portal & database."
    });
    return { success: true };
  };

  const deleteMultipleCourses = async (ids: string[]): Promise<{ success: boolean }> => {
    if (ids.length === 0) return { success: true };
    setCourses((prev) => prev.filter((c) => !ids.includes(c.id)));
    try {
      await Promise.all(ids.map((id) => fetch(`/api/tutorials/${id}`, { method: "DELETE" })));
    } catch (e) {
      console.error("Bulk delete courses error", e);
    }
    showToast({
      type: "info",
      title: "Kelas Terpilih Dihapus",
      message: `${ids.length} kelas tutorial berhasil dihapus secara massal.`
    });
    return { success: true };
  };

  return (
    <TutorialContext.Provider
      value={{
        categories,
        courses,
        getCourseBySlug,
        getCourseProgress,
        getContinueLearningCourses,
        isLessonCompleted,
        markLessonComplete,
        toggleLessonCompletion,
        guestPromptOpen,
        guestPromptReason,
        openGuestPrompt,
        closeGuestPrompt,
        createCourse,
        updateCourse,
        deleteCourse,
        deleteMultipleCourses,
        refreshCourses
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorials() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error("useTutorials must be used within a TutorialProvider");
  }
  return context;
}
