import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/lib/database.types";
import { env } from "@/lib/env";

/**
 * Frischt die Supabase-Session auf und macht optimistische Redirects.
 * Die echte Prüfung passiert in der DAL, in Server Actions und per RLS.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  let cacheHeaders: Record<string, string> = {};

  const supabase = createServerClient<Database>(
    env.supabaseUrl,
    env.supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          // Verhindert, dass ein CDN Antworten mit Session-Cookies cacht.
          cacheHeaders = { ...cacheHeaders, ...headers };
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value),
          );
        },
      },
    },
  );

  // Kein Code zwischen createServerClient und getClaims() – sonst drohen zufällige Logouts.
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);

  const { pathname } = request.nextUrl;
  const isDashboard =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (!isLoggedIn && isDashboard) {
    return redirectWithSession(request, "/login", response, cacheHeaders);
  }
  if (isLoggedIn && isAuthPage) {
    return redirectWithSession(request, "/dashboard", response, cacheHeaders);
  }

  return response;
}

/** Redirect, der aufgefrischte Cookies und Cache-Header übernimmt – sonst endet die Session. */
function redirectWithSession(
  request: NextRequest,
  pathname: string,
  sessionResponse: NextResponse,
  cacheHeaders: Record<string, string>,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";

  const redirect = NextResponse.redirect(url);
  sessionResponse.cookies
    .getAll()
    .forEach((cookie) => redirect.cookies.set(cookie));
  Object.entries(cacheHeaders).forEach(([key, value]) =>
    redirect.headers.set(key, value),
  );
  return redirect;
}
