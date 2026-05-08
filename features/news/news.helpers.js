export function getSafeArticles(articles) {
  return Array.isArray(articles) ? articles : [];
}

export function getSafeSlug(slug) {
  return typeof slug === "string" ? slug : "";
}
