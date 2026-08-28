import { NextResponse } from "next/server";
import { tutorialService } from "@/lib/services/tutorialService";

export async function GET() {
  try {
    const result = await tutorialService.getAll();
    return NextResponse.json({
      success: true,
      data: result.courses,
      categories: result.categories
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await tutorialService.create(body);
    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
