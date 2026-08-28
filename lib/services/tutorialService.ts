import { getSupabaseAdminClient } from "@/lib/db/supabase";
import { db } from "@/lib/db/store";
import { TutorialCourse, TutorialCategory, TutorialModule, TutorialLesson } from "@/types/tutorial";
import { TUTORIAL_CATEGORIES, TUTORIAL_COURSES } from "@/data/mockTutorials";

export const tutorialService = {
  // 1. GET ALL COURSES & CATEGORIES (With Auto-Seed to Supabase)
  async getAll(): Promise<{ courses: TutorialCourse[]; categories: TutorialCategory[] }> {
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return { courses: db.tutorialCourses, categories: db.tutorialCategories };
    }

    try {
      // 1. Check Categories
      const { data: dbCategories, error: catError } = await supabase
        .from("tutorial_categories")
        .select("*");

      let categories: TutorialCategory[] = [];
      if (!catError && dbCategories && dbCategories.length > 0) {
        categories = dbCategories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          iconName: c.icon_name,
          color: c.color,
          subcategories: []
        }));
      } else {
        // Auto-seed categories
        const catRows = TUTORIAL_CATEGORIES.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          icon_name: c.iconName,
          color: c.color
        }));
        await supabase.from("tutorial_categories").upsert(catRows);
        categories = TUTORIAL_CATEGORIES;
      }

      // 2. Check Courses
      const { data: dbCourses, error: courseError } = await supabase
        .from("tutorial_courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (!courseError && dbCourses && dbCourses.length > 0) {
        // Fetch modules and lessons
        const courseIds = dbCourses.map((c) => c.id);
        const { data: dbModules } = await supabase
          .from("tutorial_modules")
          .select("*")
          .in("course_id", courseIds)
          .order("order", { ascending: true });

        const { data: dbLessons } = await supabase
          .from("tutorial_lessons")
          .select("*")
          .in("course_id", courseIds)
          .order("order", { ascending: true });

        const mappedCourses: TutorialCourse[] = dbCourses.map((c) => {
          const courseMods = (dbModules || [])
            .filter((m) => m.course_id === c.id)
            .map((m) => ({
              id: m.id,
              courseId: m.course_id,
              title: m.title,
              description: m.description,
              order: m.order,
              lessons: (dbLessons || [])
                .filter((l) => l.module_id === m.id)
                .map((l) => ({
                  id: l.id,
                  courseId: l.course_id,
                  moduleId: l.module_id,
                  title: l.title,
                  slug: l.slug,
                  duration: l.duration,
                  order: l.order,
                  contentType: l.content_type,
                  contentMarkdown: l.content_markdown,
                  videoUrl: l.video_url,
                  keyTakeaways: l.key_takeaways || [],
                  exercises: l.exercises || [],
                  isPreviewAvailable: l.is_preview_available
                }))
            }));

          return {
            id: c.id,
            title: c.title,
            slug: c.slug,
            tagline: c.tagline,
            description: c.description,
            categoryId: c.category_id,
            categoryName: c.category_name,
            subcategoryId: c.subcategory_id || "",
            subcategoryName: c.subcategory_name || "",
            level: c.level,
            duration: c.duration,
            lessonCount: c.lesson_count || 0,
            rating: Number(c.rating) || 5.0,
            reviewCount: c.review_count || 0,
            enrolledCount: c.enrolled_count || 0,
            thumbnail: c.thumbnail,
            instructor: {
              name: c.instructor_name,
              role: c.instructor_role,
              avatar: c.instructor_avatar,
              bio: c.instructor_bio || ""
            },
            whatYouWillLearn: c.what_you_will_learn || [],
            requirements: c.requirements || [],
            modules: courseMods,
            contentType: c.content_type || "course",
            isFeatured: c.is_featured,
            isPopular: c.is_popular,
            isBeginnerFriendly: c.is_beginner_friendly,
            tags: c.tags || [],
            publishedAt: c.published_at || c.created_at,
            updatedAt: c.updated_at || c.created_at
          };
        });

        db.tutorialCourses = mappedCourses;
        return { courses: mappedCourses, categories };
      } else {
        // Auto-seed initial 8 courses to Supabase!
        for (const c of TUTORIAL_COURSES) {
          const courseRow = {
            id: c.id,
            title: c.title,
            slug: c.slug,
            tagline: c.tagline,
            description: c.description,
            category_id: c.categoryId,
            category_name: c.categoryName,
            subcategory_id: c.subcategoryId,
            subcategory_name: c.subcategoryName,
            level: c.level,
            duration: c.duration,
            lesson_count: c.lessonCount,
            rating: c.rating,
            review_count: c.reviewCount,
            enrolled_count: c.enrolledCount,
            thumbnail: c.thumbnail,
            instructor_name: c.instructor.name,
            instructor_role: c.instructor.role,
            instructor_avatar: c.instructor.avatar,
            instructor_bio: c.instructor.bio,
            what_you_will_learn: c.whatYouWillLearn,
            requirements: c.requirements,
            content_type: c.contentType,
            is_featured: Boolean(c.isFeatured),
            is_popular: Boolean(c.isPopular),
            is_beginner_friendly: Boolean(c.isBeginnerFriendly),
            tags: c.tags
          };
          await supabase.from("tutorial_courses").upsert(courseRow);

          for (const m of c.modules) {
            const modRow = {
              id: m.id,
              course_id: c.id,
              title: m.title,
              description: m.description || "",
              order: m.order
            };
            await supabase.from("tutorial_modules").upsert(modRow);

            for (const l of m.lessons) {
              const lesRow = {
                id: l.id,
                course_id: c.id,
                module_id: m.id,
                title: l.title,
                slug: l.slug,
                duration: l.duration,
                order: l.order,
                content_type: l.contentType,
                content_markdown: l.contentMarkdown,
                video_url: l.videoUrl || null,
                key_takeaways: l.keyTakeaways || [],
                exercises: l.exercises || [],
                is_preview_available: Boolean(l.isPreviewAvailable)
              };
              await supabase.from("tutorial_lessons").upsert(lesRow);
            }
          }
        }

        return { courses: TUTORIAL_COURSES, categories: TUTORIAL_CATEGORIES };
      }
    } catch (err) {
      console.error("Supabase tutorialService getAll error:", err);
      return { courses: db.tutorialCourses, categories: db.tutorialCategories };
    }
  },

  // 2. CREATE COURSE
  async create(courseData: Partial<TutorialCourse>): Promise<TutorialCourse> {
    const supabase = getSupabaseAdminClient();
    const newId = courseData.id || `course-${Date.now().toString().slice(-4)}`;
    const slug = courseData.slug || courseData.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || newId;

    const fullCourse: TutorialCourse = {
      id: newId,
      title: courseData.title || "Kelas Tutorial Baru",
      slug,
      tagline: courseData.tagline || courseData.title || "",
      description: courseData.description || "",
      categoryId: courseData.categoryId || "ai-engineering",
      categoryName: courseData.categoryName || "AI & Machine Learning",
      subcategoryId: courseData.subcategoryId || "",
      subcategoryName: courseData.subcategoryName || "",
      level: courseData.level || "Beginner",
      duration: courseData.duration || "2 Jam",
      lessonCount: courseData.modules ? courseData.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) : courseData.lessonCount || 1,
      rating: 5.0,
      reviewCount: 0,
      enrolledCount: 0,
      thumbnail: courseData.thumbnail || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
      instructor: courseData.instructor || {
        name: "Rins",
        role: "Lead Engineer",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        bio: "Nexarin Instructor"
      },
      whatYouWillLearn: courseData.whatYouWillLearn || [],
      requirements: courseData.requirements || [],
      modules: courseData.modules || [],
      contentType: courseData.contentType || "course",
      tags: courseData.tags || [],
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (supabase) {
      try {
        const courseRow = {
          id: fullCourse.id,
          title: fullCourse.title,
          slug: fullCourse.slug,
          tagline: fullCourse.tagline,
          description: fullCourse.description,
          category_id: fullCourse.categoryId,
          category_name: fullCourse.categoryName,
          subcategory_id: fullCourse.subcategoryId,
          subcategory_name: fullCourse.subcategoryName,
          level: fullCourse.level,
          duration: fullCourse.duration,
          lesson_count: fullCourse.lessonCount,
          rating: fullCourse.rating,
          review_count: fullCourse.reviewCount,
          enrolled_count: fullCourse.enrolledCount,
          thumbnail: fullCourse.thumbnail,
          instructor_name: fullCourse.instructor.name,
          instructor_role: fullCourse.instructor.role,
          instructor_avatar: fullCourse.instructor.avatar,
          instructor_bio: fullCourse.instructor.bio,
          what_you_will_learn: fullCourse.whatYouWillLearn,
          requirements: fullCourse.requirements,
          content_type: fullCourse.contentType,
          tags: fullCourse.tags
        };
        await supabase.from("tutorial_courses").upsert(courseRow);

        for (const m of fullCourse.modules) {
          await supabase.from("tutorial_modules").upsert({
            id: m.id,
            course_id: fullCourse.id,
            title: m.title,
            description: m.description || "",
            order: m.order
          });
          for (const l of m.lessons) {
            await supabase.from("tutorial_lessons").upsert({
              id: l.id,
              course_id: fullCourse.id,
              module_id: m.id,
              title: l.title,
              slug: l.slug,
              duration: l.duration,
              order: l.order,
              content_type: l.contentType,
              content_markdown: l.contentMarkdown,
              is_preview_available: Boolean(l.isPreviewAvailable)
            });
          }
        }
      } catch (e) {
        console.error("Supabase tutorial create error:", e);
      }
    }

    db.tutorialCourses = [fullCourse, ...db.tutorialCourses.filter((c) => c.id !== fullCourse.id)];
    return fullCourse;
  },

  // 3. UPDATE COURSE
  async update(id: string, updatedData: Partial<TutorialCourse>): Promise<TutorialCourse | null> {
    const supabase = getSupabaseAdminClient();

    if (supabase) {
      try {
        const updateRow: any = {
          updated_at: new Date().toISOString()
        };
        if (updatedData.title) updateRow.title = updatedData.title;
        if (updatedData.slug) updateRow.slug = updatedData.slug;
        if (updatedData.tagline) updateRow.tagline = updatedData.tagline;
        if (updatedData.description) updateRow.description = updatedData.description;
        if (updatedData.categoryId) updateRow.category_id = updatedData.categoryId;
        if (updatedData.categoryName) updateRow.category_name = updatedData.categoryName;
        if (updatedData.level) updateRow.level = updatedData.level;
        if (updatedData.duration) updateRow.duration = updatedData.duration;
        if (updatedData.thumbnail) updateRow.thumbnail = updatedData.thumbnail;
        if (updatedData.tags) updateRow.tags = updatedData.tags;
        if (updatedData.whatYouWillLearn) updateRow.what_you_will_learn = updatedData.whatYouWillLearn;
        if (updatedData.lessonCount !== undefined) updateRow.lesson_count = updatedData.lessonCount;

        if (updatedData.instructor) {
          if (updatedData.instructor.name) updateRow.instructor_name = updatedData.instructor.name;
          if (updatedData.instructor.role) updateRow.instructor_role = updatedData.instructor.role;
        }

        await supabase.from("tutorial_courses").update(updateRow).eq("id", id);

        // Update modules and lessons if provided
        if (updatedData.modules) {
          for (const m of updatedData.modules) {
            await supabase.from("tutorial_modules").upsert({
              id: m.id,
              course_id: id,
              title: m.title,
              description: m.description || "",
              order: m.order
            });
            if (m.lessons) {
              for (const l of m.lessons) {
                await supabase.from("tutorial_lessons").upsert({
                  id: l.id,
                  course_id: id,
                  module_id: m.id,
                  title: l.title,
                  slug: l.slug,
                  duration: l.duration,
                  order: l.order,
                  content_type: l.contentType,
                  content_markdown: l.contentMarkdown,
                  is_preview_available: Boolean(l.isPreviewAvailable)
                });
              }
            }
          }
        }
      } catch (e) {
        console.error("Supabase tutorial update error:", e);
      }
    }

    const index = db.tutorialCourses.findIndex((c) => c.id === id);
    if (index !== -1) {
      const merged = { ...db.tutorialCourses[index], ...updatedData, updatedAt: new Date().toISOString() };
      db.tutorialCourses[index] = merged;
      return merged;
    }
    return null;
  },

  // 4. DELETE COURSE (Cascade in Supabase)
  async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseAdminClient();

    if (supabase) {
      try {
        // Delete lessons first
        await supabase.from("tutorial_lessons").delete().eq("course_id", id);
        // Delete modules
        await supabase.from("tutorial_modules").delete().eq("course_id", id);
        // Delete course
        const { error } = await supabase.from("tutorial_courses").delete().eq("id", id);
        if (error) {
          console.error("Supabase delete course error:", error);
        }
      } catch (e) {
        console.error("Supabase delete course exception:", e);
      }
    }

    db.tutorialCourses = db.tutorialCourses.filter((c) => c.id !== id);
    return true;
  }
};
