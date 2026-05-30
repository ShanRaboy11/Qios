import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.from("inventory_purchase_logs").select("*");
  
  const { data: items } = await admin.from("inventory_items").select("*");
  
  return NextResponse.json({ error, logs: data, items });
}
