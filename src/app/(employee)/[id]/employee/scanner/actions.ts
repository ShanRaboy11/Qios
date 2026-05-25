"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activityLogger";
import { revalidatePath } from "next/cache";

export async function processScannedQr(
  tenantId: string,
  qrData: string
) {
  const supabase = await createSupabaseServerClient();
  
  // accept either qr_hash or standard UUID (if qrData looks like UUID)
  const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(qrData.trim());
  
  let query = supabase
    .from("orders")
    .select(`
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
    `)
    .eq('tenant_id', tenantId);

  if (isUUID) {
    query = query.eq('id', qrData.trim());
  } else {
    query = query.eq('qr_hash', qrData.trim());
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Invalid QR Code: Order not found or doesn't belong to your restaurant.");
  }

  return data;
}

export async function updateOrderFromScanner(
  tenantId: string,
  orderId: string,
  newStatus: string,
  actionDesc: string
) {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, role")
    .eq("id", user.id)
    .single();

  const actorName = profile ? `${profile.first_name} ${profile.last_name}` : "Unknown System User";
  const actorRole = profile?.role ?? "employee";

  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .eq("tenant_id", tenantId);

  if (error) throw new Error(error.message);

  await logActivity({
    actorId: user.id,
    actorName,
    actorRole,
    actionType: "UPDATE",
    description: actionDesc,
    targetTenantId: tenantId,
  });

  revalidatePath(`/(employee)/[id]/employee/scanner`, "page");
  return { success: true };
}