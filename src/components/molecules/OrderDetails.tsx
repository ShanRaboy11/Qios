"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import {
  Clock,
  Package,
  DollarSign,
  Receipt,
  Check,
  Trash2,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";
import jsQR from "jsqr";
import { Button } from "@/components/atoms/Button";
import { Badge, BadgeColor } from "@/components/atoms/Badge";
import { Radio } from "@/components/atoms/Radio";
import { QuantityStepper } from "@/components/molecules/QuantityStepper";
import { updateOrderFromScanner } from "@/app/(employee)/[id]/employee/scanner/actions";
import { updateOrderPaymentStatus } from "@/app/(employee)/[id]/employee/queue/actions";

interface OrderItemModifier {
  id: string;
  modifier_options: {
    name: string;
    additional_price: number;
  };
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  customization_notes?: string;
  menu_items: MenuItem;
  order_item_modifiers: OrderItemModifier[];
}

interface OrderDetailsData {
  id: string;
  tenant_id?: string;
  table_number?: number;
  status: "pending" | "preparing" | "ready" | "cancelled" | "voided" | "served";
  total_price: number;
  payment_status: "unpaid" | "paid";
  payment_method?: "cash" | "gcash" | "card" | "other";
  created_at: string;
  updated_at: string;
  qr_hash?: string;
  order_items: OrderItem[];
}

interface OrderDetailsProps {
  order: OrderDetailsData;
  onClose: () => void;
  onUpdateOrder?: (order: OrderDetailsData) => void;
}

type PaymentMethod = "cash" | "gcash" | "card";

const statusConfig: Record<string, { label: string; badgeColor: BadgeColor }> =
  {
    pending: { label: "Pending", badgeColor: "warning" },
    preparing: { label: "Preparing", badgeColor: "accent" },
    ready: { label: "Ready", badgeColor: "success" },
    cancelled: { label: "Cancelled", badgeColor: "error" },
    voided: { label: "Voided", badgeColor: "error" },
    served: { label: "Served", badgeColor: "success" },
  };

const completionMessages: Record<string, string> = {
  served: "This order has already been served to the customer",
  cancelled: "This order was cancelled",
  voided: "This order has been voided",
};

