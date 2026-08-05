"use server";

import { createHmac } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "nexarin_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours untuk login manual

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function base64UrlEncode(value) {
  return Buffer.from(String(value), "utf8").toString("base64url");
}

function signValue(value, secret) {
  return createHmac("sha256", secret).update(String(value)).digest("base64url");
}

function getAdminSessionSecret() {
  return normalizeText(
    process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_OTP_SECRET || "fallback_secret_nexarin_123"
  );
}

function createSignedAdminSessionValue({ email }) {
  const secret = getAdminSessionSecret();
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    v: 1,
    email: normalizeEmail(email),
    iat: now,
    exp: now + ADMIN_SESSION_MAX_AGE,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signValue(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

function getCookieSecureFlag() {
  return process.env.NODE_ENV === "production";
}

function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: getCookieSecureFlag(),
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  };
}

function getAllowedAdminEmails() {
  const envEmails = String(
    process.env.NEXARIN_ADMIN_EMAILS ||
      process.env.NEXARIN_ADMIN_EMAIL ||
      process.env.ADMIN_EMAIL ||
      ""
  );
  
  if (envEmails) {
    return envEmails.split(",").map(normalizeEmail).filter(Boolean);
  }
  
  // Fallback sesuai permintaan khusus
  return ["dzarinalkhairaat@gmail.com", "nexarinbyrins@gmail.com"];
}

function isAllowedAdminEmail(email) {
  const safeEmail = normalizeEmail(email);
  const allowedEmails = getAllowedAdminEmails();

  if (!safeEmail || allowedEmails.length === 0) {
    return false;
  }

  return allowedEmails.includes(safeEmail);
}

export async function adminLoginAction(email, password) {
  try {
    const safeEmail = normalizeEmail(email);
    
    // Verifikasi Email
    if (!isAllowedAdminEmail(safeEmail)) {
      return { ok: false, message: "Email ini tidak memiliki akses admin." };
    }

    // Verifikasi Password
    const correctPassword = normalizeText(process.env.NEXARIN_ADMIN_PASSWORD || "150906");
    if (password !== correctPassword) {
      return { ok: false, message: "Password salah." };
    }

    // Buat sesi
    const cookieStore = await cookies();
    const signedSessionValue = createSignedAdminSessionValue({
      email: safeEmail,
    });

    cookieStore.set(
      ADMIN_SESSION_COOKIE,
      signedSessionValue,
      getAdminSessionCookieOptions()
    );

    return { ok: true, message: "Login berhasil" };
  } catch (error) {
    console.error("Error creating admin session:", error.message);
    return {
      ok: false,
      message: "Terjadi kesalahan internal pada server.",
    };
  }
}

export async function clearAdminSessionAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  return { ok: true, message: "Logout berhasil" };
}
