"use server";

import { prisma } from "@/lib/prisma";
import { portfolioProjects as staticProjects } from "./portfolio.data";

export async function getPortfolioProjects() {
  try {
    const projects = await prisma.portfolioProject.findMany({
      orderBy: { createdAt: "asc" },
    });
    
    // Fallback to static if DB is empty
    if (!projects || projects.length === 0) {
      return staticProjects;
    }
    
    return projects;
  } catch (error) {
    console.error("Failed to fetch portfolio projects from DB:", error);
    return staticProjects; // Fallback to static data on error
  }
}

export async function getPortfolioProjectBySlug(slug) {
  try {
    const project = await prisma.portfolioProject.findUnique({
      where: { slug },
    });
    
    if (!project) {
      // Fallback to static
      return staticProjects.find((p) => p.slug === slug) || null;
    }
    
    return project;
  } catch (error) {
    console.error(`Failed to fetch project ${slug} from DB:`, error);
    return staticProjects.find((p) => p.slug === slug) || null;
  }
}

export async function seedPortfolioProjects() {
  try {
    for (const project of staticProjects) {
      await prisma.portfolioProject.upsert({
        where: { slug: project.slug },
        update: project,
        create: project,
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to seed portfolio projects:", error);
    return { success: false, error: error.message };
  }
}