export default function OrderDetails({
  order,
  onClose,
  onUpdateOrder,
}: OrderDetailsProps) {
  const [localOrder, setLocalOrder] = useState<OrderDetailsData>(order);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("cash");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState<
    "idle" | "requesting" | "scanning" | "processing" | "error"
  >("idle");
  const [authError, setAuthError] = useState("");
  const [pendingCancelOpen, setPendingCancelOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<"cancelled" | null>(null);
  const [scanAttempt, setScanAttempt] = useState(0);
  const authVideoRef = useRef<HTMLVideoElement>(null);
  const authCanvasRef = useRef<HTMLCanvasElement>(null);
  const authStreamRef = useRef<MediaStream | null>(null);
  const authFrameRef = useRef<number | null>(null);
  const authScanLockedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    // prevent background scrolling while the modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
      setMounted(false);
    };
  }, []);

  // sync state if order prop updates
  useEffect(() => {
    setLocalOrder(order);
  }, [order]);

  const statusInfo = statusConfig[localOrder.status] || {
    label: localOrder.status,
    badgeColor: "primary",
  };

  const formattedDate = new Date(localOrder.created_at).toLocaleString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const totalItems = localOrder.order_items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const calculateItemTotal = (item: OrderItem) => {
    const modifiersTotal = item.order_item_modifiers.reduce(
      (sum, mod) => sum + mod.modifier_options.additional_price,
      0,
    );
    return (item.unit_price + modifiersTotal) * item.quantity;
  };

  const calculateOrderTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const handleUpdateItems = (updatedItems: OrderItem[]) => {
    const newTotal = calculateOrderTotal(updatedItems);
    const updatedOrder = {
      ...localOrder,
      order_items: updatedItems,
      total_price: newTotal,
    };
    setLocalOrder(updatedOrder);
    onUpdateOrder?.(updatedOrder);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    const updatedItems = localOrder.order_items.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item,
    );
    handleUpdateItems(updatedItems);
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = localOrder.order_items.filter(
      (item) => item.id !== itemId,
    );
    handleUpdateItems(updatedItems);
  };

  const handleNotesChange = (itemId: string, notes: string) => {
    const updatedItems = localOrder.order_items.map((item) =>
      item.id === itemId ? { ...item, customization_notes: notes } : item,
    );
    const updatedOrder = {
      ...localOrder,
      order_items: updatedItems,
    };
    setLocalOrder(updatedOrder);
    onUpdateOrder?.(updatedOrder);
  };

  const handleProcessPayment = async () => {
    setPaymentProcessing(true);
    try {
      if (!localOrder.tenant_id) {
        throw new Error("Tenant ID is missing for this order.");
      }

      await updateOrderPaymentStatus(
        localOrder.id,
        localOrder.tenant_id,
        "paid",
        selectedPaymentMethod,
      );

      setPaymentCompleted(true);

      const updatedOrder: OrderDetailsData = {
        ...localOrder,
        payment_status: "paid",
        payment_method: selectedPaymentMethod,
      };
      setLocalOrder(updatedOrder);
      onUpdateOrder?.(updatedOrder);
    } catch (error) {
      console.error("Failed to process payment:", error);
      setAuthError(
        error instanceof Error
          ? error.message
          : "Unable to process this payment.",
      );
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleConfirmAndQueue = () => {
    onClose();
  };

  const isOrderCompleted = ["served", "cancelled", "voided"].includes(
    localOrder.status,
  );

  const isEditable =
    localOrder.payment_status === "unpaid" &&
    !isOrderCompleted &&
    !paymentCompleted &&
    !paymentProcessing;

  const displayOrderCode =
    localOrder.qr_hash?.trim() || localOrder.id.substring(0, 8).toUpperCase();
  const adminQrValue = localOrder.tenant_id
    ? `ADMIN_AUTH:${localOrder.tenant_id}`
    : "";

  const stopAuthScanner = () => {
    if (authFrameRef.current !== null) {
      cancelAnimationFrame(authFrameRef.current);
      authFrameRef.current = null;
    }
    if (authStreamRef.current) {
      authStreamRef.current.getTracks().forEach((track) => track.stop());
      authStreamRef.current = null;
    }
    if (authVideoRef.current) {
      authVideoRef.current.srcObject = null;
    }
  };

  const closeAuthModal = () => {
    stopAuthScanner();
    authScanLockedRef.current = false;
    setAuthModalOpen(false);
    setAuthStatus("idle");
    setAuthError("");
    setPendingStatus(null);
  };

  useEffect(() => {
    if (!authModalOpen || !pendingStatus) return;

    let cancelled = false;
    const expectedValue = adminQrValue;

    const start = async () => {
      try {
        setAuthStatus("requesting");
        setAuthError("");
        authScanLockedRef.current = false;
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        authStreamRef.current = stream;
        if (authVideoRef.current) {
          authVideoRef.current.srcObject = stream;
          await authVideoRef.current.play();
        }

        const scan = () => {
          const video = authVideoRef.current;
          const canvas = authCanvasRef.current;
          if (
            !video ||
            !canvas ||
            video.readyState !== video.HAVE_ENOUGH_DATA
          ) {
            authFrameRef.current = requestAnimationFrame(scan);
            return;
          }

          const width = video.videoWidth;
          const height = video.videoHeight;
          const context = canvas.getContext("2d");
          if (!context || !width || !height) {
            authFrameRef.current = requestAnimationFrame(scan);
            return;
          }

          canvas.width = width;
          canvas.height = height;
          context.drawImage(video, 0, 0, width, height);
          const imageData = context.getImageData(0, 0, width, height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (authScanLockedRef.current) {
            return;
          }

          if (code?.data?.trim() === expectedValue) {
            authScanLockedRef.current = true;
            setAuthStatus("processing");
            stopAuthScanner();
            (async () => {
              if (!localOrder.tenant_id || !pendingStatus) return;
              await updateOrderFromScanner(
                localOrder.tenant_id,
                localOrder.id,
                pendingStatus,
                `Order ${pendingStatus} after admin QR verification`,
              );
              const updatedOrder = { ...localOrder, status: pendingStatus };
              setLocalOrder(updatedOrder);
              onUpdateOrder?.(updatedOrder);
              closeAuthModal();
            })().catch((error) => {
              authScanLockedRef.current = false;
              setAuthStatus("error");
              setAuthError(
                error instanceof Error
                  ? error.message
                  : "Unable to update this order.",
              );
            });
            return;
          }

          authFrameRef.current = requestAnimationFrame(scan);
        };

        setAuthStatus("scanning");
        authFrameRef.current = requestAnimationFrame(scan);
      } catch (error) {
        setAuthStatus("error");
        setAuthError(
          error instanceof DOMException && error.name === "NotAllowedError"
            ? "Camera access denied. Please allow camera permissions and try again."
            : "Unable to start the admin QR scanner.",
        );
      }
    };

    start();

    return () => {
      cancelled = true;
      stopAuthScanner();
    };
  }, [
    authModalOpen,
    adminQrValue,
    localOrder,
    pendingStatus,
    onUpdateOrder,
    scanAttempt,
  ]);

  const openAdminAuthModal = () => {
    if (!localOrder.tenant_id) {
      setAuthError("Tenant ID is missing for this order.");
      setAuthModalOpen(true);
      return;
    }

    setPendingStatus("cancelled");
    setAuthError("");
    setAuthStatus("idle");
    setAuthModalOpen(true);
    setScanAttempt((previous) => previous + 1);
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
      {/* outer Card: Now cleanly sets structural limits using flex-col without scroll bars */}
      <div className="bg-bg-primary rounded-[32px] border border-brand-primary/20 shadow-[0_24px_64px_rgba(255,198,112,0.15)] max-w-2xl w-full max-h-[90vh] font-inter flex flex-col overflow-hidden">
        {/* header: Fixed at top */}
        <div className="bg-white border-b border-brand-primary/10 p-6 flex items-start justify-between z-10 rounded-t-[32px] shrink-0">
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-3 mb-1.5">
              <span className="font-figtree text-2xl font-bold text-text-primary">
                Order #{displayOrderCode}
              </span>
              <div className="flex gap-2">
                <Badge
                  color={statusInfo.badgeColor}
                  variant="subtle"
                  shape="rounded"
                  className="font-bold tracking-wide uppercase px-2.5 py-0.5 b5"
                >
                  {statusInfo.label}
                </Badge>
                <Badge
                  color={
                    localOrder.payment_status === "paid" ? "success" : "warning"
                  }
                  variant="outline"
                  shape="rounded"
                  className="font-bold tracking-wide uppercase px-2.5 py-0.5 b5"
                >
                  {localOrder.payment_status}
                </Badge>
              </div>
            </div>
            <p className="text-text-secondary b4 font-medium">
              {formattedDate}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            shape="rounded"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary -mt-1 -mr-1"
            aria-label="Close"
          >
            <X size={18} />
          </Button>
        </div>

        {/* scrollable Container Container: Isolate scrollable content entirely here */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden style-scrollbar">
          {/* info Grid Cards */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/50 border-b border-brand-primary/10">
            <div className="bg-white border border-brand-primary/15 rounded-[20px] p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-9 h-9 bg-brand-primary/10 rounded-full flex items-center justify-center mb-2">
                <Package size={18} className="text-brand-primary" />
              </div>
              <p className="b5 text-text-secondary font-semibold uppercase tracking-wider mb-0.5">
                Total Items
              </p>
              <p className="text-xl font-bold text-text-primary font-figtree">
                {totalItems}
              </p>
            </div>

            <div className="bg-white border border-brand-primary/15 rounded-[20px] p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-9 h-9 bg-brand-accent/10 rounded-full flex items-center justify-center mb-2">
                <Clock size={18} className="text-brand-accent" />
              </div>
              <p className="b5 text-text-secondary font-semibold uppercase tracking-wider mb-0.5">
                Status
              </p>
              <p className="text-base font-bold text-brand-accent font-figtree capitalize">
                {localOrder.status}
              </p>
            </div>

            {localOrder.table_number && (
              <div className="bg-white border border-brand-primary/15 rounded-[20px] p-4 flex flex-col items-center justify-center text-center shadow-sm sm:col-span-3">
                <div className="w-9 h-9 bg-success-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Receipt size={18} className="text-success-primary" />
                </div>
                <p className="b5 text-text-secondary font-semibold uppercase tracking-wider mb-0.5">
                  Table
                </p>
                <p className="text-xl font-bold text-text-primary font-figtree">
                  #{localOrder.table_number}
                </p>
              </div>
            )}

            <div className="bg-white border border-brand-primary/15 rounded-[20px] p-4 flex flex-col items-center justify-center text-center shadow-sm col-span-1">
              <div className="w-9 h-9 bg-[#3B82F6]/10 rounded-full flex items-center justify-center mb-2">
                <DollarSign size={18} className="text-[#3B82F6]" />
              </div>
              <p className="b5 text-text-secondary font-semibold uppercase tracking-wider mb-0.5">
                Grand Total
              </p>
              <p className="text-xl font-bold text-[#3B82F6] font-figtree">
                ₱{localOrder.total_price.toFixed(2)}
              </p>
            </div>
          </div>

          {/* order Items Section */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-figtree font-bold text-xl text-text-primary">
                Order Items
              </h3>
              {isEditable && (
                <Badge
                  color="accent"
                  variant="subtle"
                  shape="pill"
                  className="font-semibold b4"
                >
                  Cashier Edit Mode Active
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              {localOrder.order_items.length === 0 ? (
                <div className="text-center py-10 bg-white border border-brand-primary/10 rounded-[24px]">
                  <Package
                    size={36}
                    className="mx-auto text-text-secondary/35 mb-2.5"
                  />
                  <p className="b2 font-medium text-text-secondary">
                    No items in this order.
                  </p>
                </div>
              ) : (
                localOrder.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col bg-white rounded-[24px] border border-brand-primary/10 p-5 shadow-sm transition-all hover:border-brand-primary/20"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-figtree font-bold text-[17px] text-text-primary">
                            {item.menu_items.name}
                          </span>
                          {!isEditable && (
                            <Badge
                              color="primary"
                              variant="subtle"
                              shape="rounded"
                              className="font-bold px-2 py-0.5 b5"
                            >
                              ×{item.quantity}
                            </Badge>
                          )}
                        </div>

                        {item.menu_items.description && (
                          <p className="text-xs text-text-secondary mb-2 line-clamp-2 font-inter">
                            {item.menu_items.description}
                          </p>
                        )}

                        {/* modifiers List */}
                        {item.order_item_modifiers.length > 0 && (
                          <div className="text-xs text-text-secondary space-y-1.5 mt-2 bg-bg-primary/45 p-2.5 rounded-[12px] border border-brand-primary/5">
                            {item.order_item_modifiers.map((mod) => (
                              <p
                                key={mod.id}
                                className="flex items-center gap-1 font-medium font-inter"
                              >
                                <span className="text-brand-accent">+</span>
                                {mod.modifier_options.name}
                                {mod.modifier_options.additional_price > 0 && (
                                  <span className="text-text-secondary/75 font-normal">
                                    (+₱
                                    {mod.modifier_options.additional_price.toFixed(
                                      2,
                                    )}
                                    )
                                  </span>
                                )}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2 ml-4">
                        <p className="font-bold text-text-primary text-[17px] font-figtree whitespace-nowrap">
                          ₱{calculateItemTotal(item).toFixed(2)}
                        </p>
                        {isEditable && (
                          <Button
                            variant="warning"
                            size="icon"
                            shape="rounded"
                            onClick={() => handleRemoveItem(item.id)}
                            className="hover:bg-warning-primary/20 text-warning-primary border-none shadow-none p-1.5"
                            title="Remove item"
                          >
                            <Trash2 size={15} />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* editable Fields for Cashier */}
                    {isEditable ? (
                      <div className="mt-4 pt-4 border-t border-brand-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="b4 text-text-secondary font-semibold uppercase tracking-wider">
                            Quantity:
                          </span>
                          <QuantityStepper
                            initialValue={item.quantity}
                            minValue={1}
                            onChange={(val) =>
                              handleQuantityChange(item.id, val)
                            }
                          />
                        </div>

                        <div className="flex-1 max-w-md w-full">
                          <input
                            type="text"
                            value={item.customization_notes || ""}
                            onChange={(e) =>
                              handleNotesChange(item.id, e.target.value)
                            }
                            placeholder="Add custom notes..."
                            className="w-full px-4 py-2 bg-bg-primary/55 border border-brand-primary/20 rounded-[14px] b4 font-medium text-text-primary focus:outline-none focus:border-brand-accent transition-all placeholder:text-text-secondary/40 font-inter"
                          />
                        </div>
                      </div>
                    ) : (
                      item.customization_notes && (
                        <div className="mt-3 pt-2.5 border-t border-brand-primary/5">
                          <p className="text-xs text-brand-accent italic font-semibold font-inter flex items-center gap-1.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                            Note: {item.customization_notes}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* pricing Subtotal Area */}
          <div className="p-6 bg-white border-t border-brand-primary/10">
            <div className="space-y-3 font-inter">
              <div className="flex justify-between items-center b2 font-medium">
                <span className="text-text-secondary">Subtotal</span>
                <span className="font-semibold text-text-primary">
                  ₱{localOrder.total_price.toFixed(2)}
                </span>
              </div>
              {localOrder.payment_method && (
                <div className="flex justify-between items-center pt-3 border-t border-brand-primary/5 b2 font-medium">
                  <span className="text-text-secondary">Payment Method</span>
                  <span className="text-text-primary capitalize font-semibold">
                    {localOrder.payment_method}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-brand-primary/10">
                <span className="text-text-primary font-bold text-lg font-figtree">
                  Total
                </span>
                <span className="text-2xl font-extrabold text-[#3B82F6] font-figtree">
                  ₱{localOrder.total_price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* finalized Status Alert */}
          {isOrderCompleted && (
            <div className="p-6 border-t border-brand-primary/10 bg-white/40">
              <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-[20px] p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-brand-accent/15 flex-shrink-0">
                  <AlertCircle size={20} className="text-brand-accent" />
                </div>
                <div>
                  <p className="font-figtree font-bold text-text-primary text-[17px] capitalize">
                    Order {localOrder.status}
                  </p>
                  <p className="b4 text-text-secondary mt-1 font-inter">
                    {completionMessages[localOrder.status] ||
                      "This order has been completed."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* payment Select Section for cashier */}
          {!paymentCompleted && !isOrderCompleted && (
            <div className="p-6 border-t border-brand-primary/10 bg-white">
              <h3 className="font-figtree font-bold text-[18px] text-text-primary mb-4">
                Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center p-4 border border-brand-primary/20 rounded-[18px] cursor-pointer hover:bg-brand-primary/5 transition-all">
                  <Radio
                    name="payment"
                    value="cash"
                    checked={selectedPaymentMethod === "cash"}
                    onChange={(e) =>
                      setSelectedPaymentMethod(e.target.value as PaymentMethod)
                    }
                    label="Cash Payment"
                    variant="primary"
                  />
                </label>

                <div className="flex items-center p-4 border border-brand-primary/10 rounded-[18px] opacity-45 cursor-not-allowed">
                  <Radio
                    name="payment"
                    value="gcash"
                    disabled
                    label="GCash (Soon)"
                  />
                </div>

                <div className="flex items-center p-4 border border-brand-primary/10 rounded-[18px] opacity-45 cursor-not-allowed">
                  <Radio
                    name="payment"
                    value="card"
                    disabled
                    label="Card (Soon)"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* actions Footer: Fixed at bottom */}
        <div className="p-6 border-t border-brand-primary/10 bg-white rounded-b-[32px] shrink-0">
          {isOrderCompleted ? (
            <Button
              onClick={onClose}
              variant="dark"
              shape="pill"
              className="w-full h-[52px] font-figtree font-bold"
            >
              Close
            </Button>
          ) : !paymentCompleted ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <Button
                  type="button"
                  onClick={() => setPendingCancelOpen(true)}
                  variant="outline"
                  shape="pill"
                  className="h-[48px] font-bold border-red-200 text-red-600 hover:bg-red-50"
                  disabled={!localOrder.tenant_id}
                >
                  Cancel Order
                </Button>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  variant="ghost"
                  shape="pill"
                  className="flex-1 h-[52px] font-bold"
                >
                  Close
                </Button>
                <Button
                  onClick={handleProcessPayment}
                  disabled={localOrder.order_items.length === 0}
                  loading={paymentProcessing}
                  variant="accent"
                  shape="pill"
                  className="flex-1 h-[52px] font-figtree font-bold"
                >
                  Process Payment
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-success-secondary/40 border border-success-primary/25 rounded-[24px] p-6 flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-success-primary/15 rounded-full flex items-center justify-center">
                  <Check size={28} className="text-success-primary" />
                </div>
                <div className="text-center">
                  <p className="font-figtree text-xl font-bold text-success-primary mb-1">
                    Payment Confirmed!
                  </p>
                  <p className="text-sm text-text-secondary font-inter">
                    ₱{localOrder.total_price.toFixed(2)} paid via{" "}
                    {selectedPaymentMethod.toUpperCase()}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleConfirmAndQueue}
                variant="approve"
                shape="pill"
                className="w-full h-[56px] text-lg font-bold font-figtree"
                leftIcon={<Check size={20} />}
              >
                Confirm & Send to Queue
              </Button>
            </div>
          )}
        </div>
      </div>

      {authModalOpen && (
        <div className="fixed inset-0 z-[90] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[28px] overflow-hidden shadow-2xl border border-black/5">
            <div className="p-5 border-b border-black/5 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-text-secondary font-bold">
                  Admin authorization
                </p>
                <h3 className="text-xl font-bold text-text-primary mt-1">
                  Scan tenant admin QR
                </h3>
              </div>
              <button
                type="button"
                onClick={closeAuthModal}
                className="w-9 h-9 rounded-full bg-gray-100 text-text-secondary flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="relative rounded-[20px] overflow-hidden border border-brand-primary/15 bg-black min-h-[280px]">
                <video
                  ref={authVideoRef}
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <canvas ref={authCanvasRef} className="hidden" />
                {authStatus === "processing" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 text-white gap-3 px-6 text-center">
                    <Loader2 size={34} className="animate-spin" />
                    <p className="text-sm font-medium">
                      QR captured. Processing cancellation...
                    </p>
                  </div>
                )}
                {authStatus === "scanning" && (
                  <div
                    className="absolute left-4 right-4 h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#FF5269] to-transparent shadow-[0_0_18px_rgba(255,82,105,0.65)] pointer-events-none"
                    style={{
                      animation:
                        "adminQrScanDown 2.8s cubic-bezier(0.4,0,0.6,1) infinite",
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>

              <p className="text-sm text-text-secondary">
                Use the tenant admin QR from Profile Settings to authorize this
                action.
              </p>

              {authError && (
                <p className="text-sm text-red-600 font-medium">{authError}</p>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  shape="rounded"
                  className="flex-1 h-12 font-bold"
                  onClick={closeAuthModal}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="accent"
                  shape="rounded"
                  className="flex-1 h-12 font-bold"
                  onClick={() => {
                    setAuthError("");
                    setAuthStatus("idle");
                    setScanAttempt((previous) => previous + 1);
                  }}
                >
                  Retry Scan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {pendingCancelOpen && (
        <div className="fixed inset-0 z-[85] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-[24px] p-6 shadow-2xl border border-black/5">
            <h3 className="text-lg font-extrabold text-text-primary mb-2">
              Cancel Order?
            </h3>
            <p className="text-sm text-text-secondary mb-5">
              You will need to scan the tenant admin QR before this action can
              be completed.
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                shape="rounded"
                className="flex-1 h-11 font-bold"
                onClick={() => setPendingCancelOpen(false)}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="accent"
                shape="rounded"
                className="flex-1 h-11 font-bold"
                onClick={() => {
                  setPendingCancelOpen(false);
                  openAdminAuthModal();
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes adminQrScanDown {
          0% { top: 12px; opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { top: calc(100% - 12px); opacity: 0; }
        }
      `}</style>
    </div>,
    document.body,
  );
}
