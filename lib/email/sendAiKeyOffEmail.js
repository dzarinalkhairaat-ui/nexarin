import nodemailer from "nodemailer";

function normalizeText(value) {
  return String(value || "").trim();
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
  const from = `Nexarin AI Runtime <${user}>`;
  
  return { host, port, secure: port === 465, user, pass, from };
}

function validateSmtpConfig(config) {
  if (!config.host || !config.port || !config.user || !config.pass) {
    return {
      ok: false,
      message: "Konfigurasi SMTP belum lengkap.",
    };
  }
  return { ok: true, message: "" };
}

export async function sendAiKeyOffEmail({ accountEmail, provider, accountDeleted = false, reason = "Off (diblokir/limit permanen)" }) {
  const smtpConfig = getSmtpConfig();
  const validation = validateSmtpConfig(smtpConfig);

  if (!validation.ok) {
    console.warn("Skipping AI Key Off Email:", validation.message);
    return validation;
  }

  let textMsg = `Api Key ${provider} dari email ${accountEmail} status: ${reason}.`;
  let accountDeletedHtml = "";

  if (accountDeleted) {
    textMsg += `\nKarena email ini sudah tidak memiliki API Key aktif, data akun tersebut telah otomatis dihapus dari sistem Nexarin.`;
    accountDeletedHtml = `
      <p style="margin:18px 0;padding:14px;border-radius:12px;border:1px solid rgba(225,29,72,0.25);background:rgba(225,29,72,0.1);color:#fda4af;font-size:13px;line-height:1.6;">
        Karena email ini sudah tidak memiliki API Key aktif, data akun tersebut telah otomatis dihapus dari sistem Nexarin.
      </p>
    `;
  }

  const isLimit = reason.toLowerCase().includes('limit');
  const accentColor = isLimit ? '245,158,11' : '225,29,72'; // amber for limit, rose for off
  const accentHex = isLimit ? '#fcd34d' : '#fda4af';

  const htmlTemplate = `
    <div style="margin:0;padding:0;background:#020617;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb;">
      <div style="max-width:560px;margin:0 auto;padding:32px 18px;">
        <div style="border:1px solid rgba(255,255,255,0.12);border-radius:28px;background:linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98));padding:28px;box-shadow:0 24px 80px rgba(0,0,0,0.35);">
          <div style="display:inline-block;border:1px solid rgba(139,92,246,0.24);border-radius:999px;background:rgba(139,92,246,0.1);padding:8px 14px;color:#c4b5fd;font-size:11px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;">
            Nexarin AI Runtime
          </div>

          <h1 style="margin:22px 0 10px;font-size:28px;line-height:1.05;color:#ffffff;letter-spacing:-0.04em;">
            Peringatan: API Key Alert
          </h1>

          <p style="margin:0 0 22px;color:#94a3b8;font-size:14px;line-height:1.7;">
            Api Key <strong style="color:#fff">${provider}</strong> dari email <strong style="color:#fff">${accountEmail}</strong> mengalami kendala dan perlu perhatian Anda.
          </p>

          <div style="margin:22px 0;padding:20px;border-radius:22px;border:1px solid rgba(${accentColor},0.25);background:rgba(${accentColor},0.1);text-align:center;">
            <div style="font-size:15px;line-height:1.5;font-weight:800;color:${accentHex};">
              Status: ${reason}
            </div>
          </div>

          ${accountDeletedHtml}

          <p style="margin:18px 0 0;color:#64748b;font-size:12px;line-height:1.7;">
            Pesan otomatis dari sistem Nexarin AI Runtime. Segera kelola API Keys Anda di dashboard admin.
          </p>
        </div>

        <p style="margin:18px 0 0;text-align:center;color:#475569;font-size:12px;">
          Nexarin by-rins
        </p>
      </div>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: { user: smtpConfig.user, pass: smtpConfig.pass },
    });

    const info = await transporter.sendMail({
      from: smtpConfig.from,
      to: accountEmail,
      subject: `[NEXARIN ALERT] API Key ${provider} ${reason.includes("limit") ? "Limit" : "Off"} - ${accountEmail}`,
      text: textMsg,
      html: htmlTemplate,
    });

    return { ok: true, messageId: info?.messageId || "" };
  } catch (error) {
    console.error("Gagal mengirim email alert API Key:", error);
    return { ok: false, message: error?.message || "Gagal kirim SMTP." };
  }
}
