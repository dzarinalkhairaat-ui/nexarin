export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";
export type TutorialContentType = "course" | "tutorial" | "guide" | "workshop" | "article" | "video";

export interface TutorialSubcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  classCount?: number;
}

export interface TutorialCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  color: string;
  subcategories: TutorialSubcategory[];
}

export interface TutorialLesson {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  slug: string;
  duration: string;
  order: number;
  contentType: TutorialContentType;
  contentMarkdown: string;
  videoUrl?: string;
  keyTakeaways?: string[];
  exercises?: string[];
  isPreviewAvailable?: boolean;
}

export interface TutorialModule {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lessons: TutorialLesson[];
}

export interface TutorialCourse {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  level: DifficultyLevel;
  duration: string;
  lessonCount: number;
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  thumbnail: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  whatYouWillLearn: string[];
  requirements: string[];
  modules: TutorialModule[];
  contentType: TutorialContentType;
  isFeatured?: boolean;
  isPopular?: boolean;
  isBeginnerFriendly?: boolean;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface UserLearningProgress {
  userId: string;
  courseId: string;
  completedLessonSlugs: string[];
  lastAccessedLessonSlug: string;
  lastAccessedLessonTitle: string;
  lastAccessedAt: string;
  percentage: number;
}
