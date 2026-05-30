import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const admin = createSupabaseAdminClient();
  
  // Get all items that have stock and a purchase price
  const { data: items, error: itemsError } = await admin
    .from("inventory_items")
    .select("*")
    .gt("current_stock", 0)
    .gt("purchase_price", 0);

  if (itemsError) return NextResponse.json({ error: itemsError });

  const logs = [];
  for (const item of items || []) {
    // Check if a log exists for this item
    const { data: existingLogs } = await admin
      .from("inventory_purchase_logs")
      .select("id")
      .eq("inventory_item_id", item.id)
      .limit(1);
      
    if (!existingLogs || existingLogs.length === 0) {
      // Create a retroactive log matching the creation date of the item
      const log = {
        tenant_id: item.tenant_id,
        inventory_item_id: item.id,
        quantity: item.current_stock,
        unit_price: item.purchase_price,
        total_cost: Number(item.current_stock) * Number(item.purchase_price),
        created_at: item.created_at, // Use the item's creation date so it shows on the chart on that day!
      };
      
      const { error: insertError } = await admin.from("inventory_purchase_logs").insert(log);
      if (!insertError) logs.push(log);
    }
  }

  return NextResponse.json({ message: `Synced ${logs.length} retroactive purchases!`, logs });
}
