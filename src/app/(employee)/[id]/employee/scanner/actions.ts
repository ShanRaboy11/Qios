"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activityLogger";
import { revalidatePath } from "next/cache";
import { requireEmployeePermission } from "@/lib/serverPermissions";

export async function processScannedQr(tenantId: string, qrData: string) {
  const auth = await requireEmployeePermission(tenantId, "QR Code Scanning");
  if (!auth.ok) {
    throw new Error(auth.message);
  }

  const supabase = await createSupabaseServerClient();
  const normalizedQrData = qrData
    .trim()
    .replace(/^Order\s*#\s*/i, "")
    .replace(/^#\s*/, "");
  const isUUID =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      normalizedQrData,
    );
  const currentTenantId = tenantId.trim();

  let query = supabase.from("orders").select(`
      id,
      tenant_id,
      table_number,
      status,
      payment_status,
      total_price,
      created_at,
      updated_at,
      qr_hash,
      payment_method,
      order_items (
        id,
        quantity,
        unit_price,
        customization_notes,
        menu_items (
          id,
          name,
          description
        ),
        order_item_modifiers (
          id,
          modifier_options (
            name,
            additional_price
          )
        )
      )
    `);

  if (isUUID) {
    query = query.eq("id", normalizedQrData);
  } else {
    query = query.eq("qr_hash", normalizedQrData);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Invalid QR Code: Order not found.");
  }

  if (data.tenant_id !== currentTenantId) {
    throw new Error(
      "This QR code belongs to another business and cannot be processed here.",
    );
  }

  if (data.payment_status === "paid") {
    throw new Error(
      "This order has already been paid and cannot be processed here.",
    );
  }

  return data;
}

export async function updateOrderFromScanner(
  tenantId: string,
  orderId: string,
  newStatus: string,
  actionDesc: string,
) {
  const auth = await requireEmployeePermission(tenantId, "QR Code Scanning");
  if (!auth.ok) {
    throw new Error(auth.message);
  }

  const supabase = await createSupabaseServerClient();
  const currentTenantId = tenantId.trim();

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, role")
    .eq("id", auth.userId)
    .single();

  const actorName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : "Unknown System User";
  const actorRole = profile?.role ?? "employee";

  let updateQuery = supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .eq("tenant_id", currentTenantId);

  const { error } = await updateQuery;

  if (error) throw new Error(error.message);

  await logActivity({
    actorId: auth.userId,
    actorName,
    actorRole,
    actionType: "UPDATE",
    description: actionDesc,
    targetTenantId: tenantId,
  });

  revalidatePath(`/(employee)/[id]/employee/scanner`, "page");
  return { success: true };
}
