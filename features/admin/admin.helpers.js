import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const ADMIN_SESSION_COOKIE = "nexarin_admin_session";

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function getSupabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ""
  );
}

function getAdminSessionSecret() {
  return normalizeText(
    process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_OTP_SECRET
  );
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

function signValue(value, secret) {
  return createHmac("sha256", secret).update(String(value)).digest("base64url");
}

function safeCompare(leftValue, rightValue) {
  const left = Buffer.from(String(leftValue || ""));
  const right = Buffer.from(String(rightValue || ""));

  if (left.length === 0 || right.length === 0 || left.length !== right.length) {
    return false;
  }

  try {
    return timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

function decodeSessionPayload(encodedPayload) {
  try {
    const decodedPayload = Buffer.from(String(encodedPayload || ""), "base64url")
      .toString("utf8");

    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}

function verifySignedAdminSessionCookie({ cookieValue, user }) {
  const secret = getAdminSessionSecret();

  if (!secret) {
    return {
      ok: false,
      message: "Secret admin session belum tersedia.",
    };
  }

  const [encodedPayload, signature] = String(cookieValue || "").split(".");

  if (!encodedPayload || !signature) {
    return {
      ok: false,
      message: "Sesi admin tidak valid atau sudah habis. Login ulang dulu.",
    };
  }

  const expectedSignature = signValue(encodedPayload, secret);

  if (!safeCompare(signature, expectedSignature)) {
    return {
      ok: false,
      message: "Sesi admin tidak valid atau sudah habis. Login ulang dulu.",
    };
  }

  const payload = decodeSessionPayload(encodedPayload);

  if (!payload) {
    return {
      ok: false,
      message: "Sesi admin tidak valid atau sudah habis. Login ulang dulu.",
    };
  }

  const payloadEmail = normalizeEmail(payload?.email);
  const payloadUserId = normalizeText(payload?.userId);
  const payloadExp = Number(payload?.exp);

  if (!payloadEmail || !payloadUserId || !Number.isFinite(payloadExp)) {
    return {
      ok: false,
      message: "Sesi admin tidak valid atau sudah habis. Login ulang dulu.",
    };
  }

  if (payloadExp <= Math.floor(Date.now() / 1000)) {
    return {
      ok: false,
      message: "Sesi admin sudah habis. Login ulang dulu.",
    };
  }

  const sessionEmail = normalizeEmail(user?.email);
  const sessionUserId = normalizeText(user?.id);

  if (payloadEmail !== sessionEmail || payloadUserId !== sessionUserId) {
    return {
      ok: false,
      message: "Sesi admin tidak cocok. Login ulang dulu.",
    };
  }

  if (!isAllowedAdminEmail(sessionEmail)) {
    return {
      ok: false,
      message: "Akun ini tidak punya akses admin Nexarin.",
    };
  }

  return {
    ok: true,
    message: "Sesi admin valid.",
    user: {
      id: sessionUserId,
      email: sessionEmail,
    },
    payload,
  };
}

async function createSupabaseServerClient(cookieStore) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = getSupabaseAnonKey();

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      ok: false,
      message:
        "Konfigurasi Supabase belum lengkap. Cek NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      supabase: null,
    };
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Aman diabaikan kalau context tidak bisa set cookie.
        }
      },
    },
  });

  return {
    ok: true,
    message: "",
    supabase,
  };
}

function createInvalidAdminSessionResponse(message) {
  return {
    ok: false,
    message: message || "Sesi admin tidak valid atau sudah habis. Login ulang dulu.",
  };
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const adminSessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value || "";

  if (!adminSessionValue) {
    return createInvalidAdminSessionResponse();
  }

  const supabaseClientResult = await createSupabaseServerClient(cookieStore);

  if (!supabaseClientResult.ok) {
    return createInvalidAdminSessionResponse(supabaseClientResult.message);
  }

  try {
    const {
      data: { user },
      error,
    } = await supabaseClientResult.supabase.auth.getUser();

    if (error || !user) {
      return createInvalidAdminSessionResponse();
    }

    const sessionEmail = normalizeEmail(user?.email);

    if (!isAllowedAdminEmail(sessionEmail)) {
      return createInvalidAdminSessionResponse(
        "Akun ini tidak punya akses admin Nexarin."
      );
    }

    return verifySignedAdminSessionCookie({
      cookieValue: adminSessionValue,
      user,
    });
  } catch (error) {
    console.error("Gagal memvalidasi sesi admin:", error);

    return createInvalidAdminSessionResponse();
  }
}

export async function isAdminReady() {
  const adminSession = await requireAdminSession();

  return Boolean(adminSession?.ok);
}

export async function getAdminSession() {
  return requireAdminSession();
}