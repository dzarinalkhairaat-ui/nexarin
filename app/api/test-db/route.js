import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const now = new Date();
  try {
    const articles = await prisma.newsArticle.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { publishedAt: null },
          { publishedAt: { lte: now } }
        ],
        category: {
          is: {
            isActive: true,
          },
        },
      },
      include: {
        category: true
      }
    });
    
    const all = await prisma.newsArticle.findMany({ include: { category: true } });
    
    return NextResponse.json({
      success: true,
      filtered: articles,
      all: all
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}
