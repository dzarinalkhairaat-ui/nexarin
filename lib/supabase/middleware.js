import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "nexarin_admin_session";
const ADMIN_SESSION_VALUE = "nexarin-admin-v2";

function getSupabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ""
  );
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

export async function updateSession(request) {
  const pathname = request.nextUrl.pathname;
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isLoginPath = pathname === "/admin/login";

  if (!isAdminPath) {
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

    if (!isLoginPath) {
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
  const hasValidAdminCookie = adminSessionValue === ADMIN_SESSION_VALUE;
  const hasAdminAccess = hasSupabaseSession && hasValidAdminCookie;

  if (!isLoginPath && !hasAdminAccess) {
    return redirectToLogin(request, pathname);
  }

  if (isLoginPath && hasAdminAccess) {
    return redirectToAdmin(request);
  }

  return supabaseResponse;
}