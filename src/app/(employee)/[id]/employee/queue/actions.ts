"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activityLogger";
import { logEmployeeActivity } from "@/lib/employeeAuditLogger";
import {
  canAccessEmployeeRoute,
  canUpdateEmployeeOrderStatus,
  type RolePermissions,
} from "@/lib/employeePermissions";
import { revalidatePath } from "next/cache";

type QueueOrder = {
  id: string;
  order_number: string;
  status: "pending" | "preparing" | "ready" | "served";
  payment_status?: "unpaid" | "paid";
  created_at: string;
  table_number: string | null;
  order_type: string;
  items: Array<{
    id: string;
    quantity: number;
    notes: string;
    name: string;
  }>;
};

async function getEmployeeQueueContext(tenantId: string) {
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  const [{ data: userData }, { data: sessionData }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.auth.getSession(),
  ]);

  const user = userData.user ?? sessionData.session?.user ?? null;

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role, tenant_id, full_name, app_role_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error("Unauthorized");
  }

  if (profile.role !== "super_admin" && profile.tenant_id !== tenantId) {
    throw new Error("Unauthorized");
  }

  let permissions: RolePermissions | null = null;

  if (profile.app_role_id) {
    const { data: roleRow } = await admin
      .from("roles")
      .select("permissions")
      .eq("id", profile.app_role_id)
      .eq("tenant_id", tenantId)
      .maybeSingle();

    permissions = (roleRow?.permissions as RolePermissions | null) ?? null;
  }

  return { supabase, admin, user, profile, permissions };
}

export async function getEmployeeQueueData(tenantId: string) {
  const { admin, permissions, profile } =
    await getEmployeeQueueContext(tenantId);

  if (
    profile.role !== "super_admin" &&
    !canAccessEmployeeRoute(permissions, "queue")
  ) {
    throw new Error("Insufficient permissions to access order queue");
  }

  const [{ count: totalOrderCount }, { data: orders, error: ordersError }] =
    await Promise.all([
      admin
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", tenantId)
        .in("status", ["pending", "preparing", "ready"])
        .eq("payment_status", "paid"),
      admin
        .from("orders")
        .select(
          `
          id,
          qr_hash,
          status,
          payment_status,
          created_at,
          table_number,
          total_price,
          payment_method,
          order_items (
            id,
            quantity,
            customization_notes,
            menu_items (
              name
            )
          )
        `,
        )
        .eq("tenant_id", tenantId)
        .in("status", ["pending", "preparing", "ready"])
        .eq("payment_status", "paid")
        .order("created_at", { ascending: true }),
    ]);

  if (ordersError) {
    throw new Error(ordersError.message);
  }

  const mappedOrders: QueueOrder[] =
    orders?.map((order: any) => ({
      id: order.id,
      order_number: order.qr_hash ?? order.id,
      status: order.status,
      payment_status: order.payment_status,
      created_at: order.created_at,
      table_number: order.table_number,
      order_type: "",
      items: (order.order_items || []).map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        notes: item.customization_notes || "",
        name: item.menu_items?.name || "Unknown Item",
      })),
    })) ?? [];

  return {
    orders: mappedOrders,
    totalOrderCount: totalOrderCount ?? 0,
    canUpdateStatus:
      profile.role === "super_admin" ||
      canUpdateEmployeeOrderStatus(permissions),
  };
}

export async function updateOrderStatus(
  orderId: string,
  tenantId: string,
  newStatus: "pending" | "preparing" | "ready" | "served" | "cancelled",
) {
  const { supabase, admin, user, profile, permissions } =
    await getEmployeeQueueContext(tenantId);

  if (
    profile.role !== "super_admin" &&
    !canUpdateEmployeeOrderStatus(permissions)
  ) {
    throw new Error("Insufficient permissions to update order status");
  }

  const { data: previousOrder } = await admin
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  const { error } = await admin
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .eq("tenant_id", tenantId);

  if (error) {
    throw new Error(error.message);
  }

  const actorName = profile.full_name || "Unknown System User";
  const actorRole = profile?.role ?? "employee";

  // log activity
  await logActivity({
    actorId: user.id,
    actorName,
    actorRole,
    actionType: "UPDATE",
    description: `Updated order ${orderId} status from ${previousOrder?.status || "unknown"} to ${newStatus}`,
    targetTenantId: tenantId,
  });

  revalidatePath(`/(employee)/[id]/employee/queue`, "page");
  revalidatePath(`/(employee)/[id]/employee/kitchen`, "page");
  revalidatePath(`/(employee)/[id]/employee/dashboard`, "page");
  revalidatePath(`/(tenant)/[id]/dashboard`, "page");
  return { success: true };
}

export async function updateOrderPaymentStatus(
  orderId: string,
  tenantId: string,
  paymentStatus: "paid",
  paymentMethod: string,
) {
  const { supabase, admin, user, profile } =
    await getEmployeeQueueContext(tenantId);

  const actorName = profile.full_name || "Unknown System User";
  const actorRole = profile?.role ?? "employee";

  const { error } = await admin
    .from("orders")
    .update({
      payment_status: paymentStatus,
      payment_method: paymentMethod,
      status: "pending",
    })
    .eq("id", orderId)
    .eq("tenant_id", tenantId);

  if (error) {
    throw new Error(error.message);
  }

  await logActivity({
    actorId: user.id,
    actorName,
    actorRole,
    actionType: "UPDATE",
    description: `Updated order ${orderId} payment status to ${paymentStatus}`,
    targetTenantId: tenantId,
  });

  // Log payment collection to employee_audit_logs (sales)
  void logEmployeeActivity({
    tenantId,
    actorId: user.id,
    actorName,
    actorRole,
    actionType: "CREATE",
    description: `Payment collected for order #${orderId.substring(0, 8).toUpperCase()} via ${paymentMethod}`,
    targetType: "order",
    targetId: orderId,
    targetName: `Order #${orderId.substring(0, 8).toUpperCase()}`,
    metadata: { paymentMethod, paymentStatus },
  });

  revalidatePath(`/(employee)/[id]/employee/queue`, "page");
  return { success: true };
}
