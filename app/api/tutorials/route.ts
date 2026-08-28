"use server";

import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { TutorialCourse } from "@/types/tutorial";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: db.tutorialCourses,
      categories: db.tutorialCategories
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newCourse: TutorialCourse = {
      ...body,
      id: body.id || `course-${Date.now().toString().slice(-4)}`,
      rating: body.rating || 5.0,
      reviewCount: body.reviewCount || 0,
      enrolledCount: body.enrolledCount || 0,
      lessonCount: body.modules ? body.modules.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) : (body.lessonCount || 0),
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.tutorialCourses = [newCourse, ...db.tutorialCourses];

    return NextResponse.json({ success: true, data: newCourse });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
