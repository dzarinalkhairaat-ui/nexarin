import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/db/supabase";
import { TUTORIAL_CATEGORIES, TUTORIAL_COURSES } from "@/data/mockTutorials";

export async function GET() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 500 });
  }

  try {
    // 1. Seed categories
    const catRows = TUTORIAL_CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      icon_name: c.iconName,
      color: c.color
    }));
    await supabase.from("tutorial_categories").upsert(catRows);

    // 2. Seed courses, modules, lessons
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
        await supabase.from("tutorial_modules").upsert({
          id: m.id,
          course_id: c.id,
          title: m.title,
          description: m.description || "",
          order: m.order
        });

        for (const l of m.lessons) {
          await supabase.from("tutorial_lessons").upsert({
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
          });
        }
      }
    }

    const { count: courseCount } = await supabase.from("tutorial_courses").select("*", { count: "exact", head: true });
    const { count: catCount } = await supabase.from("tutorial_categories").select("*", { count: "exact", head: true });

    return NextResponse.json({
      success: true,
      message: "Tutorials successfully seeded into Supabase DB!",
      categoriesCount: catCount,
      coursesCount: courseCount
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
