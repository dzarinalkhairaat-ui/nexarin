export const ppobPulsaOperators = [
  {
    label: "Telkomsel",
    slug: "telkomsel",
    image: "/images/products/ppob/icons/telkomsel.jpeg",
  },
  {
    label: "Indosat",
    slug: "indosat",
    image: "/images/products/ppob/icons/indosat.jpeg",
  },
  {
    label: "XL Axiata",
    slug: "xl-axiata",
    image: "/images/products/ppob/icons/xl.jpeg",
  },
  {
    label: "Axis",
    slug: "axis",
    image: "/images/products/ppob/icons/axis.jpeg",
  },
  {
    label: "Tri",
    slug: "tri",
    image: "/images/products/ppob/icons/tri.jpeg",
  },
  {
    label: "Smartfren",
    slug: "smartfren",
    image: "/images/products/ppob/icons/smartfren.jpeg",
  },
  {
    label: "By.U",
    slug: "byu",
    image: "/images/products/ppob/icons/by.u.jpeg",
  },
];

export const ppobPulsaNominals = [
  {
    label: "Pulsa 5.000",
    value: "Rp 5.000",
    price: "Rp 7.000",
    badge: "Starter",
  },
  {
    label: "Pulsa 10.000",
    value: "Rp 10.000",
    price: "Rp 12.000",
    badge: "Favorit",
  },
  {
    label: "Pulsa 15.000",
    value: "Rp 15.000",
    price: "Rp 17.000",
    badge: "Hemat",
  },
  {
    label: "Pulsa 20.000",
    value: "Rp 20.000",
    price: "Rp 22.000",
    badge: "Cepat",
  },
  {
    label: "Pulsa 25.000",
    value: "Rp 25.000",
    price: "Rp 27.000",
    badge: "Popular",
  },
  {
    label: "Pulsa 50.000",
    value: "Rp 50.000",
    price: "Rp 52.000",
    badge: "Best",
  },
  {
    label: "Pulsa 75.000",
    value: "Rp 75.000",
    price: "Rp 77.000",
    badge: "Plus",
  },
  {
    label: "Pulsa 100.000",
    value: "Rp 100.000",
    price: "Rp 102.000",
    badge: "Max",
  },
];

export function getPpobPulsaOperator(slug) {
  return (
    ppobPulsaOperators.find((operator) => operator.slug === slug) || {
      label: "Operator",
      slug,
      image: "",
    }
  );
}