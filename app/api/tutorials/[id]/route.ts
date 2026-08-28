"use server";

import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const course = db.tutorialCourses.find((c) => c.id === id || c.slug === id);
    if (!course) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: course });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const index = db.tutorialCourses.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }

    const updated = {
      ...db.tutorialCourses[index],
      ...body,
      updatedAt: new Date().toISOString()
    };
    db.tutorialCourses[index] = updated;

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    db.tutorialCourses = db.tutorialCourses.filter((c) => c.id !== id);
    return NextResponse.json({ success: true, message: "Course deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
