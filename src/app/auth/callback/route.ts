import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const resolvePostAuthRedirect = async (
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
  nextPath: string,
) => {
  if (nextPath && nextPath !== "/") {
    return nextPath;
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;

  let role: string | null = null;
  let tenantId: string | null = null;

  if (accessToken) {
    try {
      const payload = JSON.parse(
        Buffer.from(accessToken.split(".")[1], "base64").toString(),
      );
      role = payload.role ?? payload.user_role ?? null;
      tenantId = payload.tenant_id ?? null;
    } catch {
      // fall through to profile lookup
    }
  }

  if (!role) {
    const supabaseAdmin = createSupabaseAdminClient();
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role, tenant_id")
      .eq("id", userId)
      .maybeSingle();

    role = profile?.role ?? null;
    tenantId = profile?.tenant_id ?? null;
  }

  if (role === "super_admin") {
    return "/admin/dashboard";
  }

  if (role === "admin" && tenantId) {
    return `/${tenantId}/dashboard`;
  }

  if (role === "employee" && tenantId) {
    return `/${tenantId}/employee/dashboard`;
  }

  return "/";
};

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  // Default redirect is the homepage, or user's specific requested URL
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    let supabaseResponse = NextResponse.redirect(new URL(next, request.url));

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
            supabaseResponse = NextResponse.redirect(new URL(next, request.url));
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: userData } = await supabase.auth.getUser();
      const resolvedPath = userData.user?.id
        ? await resolvePostAuthRedirect(supabase, userData.user.id, next)
        : next;

      supabaseResponse.headers.set(
        "Location",
        new URL(resolvedPath, request.url).toString(),
      );

      return supabaseResponse;
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(new URL("/login?error=auth-callback-failed", request.url));
}