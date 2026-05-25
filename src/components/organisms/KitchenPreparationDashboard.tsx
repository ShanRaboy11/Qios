"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { updateOrderStatus } from "@/app/(employee)/[id]/employee/queue/actions";

type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "completed"
  | "served"
  | "cancelled"
  | "voided";

interface OrderItem {
  id: string;
  name: string;
  notes: string;
  quantity: number;
}

interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  created_at: string;
  table_number: string | null;
  order_type: string;
  items: OrderItem[];
}

interface OrderWithPercentage extends Order {
  timeDisplay: string;
  targetTimePercentage: number;
}

export default function KitchenPreparationDashboard() {
  const params = useParams();
  const tenantId = params.id as string;

  const [orders, setOrders] = useState<Order[]>([]);
  const [now, setNow] = useState(Date.now());
  const supabase = createSupabaseBrowserClient();

  const fetchOrders = useCallback(async () => {
    if (!tenantId) return;
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        order_number,
        status,
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
      console.error("Error fetching orders:", error);
      return;
    }

    if (data) {
      const mappedOrders: Order[] = data.map((d: any) => ({
        id: d.id,
        order_number: d.order_number,
        status: d.status,
        created_at: d.created_at,
        table_number: d.table_number,
        order_type: d.order_type,
        items: d.order_items
          ? d.order_items.map((i: any) => ({
              id: i.id,
              quantity: i.quantity,
              notes: i.customization_notes || "",
              name: i.menu_items?.name || "Unknown Item",
            }))
          : [],
      }));
      setOrders(mappedOrders);
    }
  }, [tenantId, supabase]);

  useEffect(() => {
    if (!tenantId) return;

    fetchOrders();

    const channel = supabase
      .channel("kitchen_orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `tenant_id=eq.${tenantId}`,
        },
        () => {
          fetchOrders();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tenantId, fetchOrders, supabase]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    try {
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      await updateOrderStatus(orderId, tenantId, newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
      fetchOrders(); // Revert on failure
    }
  };

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");

  const activeCount = pendingOrders.length + preparingOrders.length;

  const mappedOrdersWithPercent = useMemo(() => {
    const baseWaitTimeMs = 10 * 60 * 1000; // 10 minutes
    const delayMultiplier = Math.max(1, activeCount);
    const targetTimeMs = baseWaitTimeMs * delayMultiplier;

    return orders.map((order) => {
      const createdTime = new Date(order.created_at).getTime();
      const timeElapsedMs = Math.max(0, now - createdTime);
      const targetTimePercentage = Math.floor(
        (timeElapsedMs / targetTimeMs) * 100,
      );

      const elapsedMinutes = Math.floor(timeElapsedMs / 60000);
      const hours = Math.floor(elapsedMinutes / 60);
      const mins = elapsedMinutes % 60;
      const timeDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

      return {
        ...order,
        timeDisplay,
        targetTimePercentage,
      };
    });
  }, [orders, now, activeCount]);

  const pOrders = mappedOrdersWithPercent.filter((o) => o.status === "pending");
  const prepOrders = mappedOrdersWithPercent.filter(
    (o) => o.status === "preparing",
  );
  const rOrders = mappedOrdersWithPercent.filter((o) => o.status === "ready");

  const renderOrderCard = (order: OrderWithPercentage) => (
    <div
      key={order.id}
      className="bg-white rounded-[24px] overflow-hidden shadow-sm border-[1.5px] border-[#ffc670]/40 p-4 flex flex-col gap-4 transition-all hover:shadow-md hover:border-[#ffc670]/80"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-text-primary">
            #{order.order_number}
          </span>
        </div>
        <div
          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${order.targetTimePercentage > 100 ? "bg-red-100 text-red-600" : "bg-gray-100 text-text-secondary"}`}
        >
          {order.timeDisplay}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
        <span className="px-2 py-0.5 bg-gray-100 rounded-md shrink-0">
          Table {order.table_number || "N/A"}
        </span>
        <span>�</span>
        <span className="truncate">{order.order_type.replace("_", "-")}</span>
        <span>�</span>
        <span
          className={`${order.targetTimePercentage > 100 ? "text-red-500 font-bold" : ""} shrink-0`}
        >
          {order.targetTimePercentage}%
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-start border-b border-gray-50 pb-2 last:border-0 last:pb-0"
          >
            <div className="flex gap-3">
              <div className="bg-gray-100 text-text-secondary w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0">
                {item.quantity}x
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary">
                  {item.name}
                </span>
                {item.notes && (
                  <span className="text-xs text-text-secondary mt-0.5 line-clamp-1">
                    {item.notes}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-2 flex">
        {order.status === "pending" && (
          <button
            onClick={() => handleUpdateStatus(order.id, "preparing")}
            className="w-full py-2.5 rounded-xl text-sm font-bold transition-all bg-white text-text-primary hover:bg-bg-primary active:bg-gray-100 border border-brand-primary shadow-sm"
          >
            Start Preparing
          </button>
        )}
        {order.status === "preparing" && (
          <button
            onClick={() => handleUpdateStatus(order.id, "ready")}
            className="w-full py-2.5 rounded-xl text-sm font-bold transition-all bg-success-primary text-text-tertiary hover:bg-success-primary/90 active:bg-success-primary/80 shadow-sm"
          >
            Mark Ready
          </button>
        )}
        {order.status === "ready" && (
          <Button
            onClick={() => handleUpdateStatus(order.id, "completed")}
            variant="primary"
            className="w-full py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center justify-center gap-2"
          >
            Order Received
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full p-4 md:p-6 lg:p-8 gap-6 md:gap-8 font-inter bg-transparent">
      {/* top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-3 md:p-5 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center gap-3 md:gap-4 transition-transform hover:-translate-y-0.5">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-text-primary font-bold text-lg md:text-2xl shadow-sm shrink-0">
            {pOrders.length}
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <p className="text-[9px] md:text-[11px] text-text-secondary font-bold uppercase tracking-widest mb-0.5 truncate">
              Pending
            </p>
            <p className="text-sm md:text-[19px] font-bold text-text-primary leading-none truncate">
              In Queue
            </p>
          </div>
        </div>

        <div className="bg-white p-3 md:p-5 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center gap-3 md:gap-4 transition-transform hover:-translate-y-0.5">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent font-bold text-lg md:text-2xl shadow-sm shrink-0">
            {prepOrders.length}
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <p className="text-[9px] md:text-[11px] text-brand-accent/80 font-bold uppercase tracking-widest mb-0.5 truncate">
              Preparing
            </p>
            <p className="text-sm md:text-[19px] font-bold text-text-primary leading-none truncate">
              Active
            </p>
          </div>
        </div>

        <div className="bg-white p-3 md:p-5 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center gap-3 md:gap-4 transition-transform hover:-translate-y-0.5">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-success-primary/10 border border-success-primary/20 flex items-center justify-center text-success-primary font-bold text-lg md:text-2xl shadow-sm shrink-0">
            {rOrders.length}
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <p className="text-[9px] md:text-[11px] text-success-primary/80 font-bold uppercase tracking-widest mb-0.5 truncate">
              Ready
            </p>
            <p className="text-sm md:text-[19px] font-bold text-text-primary leading-none truncate">
              Pickup
            </p>
          </div>
        </div>

        <div className="bg-white p-3 md:p-5 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center gap-3 md:gap-4 transition-transform hover:-translate-y-0.5">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary font-bold text-lg md:text-2xl shadow-sm shrink-0">
            {orders.filter((o) => o.status !== "completed").length}
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <p className="text-[9px] md:text-[11px] text-brand-dark/70 font-bold uppercase tracking-widest mb-0.5 truncate">
              Total
            </p>
            <p className="text-sm md:text-[19px] font-bold text-text-primary leading-none truncate">
              All Orders
            </p>
          </div>
        </div>
      </div>

      {/* main boards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">
        {/* pending column */}
        <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 mb-1 px-1">
            <div className="w-3 h-3 rounded-full bg-gray-400 shadow-sm"></div>
            <h2 className="text-lg font-bold text-text-primary">
              Pending Orders
            </h2>
            <span className="ml-auto bg-gray-50 border border-gray-200 text-text-secondary px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
              {pOrders.length}
            </span>
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto">
            {pOrders.length === 0 && (
              <div className="flex flex-col items-center gap-3 text-center p-7 rounded-[14px] bg-[#F1EFE8] border border-dashed border-[#B4B2A9]">
                <div className="w-12 h-12 rounded-xl bg-[#D3D1C7] flex items-center justify-center">
                  {/* inbox icon */}
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#5F5E5A"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16v10H4z" />
                    <path d="M4 14h4l2 3h4l2-3h4" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#444441]">
                  Queue is clear
                </p>
                <p className="text-xs text-[#5F5E5A] leading-relaxed max-w-[180px]">
                  New orders will appear here as they come in.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* preparing column */}
        <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 mb-1 px-1">
            <div className="w-3 h-3 rounded-full bg-brand-accent shadow-sm shadow-brand-accent/30"></div>
            <h2 className="text-lg font-bold text-text-primary">
              Preparing Now
            </h2>
            <span className="ml-auto bg-brand-accent/5 border border-brand-accent/20 text-brand-accent px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
              {prepOrders.length}
            </span>
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto">
            {prepOrders.map(renderOrderCard)}
            {prepOrders.length === 0 && (
              <div className="flex flex-col items-center gap-3 text-center p-7 rounded-[14px] bg-[#FAEEDA] border border-dashed border-[#FAC775]">
                <div className="w-12 h-12 rounded-xl bg-[#FAC775] flex items-center justify-center">
                  {/* chef hat icon */}
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#854F0B"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 19h12M8 19v-6h8v6M12 7a4 4 0 0 1 4 4H8a4 4 0 0 1 4-4z" />
                    <circle cx="12" cy="4" r="1.5" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#633806]">
                  Kithcen's idle
                </p>
                <p className="text-xs text-[#854F0B] leading-relaxed max-w-[180px]">
                  Start a pending order to move it here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ready column */}
        <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 mb-1 px-1">
            <div className="w-3 h-3 rounded-full bg-success-primary shadow-sm shadow-success-secondary"></div>
            <h2 className="text-lg font-bold text-text-primary">
              Ready for Pickup
            </h2>
            <span className="ml-auto bg-success-primary/5 border border-success-primary/20 text-success-primary px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
              {rOrders.length}
            </span>
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto">
            {rOrders.map(renderOrderCard)}
            {rOrders.length === 0 && (
              <div className="flex flex-col items-center gap-3 text-center p-7 rounded-[14px] bg-[#EAF3DE] border border-dashed border-[#C0DD97]">
                <div className="w-12 h-12 rounded-xl bg-[#C0DD97] flex items-center justify-center">
                  {/* check circle icon */}
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3B6D11"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="m8.5 12.5 2.5 2.5 4-5" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#27500A]">
                  All caught up
                </p>
                <p className="text-xs text-[#3B6D11] leading-relaxed max-w-[180px]">
                  Completed orders will appear here when ready.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
