import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { type RolePermissions } from "@/lib/employeePermissions";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

async function resolveEmployeeTenantId(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  tenantId: string | null,
  appRoleId: string | null,
) {
  if (tenantId) {
    return tenantId;
  }

  if (!appRoleId) {
    return null;
  }

  const { data: roleRow } = await admin
    .from("roles")
    .select("tenant_id")
    .eq("id", appRoleId)
    .maybeSingle();

  return typeof roleRow?.tenant_id === "string" ? roleRow.tenant_id : null;
}

export async function middleware(request: NextRequest) {
  const admin = createSupabaseAdminClient();
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
  const isRootRoute = firstPathSegment === "";
  const isSuperAdminRoute = firstPathSegment === "admin";
  const secondPathSegment = pathParts[1] || "";

  // known top-level static route segments in app
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

  // detect tenant or employee routes
  const isTenantOrEmployeeRoute =
    firstPathSegment !== "" && !knownStaticRoutes.includes(firstPathSegment);

  const pathTenantId = isTenantOrEmployeeRoute ? firstPathSegment : null;

  const isProtectedRoute =
    (isSuperAdminRoute || isTenantOrEmployeeRoute) && !isPublicCustomerRoute;

  // get user session for protected/auth routes
  let user = null;
  let accessToken = null;

  if (isProtectedRoute || isAuthRoute || isRootRoute) {
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

    // fallback to database if token does not contain claims
    if (!role) {
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
    }

    if (!role && userAppRoleId) {
      role = "employee";
    }

    if (!userAppRoleId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("app_role_id, tenant_id")
        .eq("id", user.id)
        .single();

      if (profile) {
        userAppRoleId = profile.app_role_id;
        userTenantId = userTenantId || profile.tenant_id;
      }
    }

    userTenantId = await resolveEmployeeTenantId(
      admin,
      userTenantId,
      userAppRoleId,
    );

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

  // redirect authenticated users away from login or guest landing page
  const isServerAction = request.headers.has("next-action");

  if (user && (isAuthRoute || isRootRoute) && !isServerAction) {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
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
      }

      if (metadataRoleHint) {
        role = "employee";
      }
    }

    tenantId = await resolveEmployeeTenantId(
      admin,
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
