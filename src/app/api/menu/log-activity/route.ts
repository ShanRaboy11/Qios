import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/activityLogger";

export interface MenuActivityLogRequest {
  actionType: "CREATE" | "UPDATE" | "DELETE";
  entityType: "menu_item" | "category";
  entityId: string;
  entityName: string;
  tenantId: string;
  tenantName: string;
  metadata?: Record<string, unknown>;
}

/**
 * POST /api/menu/log-activity
 * 
 * Logs menu operations (create, update, delete) to system_activity_logs.
 * 
 * Request body:
 * {
 *   actionType: "CREATE" | "UPDATE" | "DELETE",
 *   entityType: "menu_item" | "category",
 *   entityId: string,
 *   entityName: string,
 *   tenantId: string,
 *   tenantName: string,
 *   metadata?: {...}
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // verify the request is from an authenticated user
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const admin = createSupabaseAdminClient();

    // verify token and get user info
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    const userId = userData.user.id;

    // get user profile info
    const { data: profile, error: profileErr } = await admin
      .from("profiles")
      .select("full_name, role, tenant_id")
      .eq("id", userId)
      .single();

    if (profileErr || !profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 403 }
      );
    }

    // verify user belongs to the target tenant (or is super_admin)
    if (
      profile.role !== "super_admin" &&
      profile.tenant_id !== (
        (await req.json() as MenuActivityLogRequest).tenantId
      )
    ) {
      return NextResponse.json(
        { error: "Unauthorized - tenant mismatch" },
        { status: 403 }
      );
    }

    // parse request body
    let logRequest: MenuActivityLogRequest;
    try {
      logRequest = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // validate required fields
    const { actionType, entityType, entityId, entityName, tenantId, tenantName, metadata } =
      logRequest;
    if (!actionType || !entityType || !entityId || !entityName || !tenantId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: actionType, entityType, entityId, entityName, tenantId",
        },
        { status: 400 }
      );
    }

    // build description
    const entityLabel =
      entityType === "menu_item" ? "menu item" : "menu category";
    const description = `${actionType.toLowerCase()}d ${entityLabel}: ${entityName}`;

    // log the activity
    await logActivity({
      actorId: userId,
      actorName: profile.full_name,
      actorRole: profile.role as string,
      actionType: actionType as "CREATE" | "UPDATE" | "DELETE",
      description,
      targetTenantId: tenantId,
      targetTenantName: tenantName,
      metadata: {
        entityType,
        entityId,
        entityName,
        ...metadata,
      },
    });

    return NextResponse.json(
      { success: true, message: "Activity logged successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[menu/log-activity] Error:", error);
    return NextResponse.json(
      { error: "Failed to log activity" },
      { status: 500 }
    );
  }
}
