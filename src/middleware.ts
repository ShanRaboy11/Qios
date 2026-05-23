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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const pathParts = request.nextUrl.pathname.split("/").filter(Boolean);
  const firstPathSegment = pathParts[0] || "";

  const isAuthRoute = firstPathSegment === "login";
  const isSuperAdminRoute = firstPathSegment === "admin";
  const secondPathSegment = pathParts[1] || "";

  // known top-level static route segments in app
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

  const isPublicCustomerRoute =
    firstPathSegment !== "" &&
    !knownStaticRoutes.includes(firstPathSegment) &&
    ["home", "order"].includes(secondPathSegment);

  // detect tenant or employee routes
  const isTenantOrEmployeeRoute =
    firstPathSegment !== "" && !knownStaticRoutes.includes(firstPathSegment);

  const pathTenantId = isTenantOrEmployeeRoute ? firstPathSegment : null;

  const isProtectedRoute =
    (isSuperAdminRoute || isTenantOrEmployeeRoute) && !isPublicCustomerRoute;

  // get user session for protected/auth routes
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

  // redirect unauthenticated users away from protected routes (disabled in dev)
  if (!user && isProtectedRoute && !isDev) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // tenant/employee authorization check (disabled in dev)
  if (user && isTenantOrEmployeeRoute && !isPublicCustomerRoute && !isDev) {
    let role = null;
    let userTenantId = null;

    if (accessToken) {
      try {
        const payload = JSON.parse(
          Buffer.from(accessToken.split(".")[1], "base64").toString(),
        );
        role = payload.user_role || (payload.role !== "authenticated" ? payload.role : null);
        userTenantId = payload.tenant_id || payload.tenantId;
      } catch (e) {}
    }

    // fallback to database if token does not contain claims
    if (!role) {
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

    // detect employee routes
    const isEmployeePath = request.nextUrl.pathname.startsWith(
      `/${pathTenantId}/employee`,
    );

    if (role === "super_admin") {
      // allow all access for now
    } else if (role === "admin") {
      if (userTenantId !== pathTenantId || isEmployeePath) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = userTenantId
          ? `/${userTenantId}/dashboard`
          : "/";
        return NextResponse.redirect(redirectUrl);
      }
    } else if (role === "employee") {
      if (userTenantId !== pathTenantId || !isEmployeePath) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = userTenantId
          ? `/${userTenantId}/employee/dashboard`
          : "/";
        return NextResponse.redirect(redirectUrl);
      }
    } else {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
  }

  // redirect authenticated users away from login
  const isServerAction = request.headers.has("next-action");

  if (user && isAuthRoute && !isServerAction) {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    let redirectPath = "/";

    if (token) {
      try {
        const payload = JSON.parse(
          Buffer.from(token.split(".")[1], "base64").toString(),
        );

        const role = payload.user_role || (payload.role !== "authenticated" ? payload.role : null);
        const tenantId = payload.tenant_id || payload.tenantId;

        if (role === "super_admin") {
          redirectPath = "/admin/dashboard";
        } else if (role === "admin" && tenantId) {
          redirectPath = `/${tenantId}/dashboard`;
        } else if (role === "employee" && tenantId) {
          redirectPath = `/${tenantId}/employee/dashboard`;
        }
      } catch (error) {
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
    "/((?!_next/static|_next/image|favicon.ico|images|svg|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
