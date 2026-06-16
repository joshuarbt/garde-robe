import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicEnv } from "@/lib/env/public";

const protectedRoutes = ["/dashboard", "/wardrobe", "/outfits", "/calendar", "/voyages", "/compte"];
const authRoutes = ["/login", "/signup"];

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  });

  const { supabaseUrl, supabasePublishableKey } = getPublicEnv();
  const { pathname } = request.nextUrl;

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        let anyChanged = false;

        cookiesToSet.forEach(({ name, value, options }) => {
          const existing = request.cookies.get(name)?.value;
          if (existing === value) {
            return;
          }

          anyChanged = true;
          request.cookies.set(name, value);
          supabaseResponse.cookies.set(name, value, options);
        });

        if (anyChanged) {
          Object.entries(headers).forEach(([key, headerValue]) => {
            supabaseResponse.headers.set(key, headerValue);
          });
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (!user && isProtectedRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  if (user && isAuthRoute) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/wardrobe";
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}
