"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activityLogger";
import { logEmployeeActivity } from "@/lib/employeeAuditLogger";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(
  orderId: string,
  tenantId: string,
  newStatus: string
) {
  const supabase = await createSupabaseServerClient();

  // get current user and profile for logging
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, role")
    .eq("id", user.id)
    .single();

  const actorName = profile ? `${profile.first_name} ${profile.last_name}` : "Unknown System User";
  const actorRole = profile?.role ?? "employee";

  const { data: previousOrder } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .eq("tenant_id", tenantId);

  if (error) {
    throw new Error(error.message);
  }

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
  return { success: true };
}

export async function updateOrderPaymentStatus(
  orderId: string,
  tenantId: string,
  paymentStatus: "paid",
  paymentMethod: string,
) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, role")
    .eq("id", user.id)
    .single();

  const actorName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : "Unknown System User";
  const actorRole = profile?.role ?? "employee";

  const { error } = await supabase
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