import nodemailer from "nodemailer";

function normalizeText(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getSmtpPort() {
  const port = Number(process.env.ADMIN_OTP_SMTP_PORT || 465);
  if (!Number.isFinite(port) || port <= 0) {
    return 465;
  }
  return port;
}

function getSmtpConfig() {
  const host = normalizeText(process.env.ADMIN_OTP_SMTP_HOST || "smtp.gmail.com");
  const port = getSmtpPort();
  const user = normalizeText(process.env.ADMIN_OTP_SMTP_USER);
  const pass = normalizeText(process.env.ADMIN_OTP_SMTP_PASS);
  const from = `"Nexarin Support" <${user}>`;

  return {
    host,
    port,
    secure: port === 465,
    user,
    pass,
    from,
  };
}

function validateSmtpConfig(config) {
  if (!config.host || !config.port || !config.user || !config.pass) {
    return {
      ok: false,
      message: "Konfigurasi SMTP belum lengkap. Cek variabel ADMIN_OTP_SMTP_* di .env",
    };
  }
  return { ok: true, message: "" };
}

function createSupportEmailHtml({ name, nominal, message }) {
  const safeName = escapeHtml(name);
  const safeNominal = escapeHtml(nominal);
  const safeMessage = escapeHtml(message) || "<i>Tidak ada pesan opsional yang dilampirkan.</i>";

  return `
    <div style="margin:0;padding:0;background:#020617;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb;">
      <div style="max-width:600px;margin:0 auto;padding:32px 18px;">
        <div style="border:1px solid rgba(255,255,255,0.12);border-radius:28px;background:linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98));padding:32px;box-shadow:0 24px 80px rgba(0,0,0,0.35);">
          
          <div style="display:inline-block;border:1px solid rgba(52,211,153,0.24);border-radius:999px;background:rgba(52,211,153,0.1);padding:8px 14px;color:#34d399;font-size:11px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;">
            Pesan Dukungan Baru
          </div>

          <h1 style="margin:24px 0 16px;font-size:26px;line-height:1.2;color:#ffffff;letter-spacing:-0.03em;">
            Dukungan Masuk dari <span style="color:#34d399;">${safeName}</span>
          </h1>

          <div style="margin:24px 0;padding:24px;border-radius:20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);">
            <p style="margin:0 0 12px;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;font-weight:bold;">Total Dukungan</p>
            <div style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:0.02em;">
              ${safeNominal}
            </div>
          </div>

          <div style="margin:24px 0;padding:24px;border-radius:20px;background:rgba(52,211,153,0.05);border:1px solid rgba(52,211,153,0.15);">
            <p style="margin:0 0 12px;color:#34d399;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;font-weight:bold;">Pesan Pengunjung</p>
            <p style="margin:0;color:#e2e8f0;font-size:15px;line-height:1.6;font-style:italic;">
              "${safeMessage}"
            </p>
          </div>

          <p style="margin:32px 0 0;color:#64748b;font-size:13px;line-height:1.6;text-align:center;">
            Pastikan untuk memverifikasi pembayaran pada mutasi rekening bank atau notifikasi E-Wallet Anda.
          </p>

        </div>
        <p style="margin:20px 0 0;text-align:center;color:#475569;font-size:12px;">
          Notifikasi Otomatis Nexarin by-rins
        </p>
      </div>
    </div>
  `;
}

export async function sendSupportEmail({ name, nominal, message }) {
  const safeName = normalizeText(name);
  const safeNominal = normalizeText(nominal);

  if (!safeName || !safeNominal) {
    return { ok: false, message: "Nama dan Nominal wajib diisi." };
  }

  const smtpConfig = getSmtpConfig();
  const validation = validateSmtpConfig(smtpConfig);

  if (!validation.ok) {
    return validation;
  }

  // Define Target Email
  const TARGET_EMAIL = "nexarinbyrins@gmail.com";

  try {
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
    });

    const info = await transporter.sendMail({
      from: smtpConfig.from,
      to: TARGET_EMAIL,
      subject: `🎉 Pesan Dukungan Baru dari ${safeName} (${safeNominal})`,
      text: `Dukungan dari: ${safeName}\nNominal: ${safeNominal}\nPesan: ${normalizeText(message) || "Tidak ada pesan."}`,
      html: createSupportEmailHtml({ name: safeName, nominal: safeNominal, message }),
    });

    return {
      ok: true,
      message: "Email berhasil dikirim.",
      messageId: info?.messageId || "",
    };
  } catch (error) {
    console.error("Gagal mengirim email support:", error);
    return {
      ok: false,
      message: error?.message || "Gagal mengirim email notifikasi.",
    };
  }
}
