"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { TutorialCourse, UserLearningProgress, TutorialCategory } from "@/types/tutorial";
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
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const { customer, isCustomerAuthenticated } = useAuth();
  const { showToast } = useNotification();
  const [courses] = useState<TutorialCourse[]>(TUTORIAL_COURSES);
  const [categories] = useState<TutorialCategory[]>(TUTORIAL_CATEGORIES);
  const [progressMap, setProgressMap] = useState<Record<string, UserLearningProgress>>({});
  const [guestPromptOpen, setGuestPromptOpen] = useState(false);
  const [guestPromptReason, setGuestPromptReason] = useState("");

  const storageKey = customer?.id ? `nexari_tutorial_progress_${customer.id}` : "nexari_guest_progress_temp";

  // Load progress on auth or mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setProgressMap(JSON.parse(stored));
      } else {
        // If logged-in customer, give default enrolled sample for demo
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
    return prog?.completedLessonSlugs?.includes(lessonSlug) || false;
  };

  const openGuestPrompt = (reason = "Masuk dengan Akun Pelanggan untuk Menyimpan Progres Belajar") => {
    setGuestPromptReason(reason);
    setGuestPromptOpen(true);
  };

  const closeGuestPrompt = () => {
    setGuestPromptOpen(false);
  };

  const toggleLessonCompletion = (courseId: string, lessonSlug: string, lessonTitle = "Pelajaran"): boolean => {
    if (!isCustomerAuthenticated) {
      openGuestPrompt("Silakan masuk ke akun Anda agar progres penyelesaian materi tersimpan secara permanen.");
      return false;
    }

    const course = courses.find((c) => c.id === courseId);
    if (!course) return false;

    const currentProg = progressMap[courseId] || {
      userId: customer?.id || "usr-anon",
      courseId,
      completedLessonSlugs: [],
      lastAccessedLessonSlug: lessonSlug,
      lastAccessedLessonTitle: lessonTitle,
      lastAccessedAt: new Date().toISOString(),
      percentage: 0
    };

    const alreadyDone = currentProg.completedLessonSlugs.includes(lessonSlug);
    let newCompleted: string[];

    if (alreadyDone) {
      newCompleted = currentProg.completedLessonSlugs.filter((s) => s !== lessonSlug);
      showToast({
        type: "info",
        title: "Status Diperbarui",
        message: `Materi "${lessonTitle}" ditandai belum selesai.`
      });
    } else {
      newCompleted = [...currentProg.completedLessonSlugs, lessonSlug];
      showToast({
        type: "success",
        title: "Pelajaran Selesai! 🎉",
        message: `Bagus! Materi "${lessonTitle}" telah berhasil diselesaikan.`
      });
    }

    // Total lessons across modules
    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 1;
    const percentage = Math.min(100, Math.round((newCompleted.length / totalLessons) * 100));

    const updatedProg: UserLearningProgress = {
      ...currentProg,
      completedLessonSlugs: newCompleted,
      lastAccessedLessonSlug: lessonSlug,
      lastAccessedLessonTitle: lessonTitle,
      lastAccessedAt: new Date().toISOString(),
      percentage
    };

    const updatedMap = { ...progressMap, [courseId]: updatedProg };
    saveProgress(updatedMap);
    return !alreadyDone;
  };

  const markLessonComplete = (courseId: string, lessonSlug: string, lessonTitle = "Pelajaran"): boolean => {
    if (isLessonCompleted(courseId, lessonSlug)) return true;
    return toggleLessonCompletion(courseId, lessonSlug, lessonTitle);
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
        closeGuestPrompt
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
