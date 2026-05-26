import React from "react";
import KitchenPreparationDashboard from "@/components/organisms/KitchenPreparationDashboard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

interface OrderItem {
  id: string;
  quantity: number;
  customization_notes: string | null;
  menu_items: { name: string | null } | null;
}

async function getInitialOrders(tenantId: string) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("orders")
    .select(
      `
        id,
        order_number,
        status,
        payment_status,
        created_at,
        table_number,
        order_type,
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
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching queue orders:", error);
    return [];
  }

  return (
    data?.map((order: any) => ({
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      payment_status: order.payment_status,
      created_at: order.created_at,
      table_number: order.table_number,
      order_type: order.order_type,
      items: (order.order_items as OrderItem[] | undefined)?.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        notes: item.customization_notes || "",
        name: item.menu_items?.name || "Unknown Item",
      })) ?? [],
    })) ?? []
  );
}

export default async function OrderQueuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = await params;
  const initialOrders = await getInitialOrders(tenantId);

  return (
    <div className="flex flex-col pb-32">
      <header className="mb-6">
        <h2 className="h2 text-text-primary">Order Queue</h2>
        <p className="b1 text-text-secondary mt-2">
          Active orders being prepared in the kitchen
        </p>
      </header>

      <div className="w-full">
        <KitchenPreparationDashboard tenantId={tenantId} initialOrders={initialOrders} />
      </div>
    </div>
  );
}
