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

  const pathParts = request.nextUrl.pathname.split("/").filter(Boolean);
  const firstPathSegment = pathParts[0] || "";

  const isAuthRoute = firstPathSegment === "login";
  const isSuperAdminRoute = firstPathSegment === "admin";
  
  // Known top-level static route segments in your app directory
  const knownStaticRoutes = [
    "admin",
    "api",
    "auth",
    "contact",
    "draft",
    "login",
    "onboarding",
    "services",
    "setup",
  ];

  // If the URL has a first segment and it's not a known static route,
  // it means it's hitting the dynamic [id] route for tenant/employee.
  const isTenantOrEmployeeRoute = firstPathSegment !== "" && !knownStaticRoutes.includes(firstPathSegment);
  const pathTenantId = isTenantOrEmployeeRoute ? firstPathSegment : null;

  const isProtectedRoute = isSuperAdminRoute || isTenantOrEmployeeRoute;

  // We should always get the user for protected routes or auth route.
  let user = null;
  let accessToken = null;

  if (isProtectedRoute || isAuthRoute) {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
    
    if (user) {
      const { data: sessionData } = await supabase.auth.getSession();
      accessToken = sessionData.session?.access_token;
    }
  }

  const isDev = process.env.NODE_ENV === "development";

  // Redirect to login if accessing protected routes without session (bypass in dev)
  if (!user && isProtectedRoute && !isDev) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // If the user tries to access a tenant/employee route, check their role and tenant_id (bypass in dev)
  if (user && isTenantOrEmployeeRoute && !isDev) {
    let role = null;
    let userTenantId = null;

    if (accessToken) {
      try {
        const payload = JSON.parse(
          Buffer.from(accessToken.split(".")[1], "base64").toString()
        );
        role = payload.role ?? payload.user_role;
        userTenantId = payload.tenant_id;
      } catch (e) {}
    }

    if (!role) {
      // Fallback to fetch profile from db if token doesn't have claims yet
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, tenant_id")
        .eq("id", user.id)
        .single();
        
      if (profile) {
        role = profile.role;
        userTenantId = profile.tenant_id;
      }
    }

    // Role-based access control for tenant paths
    // Employee paths start with /[id]/employee
    const isEmployeePath = request.nextUrl.pathname.startsWith(`/${pathTenantId}/employee`);
    
    if (role === 'super_admin') {
      // Super admin can access anything? Or maybe we just redirect them to super admin area
      // Let's pass them through for now. Or redirect if they shouldn't be here.
    } else if (role === 'admin') {
      // Must match tenant id
      if (userTenantId !== pathTenantId || isEmployeePath) {
        // Not authorized for this tenant or trying to access employee path as admin
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = userTenantId ? `/${userTenantId}/dashboard` : "/";
        return NextResponse.redirect(redirectUrl);
      }
    } else if (role === 'employee') {
      if (userTenantId !== pathTenantId || !isEmployeePath) {
        // Not authorized for this tenant or trying to access admin path as employee
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = userTenantId ? `/${userTenantId}/employee/dashboard` : "/";
        return NextResponse.redirect(redirectUrl);
      }
    } else {
      // Any other role trying to access here -> home
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
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