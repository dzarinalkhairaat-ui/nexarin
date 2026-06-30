import AdminPwaRegistry from "./AdminPwaRegistry";

export const metadata = {
  manifest: "/manifest-admin.json",
};

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminPwaRegistry />
      {children}
    </>
  );
}
