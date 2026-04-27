import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute = request.nextUrl.pathname === "/login";
  const isPublicRoute =
    isAuthRoute ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/public");

  // Redirect to login if accessing protected routes without session
  if (!user && !isPublicRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users trying to access login
  if (user && isAuthRoute) {
    // Attempt to decode role/tenant_id from the session token (requires the custom access token hook payload)
    // We can fetch user again via supabase or decode it
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    
    let redirectPath = "/";
    if (token) {
      try {
        const payload = JSON.parse(
          Buffer.from(token.split(".")[1], "base64").toString()
        );
        const role = payload.role ?? payload.user_role;
        const tenantId = payload.tenant_id;
        
        if (role === "super_admin") {
          redirectPath = "/admin/dashboard";
        } else if (role === "admin" && tenantId) {
          redirectPath = `/${tenantId}/dashboard`;
        } else if (role === "employee" && tenantId) {
          redirectPath = `/${tenantId}/employee/dashboard`;
        }
      } catch (error) {
        // Fallback to fetch profile from db if token doesn't have claims yet
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, tenant_id")
          .eq("id", user.id)
          .single();
          
        if (profile) {
          if (profile.role === "super_admin") {
            redirectPath = "/admin/dashboard";
          } else if (profile.role === "admin" && profile.tenant_id) {
            redirectPath = `/${profile.tenant_id}/dashboard`;
          } else if (profile.role === "employee" && profile.tenant_id) {
            redirectPath = `/${profile.tenant_id}/employee/dashboard`;
          }
        }
      }
    }
    
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = redirectPath;
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, svg, fonts
     */
    "/((?!_next/static|_next/image|favicon.ico|images|svg|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};