"use server";

import { sendSupportEmail } from "@/lib/email/sendSupportEmail";

export async function submitSupportFormAction(formData) {
  try {
    const name = formData.get("name");
    const nominal = formData.get("nominal");
    const message = formData.get("message");

    if (!name || !nominal) {
      return { ok: false, message: "Mohon lengkapi Nama dan Nominal." };
    }

    // Attempt to send email if there is any message (or you can send it regardless)
    // The requirement says "kemudian saya ingin untuk pesan opsional nya ditujukan ke email saya".
    // Let's just send the email whenever the form is submitted so the owner gets notified.
    const emailResult = await sendSupportEmail({ name, nominal, message });

    if (!emailResult.ok) {
      console.warn("Email gagal dikirim:", emailResult.message);
      // We don't fail the checkout process just because email failed
    }

    return {
      ok: true,
      message: "Form berhasil disubmit.",
    };
  } catch (error) {
    console.error("Support form action error:", error);
    return {
      ok: false,
      message: "Terjadi kesalahan internal. Silakan coba lagi.",
    };
  }
}
