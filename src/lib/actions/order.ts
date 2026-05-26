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

    // 2. Insert the order record
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

    // 3. Build order_items rows
    //    customization_notes contains a human-readable summary for quick staff reference.
    const orderItemsToInsert = cartItems.map((item) => {
      const notes: string[] = [];

      if (item.selectedOptions.length > 0) {
        const optionSummary = item.selectedOptions
          .map((o) => {
            const price = o.additionalPrice > 0 ? ` (+₱${o.additionalPrice.toFixed(2)})` : "";
            return `${o.modifierGroupName}: ${o.name}${price}`;
          })
          .join(", ");
        notes.push(optionSummary);
      }

      if (item.specialInstructions?.trim()) {
        notes.push(`Instructions: ${item.specialInstructions.trim()}`);
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

    // 4. Insert order_items and get back their IDs
    const { data: insertedItems, error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsToInsert)
      .select("id, menu_item_id");

    if (itemsError || !insertedItems) {
      console.error("Failed to insert order items:", itemsError);
      return { success: false, error: "Failed to save order items" };
    }

    // 5. Build a map from menu_item_id -> order_item_id for linking modifiers
    //    (there could be multiple order_items per menu_item if ordered twice, so we
    //    match by index preserving insertion order)
    const orderItemModifiers: {
      tenant_id: string;
      order_item_id: string;
      modifier_option_id: string;
      additional_price: number;
    }[] = [];

    for (let i = 0; i < cartItems.length; i++) {
      const cartItem = cartItems[i];
      const insertedItem = insertedItems[i];

      if (!insertedItem) continue;

      for (const option of cartItem.selectedOptions) {
        orderItemModifiers.push({
          tenant_id: tenantId,
          order_item_id: insertedItem.id,
          modifier_option_id: option.id,
          additional_price: option.additionalPrice,
        });
      }
    }

    // 6. Insert into order_item_modifiers (if any selections were made)
    if (orderItemModifiers.length > 0) {
      const { error: modifiersError } = await supabase
        .from("order_item_modifiers")
        .insert(orderItemModifiers);

      if (modifiersError) {
        // non-fatal: order is still valid; log and continue
        console.error("Failed to insert order item modifiers:", modifiersError);
      }
    }

    // 7. Log the CREATE event in system_activity_logs
    const itemSummary = cartItems
      .map((i) => `${i.quantity}× ${i.menuItem.name}`)
      .join(", ");

    await logActivity({
      actorName: "Customer",
      actorRole: "Guest",
      actionType: "CREATE",
      description: `Customer placed a new order (QR: ${qrHash}) — ${itemSummary}.`,
      targetTenantId: tenantId,
      metadata: {
        orderId,
        qrHash,
        itemCount: cartItems.length,
        totalPrice,
      },
    });

    return { success: true, orderId, qrHash };
  } catch (err: any) {
    console.error("Unexpected error placing order:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred",
    };
  }
}
