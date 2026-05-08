export function getSafeProjects(projects) {
  return Array.isArray(projects) ? projects : [];
}
