import { productMarketplaceData } from "@/features/products/products.data";

const MIN_SUBCATEGORY_CHIPS = 6;

const previewSubcategoryLabels = [
  "Template",
  "Source Code",
  "UI Kit",
  "Asset Pack",
  "Starter Pack",
  "Workflow",
];

export function getSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function parseProductPrice(value) {
  if (!value || typeof value !== "string") {
    return 0;
  }

  const numberOnly = value.replace(/[^\d]/g, "");

  return Number(numberOnly || 0);
}

export function getProductCategory(slug) {
  const categories = getSafeArray(productMarketplaceData?.categories);

  return (
    categories.find((category) => category?.slug === slug) || {
      label: "Kategori Produk",
      slug,
    }
  );
}

export function getCategoryProducts(categorySlug) {
  return getSafeArray(productMarketplaceData?.products).filter(
    (product) => product?.categorySlug === categorySlug
  );
}

export function getSubcategorySource(product) {
  return (
    product?.subcategory ||
    product?.subcategoryLabel ||
    product?.type ||
    product?.tag ||
    "Lainnya"
  );
}

export function getSubcategoryValue(label) {
  return String(label || "lainnya")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function getProductSubcategories(products) {
  const safeProducts = getSafeArray(products);
  const map = new Map();

  safeProducts.forEach((product) => {
    const label = getSubcategorySource(product);
    const value = getSubcategoryValue(label);

    if (!map.has(value)) {
      map.set(value, {
        value,
        label,
        isPreview: false,
      });
    }
  });

  const subcategories = [
    {
      value: "semua",
      label: "Semua",
      isPreview: false,
    },
    ...Array.from(map.values()),
  ];

  previewSubcategoryLabels.forEach((label) => {
    if (subcategories.length >= MIN_SUBCATEGORY_CHIPS) {
      return;
    }

    const value = getSubcategoryValue(label);

    if (!subcategories.some((subcategory) => subcategory.value === value)) {
      subcategories.push({
        value,
        label,
        isPreview: true,
      });
    }
  });

  return subcategories.slice(0, MIN_SUBCATEGORY_CHIPS);
}

export function getFilteredCategoryProducts({
  products,
  activeSubcategory = "semua",
  sortBy = "terbaru",
}) {
  const safeProducts = getSafeArray(products);

  const subcategoryProducts =
    activeSubcategory === "semua"
      ? safeProducts
      : safeProducts.filter((product) => {
          const productSubcategory = getSubcategorySource(product);

          return getSubcategoryValue(productSubcategory) === activeSubcategory;
        });

  const clonedProducts = [...subcategoryProducts];

  if (sortBy === "termahal") {
    return clonedProducts.sort(
      (a, b) => parseProductPrice(b?.price) - parseProductPrice(a?.price)
    );
  }

  if (sortBy === "termurah") {
    return clonedProducts.sort(
      (a, b) => parseProductPrice(a?.price) - parseProductPrice(b?.price)
    );
  }

  return clonedProducts;
}