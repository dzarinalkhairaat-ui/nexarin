import PortfolioDetailPage from "@/features/portfolio/PortfolioDetailPage";
import {
  getPortfolioProjectBySlug,
  getPortfolioProjects,
} from "@/features/portfolio/portfolio.data";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  const projects = getPortfolioProjects();

  return projects
    .filter((project) => Boolean(project?.slug))
    .map((project) => ({
      slug: project.slug,
    }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "";
  const project = getPortfolioProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project tidak ditemukan",
      description: "Project portfolio Nexarin by-rins tidak ditemukan.",
      alternates: {
        canonical: `/portfolio/${slug || "preview"}`,
      },
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = project.title || "Project Portfolio Nexarin";
  const description =
    project.summary ||
    project.description ||
    "Detail project portfolio Nexarin by-rins.";
  const url = `https://nexarin.my.id/portfolio/${project.slug || slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/portfolio/${project.slug || slug}`,
    },
    openGraph: {
      type: "website",
      title: `${title} - Portfolio Nexarin by-rins`,
      description,
      url,
      siteName: "Nexarin by-rins",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - Portfolio Nexarin by-rins`,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PortfolioDetailRoute({ params }) {
  const resolvedParams = await params;

  return <PortfolioDetailPage slug={resolvedParams?.slug || ""} />;
}