import AdminAiKeysPage from "@/features/admin/ai-keys/AdminAiKeysPage";

export const metadata = {
  title: "API Keys Settings",
  description: "Pengaturan API Key Gemini/Groq untuk Nexarin",
  robots: { index: false, follow: false },
};

export default function AdminAiKeysRoute() {
  return <AdminAiKeysPage />;
}
