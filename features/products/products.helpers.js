export function getSafeProducts(products) {
  return Array.isArray(products) ? products : [];
}
