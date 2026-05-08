import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

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

function isServerActionRequest(request) {
  const nextAction = request.headers.get("next-action");
  const contentType = request.headers.get("content-type") || "";

  return (
    request.method === "POST" &&
    (Boolean(nextAction) || contentType.includes("multipart/form-data"))
  );
}

function base64UrlToString(value) {
  try {
    const normalized = String(value || "")
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );

    return atob(padded);
  } catch {
    return "";
  }
}

function arrayBufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function signValue(value, secret) {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(String(value))
  );

  return arrayBufferToBase64Url(signature);
}

async function verifySignedAdminSessionCookie({ cookieValue, user }) {
  const secret = getAdminSessionSecret();

  if (!secret) {
    console.error("ADMIN_SESSION_SECRET atau ADMIN_OTP_SECRET belum diatur.");
    return false;
  }

  const [encodedPayload, signature] = String(cookieValue || "").split(".");

  if (!encodedPayload || !signature) {
    return false;
  }

  const expectedSignature = await signValue(encodedPayload, secret);

  if (signature !== expectedSignature) {
    return false;
  }

  let payload = null;

  try {
    payload = JSON.parse(base64UrlToString(encodedPayload));
  } catch {
    return false;
  }

  const payloadEmail = normalizeEmail(payload?.email);
  const payloadUserId = normalizeText(payload?.userId);
  const payloadExp = Number(payload?.exp);

  if (!payloadEmail || !payloadUserId || !Number.isFinite(payloadExp)) {
    return false;
  }

  if (payloadExp <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const sessionEmail = normalizeEmail(user?.email);
  const sessionUserId = normalizeText(user?.id);

  if (payloadEmail !== sessionEmail || payloadUserId !== sessionUserId) {
    return false;
  }

  if (!isAllowedAdminEmail(sessionEmail)) {
    return false;
  }

  return true;
}

function clearAdminCookie(response) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });

  return response;
}

function redirectToLogin(request, pathname) {
  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = "/admin/login";
  redirectUrl.search = "";
  redirectUrl.searchParams.set("redirectedFrom", pathname);

  const response = NextResponse.redirect(redirectUrl);

  return clearAdminCookie(response);
}

function redirectToAdmin(request) {
  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = "/admin";
  redirectUrl.search = "";

  return NextResponse.redirect(redirectUrl);
}

function isAdminAuthPath(pathname) {
  return pathname === "/admin/login" || pathname === "/admin/login/verify";
}

export async function updateSession(request) {
  const pathname = request.nextUrl.pathname;
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAuthPath = isAdminAuthPath(pathname);

  if (!isAdminPath) {
    return NextResponse.next({
      request,
    });
  }

  if (isServerActionRequest(request)) {
    return NextResponse.next({
      request,
    });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = getSupabaseAnonKey();

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Supabase env middleware belum lengkap. Cek NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );

    if (!isAuthPath) {
      return redirectToLogin(request, pathname);
    }

    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        supabaseResponse = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Gagal membaca user Supabase di middleware:", error.message);
  }

  const adminSessionValue =
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value || "";

  const hasSupabaseSession = Boolean(user);
  const hasValidAdminCookie =
    hasSupabaseSession &&
    (await verifySignedAdminSessionCookie({
      cookieValue: adminSessionValue,
      user,
    }));

  const hasAdminAccess = hasSupabaseSession && hasValidAdminCookie;

  if (!isAuthPath && !hasAdminAccess) {
    return redirectToLogin(request, pathname);
  }

  if (isAuthPath && hasAdminAccess) {
    return redirectToAdmin(request);
  }

  return supabaseResponse;
}