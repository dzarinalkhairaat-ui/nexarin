-- ==============================================================================
-- NEXARIN TECH HUB — TUTORIALS & CLASS MANAGEMENT SCHEMA (PostgreSQL / Supabase)
-- ==============================================================================

-- 1. TUTORIAL CATEGORIES
CREATE TABLE IF NOT EXISTS public.tutorial_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TUTORIAL COURSES (Classes)
CREATE TABLE IF NOT EXISTS public.tutorial_courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES public.tutorial_categories(id) ON DELETE CASCADE,
  category_name TEXT NOT NULL,
  subcategory_id TEXT,
  subcategory_name TEXT,
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  duration TEXT NOT NULL,
  lesson_count INT NOT NULL DEFAULT 0,
  rating NUMERIC(2, 1) NOT NULL DEFAULT 4.9,
  review_count INT NOT NULL DEFAULT 0,
  enrolled_count INT NOT NULL DEFAULT 0,
  thumbnail TEXT NOT NULL,
  instructor_name TEXT NOT NULL,
  instructor_role TEXT NOT NULL,
  instructor_avatar TEXT NOT NULL,
  instructor_bio TEXT,
  what_you_will_learn TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  content_type TEXT NOT NULL DEFAULT 'course',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_popular BOOLEAN NOT NULL DEFAULT FALSE,
  is_beginner_friendly BOOLEAN NOT NULL DEFAULT TRUE,
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TUTORIAL MODULES
CREATE TABLE IF NOT EXISTS public.tutorial_modules (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES public.tutorial_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  "order" INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TUTORIAL LESSONS
CREATE TABLE IF NOT EXISTS public.tutorial_lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES public.tutorial_courses(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL REFERENCES public.tutorial_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  duration TEXT NOT NULL,
  "order" INT NOT NULL DEFAULT 1,
  content_type TEXT NOT NULL DEFAULT 'tutorial',
  content_markdown TEXT NOT NULL,
  video_url TEXT,
  key_takeaways TEXT[] DEFAULT '{}',
  exercises TEXT[] DEFAULT '{}',
  is_preview_available BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. USER LEARNING PROGRESS
CREATE TABLE IF NOT EXISTS public.user_learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL REFERENCES public.tutorial_courses(id) ON DELETE CASCADE,
  completed_lesson_slugs TEXT[] DEFAULT '{}',
  last_accessed_lesson_slug TEXT,
  last_accessed_lesson_title TEXT,
  percentage INT NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

-- Indexes for maximum performance
CREATE INDEX IF NOT EXISTS idx_tutorial_courses_slug ON public.tutorial_courses(slug);
CREATE INDEX IF NOT EXISTS idx_tutorial_courses_category ON public.tutorial_courses(category_id);
CREATE INDEX IF NOT EXISTS idx_tutorial_lessons_course ON public.tutorial_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON public.user_learning_progress(user_id);
