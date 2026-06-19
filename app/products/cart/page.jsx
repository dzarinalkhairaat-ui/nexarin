import CartPage from "@/features/products/CartPage";

export const metadata = {
  title: "Keranjang Belanja",
  description:
    "Lihat dan kelola produk digital di keranjang belanja Anda sebelum checkout.",
  alternates: {
    canonical: "/products/cart",
  },
  openGraph: {
    title: "Keranjang Belanja - Nexarin by-rins",
    description:
      "Lihat dan kelola produk digital di keranjang belanja Anda sebelum checkout.",
    url: "https://nexarin.my.id/products/cart",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartRoute() {
  return <CartPage />;
}
