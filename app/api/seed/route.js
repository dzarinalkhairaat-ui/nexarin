import { seedPortfolioProjects } from "@/features/portfolio/portfolio.actions";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await seedPortfolioProjects();
  return NextResponse.json(result);
}
