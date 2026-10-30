import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isNetworkOrServerDownError } from "@/lib/utils";

async function resolveEmployeeTenantId(
  admin: ReturnType<typeof createSupabaseAdminClient> | null,
  tenantId: string | null,
  appRoleId: string | null,
) {
  if (tenantId) {
    return tenantId;
  }

  if (!appRoleId || !admin) {
    return null;
  }

  try {
    const { data: roleRow } = await admin
      .from("roles")
      .select("tenant_id")
      .eq("id", appRoleId)
      .maybeSingle();

    return typeof roleRow?.tenant_id === "string" ? roleRow.tenant_id : null;
  } catch (error) {
    console.warn("[Middleware] resolveEmployeeTenantId failed:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathParts = request.nextUrl.pathname.split("/").filter(Boolean);
  const firstPathSegment = pathParts[0] || "";

  const isAuthRoute = firstPathSegment === "login";
  const isRootRoute = firstPathSegment === "";
  const isSuperAdminRoute = firstPathSegment === "admin";
  const secondPathSegment = pathParts[1] || "";

  // Known top-level static/public route segments in app
  const knownStaticRoutes = [
    "admin",
    "api",
    "auth",
    "contact",
    "draft",
    "legal",
    "login",
    "onboarding",
    "services",
    "setup",
  ];

  const isPublicCustomerRoute =
    firstPathSegment !== "" &&
    !knownStaticRoutes.includes(firstPathSegment) &&
    ["home", "order"].includes(secondPathSegment);

  // Detect tenant or employee routes
  const isTenantOrEmployeeRoute =
    firstPathSegment !== "" && !knownStaticRoutes.includes(firstPathSegment);

  const pathTenantId = isTenantOrEmployeeRoute ? firstPathSegment : null;

  const isProtectedRoute =
    (isSuperAdminRoute || isTenantOrEmployeeRoute) && !isPublicCustomerRoute;

  const isDev = process.env.NODE_ENV === "development";

  // Check if request carries any Supabase session cookies
  const allCookies = request.cookies.getAll();
  const hasAuthCookies = allCookies.some(
    (c) => c.name.startsWith("sb-") || c.name.includes("auth-token")
  );

  // FAST PATH 1:
  // For guest landing page (/) or login page (/login) without auth cookies,
  // there is guaranteed no user session to redirect away from.
  // Bypass Supabase network calls entirely so static pages load instantly even if Supabase is offline/paused!
  if ((isRootRoute || isAuthRoute) && !hasAuthCookies) {
    return supabaseResponse;
  }

  // FAST PATH 2:
  // For protected routes with NO auth cookies, don't waste time calling Supabase.
  // Immediately redirect to login.
  if (isProtectedRoute && !hasAuthCookies && !isDev) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isProtectedRoute && !isDev) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("error", "server_down");
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
  });

  // Get user session for protected/auth routes with strict timeout protection
  let user = null;
  let accessToken = null;
  let serverConnectionError = false;

  if (isProtectedRoute || ((isAuthRoute || isRootRoute) && hasAuthCookies)) {
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Supabase auth timeout")), 2500)
      );

      const authResult = await Promise.race([
        supabase.auth.getUser(),
        timeoutPromise,
      ]);

      if (authResult.error) {
        if (isNetworkOrServerDownError(authResult.error)) {
          serverConnectionError = true;
        }
      } else {
        user = authResult.data?.user ?? null;
      }

      if (user) {
        try {
          const sessionTimeout = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Supabase session timeout")), 2000)
          );
          const { data: sessionData } = await Promise.race([
            supabase.auth.getSession(),
            sessionTimeout,
          ]);
          accessToken = sessionData.session?.access_token;
        } catch {
          // ignore session fetch failure
        }
      }
    } catch (err) {
      console.warn("[Middleware] Supabase unreachable or timed out:", err);
      serverConnectionError = true;
      user = null;
    }
  }

  // Redirect unauthenticated users away from protected routes (disabled in dev)
  if (!user && isProtectedRoute && !isDev) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    if (serverConnectionError) {
      loginUrl.searchParams.set("error", "server_down");
    }
    return NextResponse.redirect(loginUrl);
  }

  // Lazy admin client initialization
  let admin: ReturnType<typeof createSupabaseAdminClient> | null = null;
  const getAdminClient = () => {
    if (!admin) {
      try {
        admin = createSupabaseAdminClient();
      } catch {
        admin = null;
      }
    }
    return admin;
  };

  // Tenant/employee authorization check (disabled in dev)
  if (user && isTenantOrEmployeeRoute && !isPublicCustomerRoute && !isDev) {
    let role = null;
    let userTenantId = null;
    let userAppRoleId = null;
    const userMetadata = user.user_metadata as
      | Record<string, unknown>
      | undefined;

    if (accessToken) {
      try {
        const payload = JSON.parse(
          Buffer.from(accessToken.split(".")[1], "base64").toString(),
        );
        role =
          payload.user_role ||
          (payload.role !== "authenticated" ? payload.role : null);
        userTenantId = payload.tenant_id || payload.tenantId;
      } catch (e) {}
    }

    if (!userTenantId) {
      userTenantId =
        (typeof userMetadata?.tenant_id === "string"
          ? userMetadata.tenant_id
          : undefined) ||
        (typeof userMetadata?.tenantId === "string"
          ? userMetadata.tenantId
          : undefined);
    }

    if (!userAppRoleId) {
      userAppRoleId =
        (typeof userMetadata?.app_role_id === "string"
          ? userMetadata.app_role_id
          : undefined) ||
        (typeof userMetadata?.appRoleId === "string"
          ? userMetadata.appRoleId
          : undefined);
    }

    // Fallback to database if token does not contain claims
    if (!role) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, tenant_id, app_role_id")
          .eq("id", user.id)
          .single();

        if (profile) {
          role = profile.role;
          userTenantId = profile.tenant_id;
          userAppRoleId = profile.app_role_id;
        }
      } catch (err) {
        console.warn("[Middleware] Failed to fetch profile role:", err);
      }
    }

    if (!role && userAppRoleId) {
      role = "employee";
    }

    if (!userAppRoleId) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("app_role_id, tenant_id")
          .eq("id", user.id)
          .single();

        if (profile) {
          userAppRoleId = profile.app_role_id;
          userTenantId = userTenantId || profile.tenant_id;
        }
      } catch (err) {
        console.warn("[Middleware] Failed to fetch profile app_role_id:", err);
      }
    }

    userTenantId = await resolveEmployeeTenantId(
      getAdminClient(),
      userTenantId,
      userAppRoleId,
    );

    // Detect employee routes
    const isEmployeePath = request.nextUrl.pathname.startsWith(
      `/${pathTenantId}/employee`,
    );

    if (role === "super_admin") {
      // Allow all access for now
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

  // Redirect authenticated users away from login or guest landing page
  const isServerAction = request.headers.has("next-action");

  if (user && (isAuthRoute || isRootRoute) && !isServerAction) {
    let token = accessToken;
    if (!token) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        token = sessionData.session?.access_token;
      } catch {
        // ignore
      }
    }

    const userMetadata = user.user_metadata as
      | Record<string, unknown>
      | undefined;

    let redirectPath = "/";
    let role = null;
    let tenantId = null;
    let userAppRoleId = null;

    if (token) {
      try {
        const payload = JSON.parse(
          Buffer.from(token.split(".")[1], "base64").toString(),
        );

        role =
          payload.user_role ||
          (payload.role !== "authenticated" ? payload.role : null);
        tenantId = payload.tenant_id || payload.tenantId;
        userAppRoleId = payload.app_role_id || payload.appRoleId || null;
      } catch (error) {}
    }

    if (!role) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, tenant_id, app_role_id")
          .eq("id", user.id)
          .single();

        if (profile) {
          role = profile.role;
          tenantId = profile.tenant_id;
          userAppRoleId = profile.app_role_id ?? userAppRoleId;

          if (!role && profile.app_role_id) {
            role = "employee";
          }
        }
      } catch (err) {
        console.warn("[Middleware] Failed to fetch profile for redirect:", err);
      }
    }

    if (!tenantId) {
      tenantId =
        (typeof userMetadata?.tenant_id === "string"
          ? userMetadata.tenant_id
          : undefined) ||
        (typeof userMetadata?.tenantId === "string"
          ? userMetadata.tenantId
          : undefined);
    }

    if (!role) {
      const metadataRoleHint =
        (typeof userMetadata?.app_role_id === "string"
          ? userMetadata.app_role_id
          : undefined) ||
        (typeof userMetadata?.appRoleId === "string"
          ? userMetadata.appRoleId
          : undefined);

      if (metadataRoleHint) {
        userAppRoleId = metadataRoleHint;
        role = "employee";
      }
    }

    tenantId = await resolveEmployeeTenantId(
      getAdminClient(),
      tenantId,
      role === "employee"
        ? typeof userAppRoleId === "string"
          ? userAppRoleId
          : null
        : null,
    );

    if (role === "super_admin") {
      redirectPath = "/admin/dashboard";
    } else if (role === "admin" && tenantId) {
      redirectPath = `/${tenantId}/dashboard`;
    } else if (role === "employee" && tenantId) {
      redirectPath = `/${tenantId}/employee/dashboard`;
    }

    if (redirectPath !== request.nextUrl.pathname) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = redirectPath;
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|svg|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
