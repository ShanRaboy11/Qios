"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { StepperBar } from "@/components/molecules/StepperBar";
import {
  Receipt,
  ChefHat,
  ShoppingBag,
  CheckCircle,
  BellRing,
  ChevronUp,
  ChevronDown,
  Clock,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { useCart } from "@/contexts/CartContext";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const STEPS = [
  { id: 0, label: "Pending Payment", icon: <Receipt size={18} /> },
  { id: 1, label: "Placed", icon: <Receipt size={18} /> },
  { id: 2, label: "Kitchen", icon: <ChefHat size={18} /> },
  { id: 3, label: "Ready", icon: <ShoppingBag size={18} /> },
  { id: 4, label: "Done", icon: <CheckCircle size={18} /> },
];

type OrderStatusRow = {
  id: string;
  qr_hash: string | null;
  tenant_id: string;
  status: "pending" | "preparing" | "ready" | "served" | "cancelled";
  payment_status: "unpaid" | "paid";
  total_price: number;
};

function mapOrderToStep(
  status: OrderStatusRow["status"],
  paymentStatus: OrderStatusRow["payment_status"],
) {
  if (status === "cancelled") return 4;
  if (status === "served") return 4;
  if (status === "ready") return 3;
  if (status === "preparing") return 2;
  if (status === "pending" && paymentStatus === "paid") return 1;
  return 0;
}

function mapOrderToLabel(
  status: OrderStatusRow["status"],
  paymentStatus: OrderStatusRow["payment_status"],
) {
  if (status === "cancelled") return "Cancelled";
  if (status === "served") return "Completed";
  if (status === "ready") return "Ready for Pickup";
  if (status === "preparing") return "Preparing";
  if (status === "pending" && paymentStatus === "paid") return "Placed";
  return "Pending Payment";
}

export const FloatingOrderStatus = ({ tenantId }: { tenantId: string }) => {
  const {
    isOrderPlaced,
    setIsOrderPlaced,
    activeOrder,
    setActiveOrder,
    clearActiveOrder,
    currency,
  } = useCart();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReadyNotified, setIsReadyNotified] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const storageKey = `qios:active-order:${tenantId}`;

  const upsertTrackedOrder = useCallback(
    (row: OrderStatusRow) => {
      const nextOrder = {
        orderId: row.id,
        qrHash: row.qr_hash ?? activeOrder?.qrHash ?? row.id,
        tenantId: row.tenant_id,
        status: row.status,
        paymentStatus: row.payment_status,
        totalPrice: Number(row.total_price || 0),
      };

      setActiveOrder(nextOrder);
      setIsOrderPlaced(true);

      try {
        localStorage.setItem(storageKey, JSON.stringify(nextOrder));
      } catch {
        // Storage failure should not block the live order status widget.
      }
    },
    [activeOrder?.qrHash, setActiveOrder, setIsOrderPlaced, storageKey],
  );

  const fetchOrder = useCallback(async () => {
    if (!activeOrder?.orderId || !supabase) return;

    const { data, error } = await supabase
      .from("orders")
      .select("id, qr_hash, tenant_id, status, payment_status, total_price")
      .eq("id", activeOrder.orderId)
      .eq("tenant_id", tenantId)
      .maybeSingle();

    if (error || !data) {
      return;
    }

    upsertTrackedOrder(data as OrderStatusRow);
  }, [activeOrder?.orderId, supabase, tenantId, upsertTrackedOrder]);

  useEffect(() => {
    if (activeOrder) {
      setIsVisible(true);
      setIsOrderPlaced(true);
      return;
    }

    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;

      const saved = JSON.parse(raw) as {
        orderId?: string;
        qrHash?: string;
        tenantId?: string;
        status?: "pending" | "preparing" | "ready" | "served" | "cancelled";
        paymentStatus?: "unpaid" | "paid";
        totalPrice?: number;
      };

      if (!saved.orderId || saved.tenantId !== tenantId) {
        return;
      }

      setActiveOrder({
        orderId: saved.orderId,
        qrHash: saved.qrHash || saved.orderId,
        tenantId,
        status: saved.status || "pending",
        paymentStatus: saved.paymentStatus || "unpaid",
        totalPrice: Number(saved.totalPrice || 0),
      });
      setIsOrderPlaced(true);
    } catch {
      // Ignore malformed saved payloads and continue without a restored order.
    }
  }, [activeOrder, setActiveOrder, setIsOrderPlaced, storageKey, tenantId]);

  useEffect(() => {
    if (!activeOrder?.orderId || !supabase) return;

    fetchOrder();

    const channel = supabase
      .channel(`customer_order_${activeOrder.orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${activeOrder.orderId}`,
        },
        (payload: { new: Record<string, unknown> }) => {
          upsertTrackedOrder(payload.new as OrderStatusRow);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${activeOrder.orderId}`,
        },
        () => {
          clearActiveOrder();
          try {
            localStorage.removeItem(storageKey);
          } catch {
            // no-op
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    activeOrder?.orderId,
    clearActiveOrder,
    fetchOrder,
    storageKey,
    supabase,
    upsertTrackedOrder,
  ]);

  const currentStep = activeOrder
    ? mapOrderToStep(activeOrder.status, activeOrder.paymentStatus)
    : 0;
  const currentLabel = activeOrder
    ? mapOrderToLabel(activeOrder.status, activeOrder.paymentStatus)
    : "Processing";
  const progress = (currentStep / (STEPS.length - 1)) * 100;
  const isCancelled = activeOrder?.status === "cancelled";
  const isDone = activeOrder?.status === "served";

  useEffect(() => {
    if (currentStep === 3) {
      setIsReadyNotified(true);
      if (!isExpanded) setIsExpanded(true); // Auto expand when ready!
      if (
        typeof window !== "undefined" &&
        window.navigator &&
        window.navigator.vibrate
      ) {
        window.navigator.vibrate([200, 100, 200]);
      }
    } else {
      setIsReadyNotified(false);
    }
  }, [currentStep, isExpanded]);

  if ((!isOrderPlaced && !activeOrder) || !isVisible || !activeOrder)
    return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[100] px-4 pointer-events-none flex justify-center">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // COLLAPSED PILL STATE
          <motion.div
            key="collapsed"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsExpanded(true)}
            className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full px-5 py-3 flex items-center gap-4 cursor-pointer relative overflow-hidden max-w-sm w-full"
          >
            {/* Progress Bar background in pill */}
            <div
              className="absolute bottom-0 left-0 h-1 bg-brand-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />

            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-inner",
                isCancelled
                  ? "bg-gray-500"
                  : currentStep === 3
                    ? "bg-brand-accent animate-pulse"
                    : "bg-brand-primary",
              )}
            >
              {isCancelled ? (
                <X size={20} />
              ) : currentStep === 3 ? (
                <BellRing size={20} />
              ) : (
                <ChefHat size={20} />
              )}
            </div>

            <div className="flex flex-col flex-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                Active Order
              </span>
              <span className="text-sm font-black text-text-primary truncate">
                {isCancelled
                  ? "Order Cancelled"
                  : currentStep === 3
                    ? "Order is Ready!"
                    : `Status: ${currentLabel}`}
              </span>
            </div>

            <ChevronUp size={20} className="text-gray-400" />
          </motion.div>
        ) : (
          // EXPANDED CARD STATE
          <motion.div
            key="expanded"
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            className="pointer-events-auto w-full max-w-md bg-white rounded-[32px] shadow-[0_20px_40px_rgb(0,0,0,0.15)] border border-gray-100 overflow-hidden font-brand-secondary"
          >
            {/* Header: Order & Total (Requested by User) */}
            <div className="bg-bg-primary p-6 pb-5 relative">
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 shadow-sm"
              >
                <ChevronDown size={20} />
              </button>

              <div className="flex items-end justify-between pr-8 mb-4 font-brand-secondary">
                <div>
                  <span className="text-xs font-brand font-bold text-gray-500 uppercase tracking-widest mb-1 block">
                    Order Details
                  </span>
                  <h2 className="text-2xl font-brand font-black text-text-primary">
                    #{activeOrder.qrHash}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs font-brand font-bold text-gray-500 uppercase tracking-widest mb-1 block">
                    Order Total
                  </span>
                  <span className="text-2xl font-brand font-black text-brand-accent">
                    {currency} {Number(activeOrder.totalPrice || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Status Content */}
            <div className="p-6 bg-white relative">
              <AnimatePresence mode="wait">
                {isCancelled ? (
                  <div className="bg-gray-100 rounded-3xl p-6 text-center text-gray-700">
                    <h3 className="text-2xl font-brand font-black mb-1">
                      Order Cancelled
                    </h3>
                    <p className="text-sm font-brand-secondary">
                      Please approach the counter if you need assistance.
                    </p>
                  </div>
                ) : isReadyNotified ? (
                  // Ready Notification State
                  <motion.div
                    key="ready"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-brand-accent rounded-3xl p-6 text-center text-white shadow-lg relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      animate={{ scale: [1, 1.1, 1], opacity: [0, 0.4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <motion.div
                      animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="inline-flex w-16 h-16 rounded-full bg-white/20 items-center justify-center mb-3"
                    >
                      <ShoppingBag size={32} />
                    </motion.div>
                    <h3 className="text-2xl font-brand font-black mb-1">
                      It's Ready!
                    </h3>
                    <p className="text-white/90 text-sm font-brand-secondary">
                      Please present your receipt at the counter.
                    </p>
                  </motion.div>
                ) : (
                  // Horizontal StepperBar State
                  <motion.div
                    key="stepper"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-2 font-brand-secondary"
                  >
                    <div className="flex items-center gap-2 mb-6 text-brand-accent bg-brand-accent/10 w-fit px-3 py-1 rounded-full text-xs font-brand-secondary font-bold">
                      <Clock size={14} />
                      Est. Time: 12 min
                    </div>

                    {/* Cashier notice — shown while order is unpaid/pending */}
                    {currentStep === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-bold text-amber-800">
                            Please proceed to the cashier
                          </p>
                          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                            Show this receipt to the cashier to pay and confirm
                            your order. Your food will be prepared once payment
                            is received.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Horizontal StepperBar wrapper to handle overflow cleanly on mobile */}
                    <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
                      <div className="min-w-[300px]">
                        <StepperBar
                          steps={STEPS}
                          currentStep={currentStep}
                          orientation="horizontal"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {(currentStep === 4 || isDone || isCancelled) && (
                <button
                  onClick={() => {
                    setIsVisible(false);
                    clearActiveOrder();
                    try {
                      localStorage.removeItem(storageKey);
                    } catch {
                      // no-op
                    }
                  }}
                  className="w-full mt-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl"
                >
                  Dismiss
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
