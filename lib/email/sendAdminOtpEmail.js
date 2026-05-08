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
  const from =
    normalizeText(process.env.ADMIN_OTP_EMAIL_FROM) ||
    `Nexarin Security <${user}>`;

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
      message:
        "Konfigurasi SMTP OTP belum lengkap. Cek ADMIN_OTP_SMTP_HOST, ADMIN_OTP_SMTP_PORT, ADMIN_OTP_SMTP_USER, dan ADMIN_OTP_SMTP_PASS.",
    };
  }

  return {
    ok: true,
    message: "",
  };
}

function createOtpEmailText({ otp, expiresMinutes }) {
  return [
    "Kode OTP Login Admin Nexarin",
    "",
    `Kode OTP: ${otp}`,
    "",
    `Kode ini berlaku ${expiresMinutes} menit dan hanya bisa digunakan satu kali.`,
    "Jika bukan kamu yang mencoba login, abaikan email ini dan segera cek keamanan akun admin.",
    "",
    "Nexarin Security",
  ].join("\n");
}

function createOtpEmailHtml({ otp, expiresMinutes }) {
  const safeOtp = escapeHtml(otp);
  const safeExpiresMinutes = escapeHtml(expiresMinutes);

  return `
    <div style="margin:0;padding:0;background:#020617;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb;">
      <div style="max-width:560px;margin:0 auto;padding:32px 18px;">
        <div style="border:1px solid rgba(255,255,255,0.12);border-radius:28px;background:linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98));padding:28px;box-shadow:0 24px 80px rgba(0,0,0,0.35);">
          <div style="display:inline-block;border:1px solid rgba(34,211,238,0.24);border-radius:999px;background:rgba(34,211,238,0.1);padding:8px 14px;color:#67e8f9;font-size:11px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;">
            Nexarin Security
          </div>

          <h1 style="margin:22px 0 10px;font-size:28px;line-height:1.05;color:#ffffff;letter-spacing:-0.04em;">
            Kode OTP Login Admin
          </h1>

          <p style="margin:0 0 22px;color:#94a3b8;font-size:14px;line-height:1.7;">
            Gunakan kode berikut untuk melanjutkan login ke dashboard admin Nexarin.
          </p>

          <div style="margin:22px 0;padding:20px;border-radius:22px;border:1px solid rgba(52,211,153,0.25);background:rgba(16,185,129,0.1);text-align:center;">
            <div style="font-size:34px;line-height:1;font-weight:900;letter-spacing:0.18em;color:#ffffff;">
              ${safeOtp}
            </div>
          </div>

          <p style="margin:0;color:#cbd5e1;font-size:14px;line-height:1.7;">
            Kode ini berlaku <strong style="color:#ffffff;">${safeExpiresMinutes} menit</strong> dan hanya bisa digunakan satu kali.
          </p>

          <p style="margin:18px 0 0;color:#64748b;font-size:12px;line-height:1.7;">
            Jika bukan kamu yang mencoba login, abaikan email ini dan segera cek keamanan akun admin.
          </p>
        </div>

        <p style="margin:18px 0 0;text-align:center;color:#475569;font-size:12px;">
          Nexarin by-rins
        </p>
      </div>
    </div>
  `;
}

export async function sendAdminOtpEmail({
  to,
  otp,
  expiresMinutes = 5,
} = {}) {
  const safeTo = normalizeText(to);
  const safeOtp = normalizeText(otp);

  if (!safeTo || !safeOtp) {
    return {
      ok: false,
      message: "Email tujuan dan OTP wajib tersedia.",
    };
  }

  const smtpConfig = getSmtpConfig();
  const validation = validateSmtpConfig(smtpConfig);

  if (!validation.ok) {
    return validation;
  }

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
      to: safeTo,
      subject: "Kode OTP Login Admin Nexarin",
      text: createOtpEmailText({
        otp: safeOtp,
        expiresMinutes,
      }),
      html: createOtpEmailHtml({
        otp: safeOtp,
        expiresMinutes,
      }),
    });

    return {
      ok: true,
      message: "Email OTP berhasil dikirim.",
      messageId: info?.messageId || "",
    };
  } catch (error) {
    console.error("Gagal mengirim email OTP admin:", error);

    return {
      ok: false,
      message:
        error?.message ||
        "Email OTP gagal dikirim. Cek konfigurasi SMTP Gmail.",
    };
  }
}