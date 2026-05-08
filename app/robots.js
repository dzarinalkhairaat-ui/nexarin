export const dynamic = "force-static";

const BASE_URL = "https://nexarin.my.id";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api",
          "/api/",
          "/login",
          "/register",
          "/dashboard",
          "/dashboard/",
          "/private",
          "/private/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}