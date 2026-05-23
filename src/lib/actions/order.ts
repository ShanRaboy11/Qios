"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/activityLogger";
import { CartItem } from "@/contexts/CartContext";

export async function placeOrder(
  tenantId: string,
  cartItems: CartItem[],
  totalPrice: number,
) {
  try {
    const supabase = createSupabaseAdminClient();

    // 1. Generate a random 6-character QR hash for anonymous tracking
    const qrHash = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 2. Insert into orders table
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        tenant_id: tenantId,
        status: "pending",
        payment_status: "unpaid",
        total_price: totalPrice,
        qr_hash: qrHash,
      })
      .select("id")
      .single();

    if (orderError || !orderData) {
      console.error("Failed to create order:", orderError);
      return { success: false, error: "Failed to create order" };
    }

    const orderId = orderData.id;

    // 3. Prepare order items
    const orderItemsToInsert = cartItems.map((item) => {
      // Build customization notes from size, add-ons, and special instructions
      const notes = [];
      if (item.selectedSize !== "s1") {
        notes.push("Size: Large");
      }
      if (item.selectedModifiers.length > 0) {
        // Since we only have mock modifier IDs for now, we'll just note that add-ons were selected
        notes.push(`Add-ons: ${item.selectedModifiers.length}`);
      }
      if (item.specialInstructions?.trim()) {
        notes.push(`Notes: ${item.specialInstructions.trim()}`);
      }

      return {
        tenant_id: tenantId,
        order_id: orderId,
        menu_item_id: item.menuItem.id,
        quantity: item.quantity,
        unit_price: item.menuItem.price,
        customization_notes: notes.length > 0 ? notes.join(" | ") : null,
      };
    });

    // 4. Insert into order_items table
    if (orderItemsToInsert.length > 0) {
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsToInsert);

      if (itemsError) {
        console.error("Failed to insert order items:", itemsError);
        return { success: false, error: "Failed to save order items" };
      }
    }

    // 5. Log activity
    await logActivity({
      actorName: "Customer",
      actorRole: "Guest",
      actionType: "CREATE",
      description: `Customer placed a new order with ${cartItems.length} items.`,
      targetTenantId: tenantId,
    });

    return {
      success: true,
      orderId,
      qrHash,
    };
  } catch (err: any) {
    console.error("Unexpected error placing order:", err);
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}
