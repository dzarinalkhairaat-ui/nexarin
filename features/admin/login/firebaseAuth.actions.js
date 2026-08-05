"use server";

import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase/admin";

const ADMIN_SESSION_COOKIE = "nexarin_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 2; // 2 hours

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
    process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_OTP_SECRET
  );
}

function createSignedAdminSessionValue({ email, userId }) {
  const secret = getAdminSessionSecret();

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET atau ADMIN_OTP_SECRET belum diatur.");
  }

  const now = Math.floor(Date.now() / 1000);

  const payload = {
    v: 1,
    email: normalizeEmail(email),
    userId: normalizeText(userId),
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
  return String(
    process.env.NEXARIN_ADMIN_EMAILS ||
      process.env.NEXARIN_ADMIN_EMAIL ||
      process.env.ADMIN_EMAIL ||
      ""
  )
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter(Boolean);
}

function isAllowedAdminEmail(email) {
  const safeEmail = normalizeEmail(email);
  const allowedEmails = getAllowedAdminEmails();

  if (!safeEmail || allowedEmails.length === 0) {
    return false;
  }

  return allowedEmails.includes(safeEmail);
}

export async function setFirebaseAdminSessionAction(idToken) {
  try {
    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    if (!decodedToken || !decodedToken.email) {
      return { ok: false, message: "Token tidak valid atau tidak memiliki email." };
    }

    const email = normalizeEmail(decodedToken.email);
    
    if (!isAllowedAdminEmail(email)) {
      return { ok: false, message: "Email ini tidak memiliki akses admin." };
    }

    const cookieStore = await cookies();
    const signedSessionValue = createSignedAdminSessionValue({
      email: email,
      userId: decodedToken.uid,
    });

    cookieStore.set(
      ADMIN_SESSION_COOKIE,
      signedSessionValue,
      getAdminSessionCookieOptions()
    );

    return { ok: true, message: "Login berhasil" };
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return { ok: false, message: "Sesi login tidak valid atau kadaluarsa. Silakan login kembali." };
  }
}

export async function clearFirebaseAdminSessionAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  return { ok: true, message: "Logout berhasil" };
}
