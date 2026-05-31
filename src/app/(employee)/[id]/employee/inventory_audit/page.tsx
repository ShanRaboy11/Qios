"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FileText,
  TrendingDown,
  TrendingUp,
  Minus,
  Plus,
  CheckCircle2,
  X,
  AlertCircle,
  Check,
  RotateCcw,
  Search,
  Sparkles,
  ClipboardCheck,
  Save,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import {
  useInventoryManagement,
  InventoryItem,
} from "@/hooks/useInventoryManagement";

// ─── SKELETON SHIMMER LOADING COMPONENT ───
function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn("skeleton-shimmer rounded-xl bg-gray-200/50", className)}
    />
  );
}

function AuditPageSkeleton() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-black/5">
        <div className="space-y-3">
          <ShimmerBlock className="h-9 w-64" />
          <ShimmerBlock className="h-4 w-96 max-w-full" />
        </div>
        <ShimmerBlock className="h-16 w-64 rounded-2xl" />
      </div>

      {/* Progress & Search skeleton */}
      <div className="space-y-4">
        <ShimmerBlock className="h-11 w-full rounded-2xl" />
        <div className="flex items-center gap-4">
          <ShimmerBlock className="h-12 flex-grow rounded-2xl" />
          <ShimmerBlock className="h-12 w-28 rounded-2xl" />
        </div>
      </div>

      {/* Item sections skeleton */}
      <div className="space-y-8">
        {Array.from({ length: 2 }).map((_, secIdx) => (
          <div key={secIdx} className="space-y-4">
            <div className="flex items-center gap-4">
              <ShimmerBlock className="h-6 w-48" />
              <div className="flex-1 h-px bg-black/5" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, rowIdx) => (
                <div
                  key={rowIdx}
                  className="bg-white rounded-3xl border border-black/5 p-5 flex flex-col lg:flex-row lg:items-center gap-4 shadow-sm"
                >
                  <div className="flex-1 space-y-2">
                    <ShimmerBlock className="h-5 w-40" />
                    <ShimmerBlock className="h-4 w-24" />
                  </div>
                  <div className="flex items-center gap-8 justify-between lg:justify-end flex-grow">
                    <ShimmerBlock className="h-8 w-20" />
                    <ShimmerBlock className="h-10 w-32 rounded-xl" />
                    <ShimmerBlock className="h-8 w-24 rounded-lg" />
                    <ShimmerBlock className="h-10 w-10 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───
export default function InventoryAuditPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params?.id as string;
  const supabase = createSupabaseBrowserClient();

  // Load live data from the inventory management custom hook
  const { items, isLoading, actionError, saveItem } = useInventoryManagement();

  // UI State
  const [physicalCounts, setPhysicalCounts] = useState<{
    [key: string]: string;
  }>({});
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Modals state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Audit actor details
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    role: string;
  } | null>(null);

  // Fetch logged in profile details for the audit log trail
  useEffect(() => {
    let isMounted = true;
    const loadUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user && isMounted) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, full_name, role")
            .eq("id", user.id)
            .maybeSingle();

          if (isMounted) {
            setCurrentUser({
              id: user.id,
              name: profile?.full_name || user.email || "Employee",
              role: profile?.role || "employee",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load user for stock audit trail:", err);
      }
    };
    void loadUser();
    return () => {
      isMounted = false;
    };
  }, [supabase]);

  // Input value formatting and handlers
  const handleCountChange = (id: string, val: string) => {
    // Only allow positive integers or decimals
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setPhysicalCounts((prev) => ({ ...prev, [id]: val }));
    }
  };

  const handleAdjustCount = (item: InventoryItem, delta: number) => {
    const currentVal = parseFloat(physicalCounts[item.id] || "0");
    let nextVal = Math.max(0, currentVal + delta);

    // For unit-based goods, keep counts as whole numbers
    if (item.inventory_mode === "unit") {
      nextVal = Math.round(nextVal);
    } else {
      // For measurement based, allow round decimals
      nextVal = Math.round(nextVal * 100) / 100;
    }

    setPhysicalCounts((prev) => ({ ...prev, [item.id]: nextVal.toString() }));
  };

  const handleQuickMatch = (item: InventoryItem) => {
    setPhysicalCounts((prev) => ({
      ...prev,
      [item.id]: item.current_stock.toString(),
    }));
  };

  const getVariance = (item: InventoryItem) => {
    const input = physicalCounts[item.id];
    if (input === undefined || input === "") {
      return { value: 0, status: "pending" as const };
    }
    const physical = parseFloat(input);
    const diff = physical - item.current_stock;
    if (diff > 0) return { value: diff, status: "increase" as const };
    if (diff < 0) return { value: Math.abs(diff), status: "decrease" as const };
    return { value: 0, status: "match" as const };
  };

  // Memoized lists and states
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [items, searchQuery]);

  const groupedItems = useMemo(() => {
    const measurement: InventoryItem[] = [];
    const unit: InventoryItem[] = [];

    filteredItems.forEach((item) => {
      if (item.inventory_mode === "measurement") {
        measurement.push(item);
      } else {
        unit.push(item);
      }
    });

    return { measurement, unit };
  }, [filteredItems]);

  const stats = useMemo(() => {
    const total = items.length;
    const audited = Object.keys(physicalCounts).filter(
      (id) => physicalCounts[id] !== "",
    ).length;
    const remaining = total - audited;
    const progressPercent = total > 0 ? Math.round((audited / total) * 100) : 0;

    return { total, audited, remaining, progressPercent };
  }, [items, physicalCounts]);

  const discrepancies = useMemo(() => {
    const list: Array<{
      item: InventoryItem;
      variance: number;
      notes?: string;
    }> = [];
    items.forEach((item) => {
      const input = physicalCounts[item.id];
      if (input !== undefined && input !== "") {
        const physical = parseFloat(input);
        const diff = physical - item.current_stock;
        if (diff !== 0) {
          list.push({
            item,
            variance: diff,
            notes: notes[item.id] || undefined,
          });
        }
      }
    });
    return list;
  }, [items, physicalCounts, notes]);

  // Submit action to update DB and insert logs
  const handleSubmitAudit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const itemsToUpdate = items.filter(
        (item) =>
          physicalCounts[item.id] !== undefined &&
          physicalCounts[item.id] !== "",
      );

      // Perform saving in parallel
      const updatePromises = itemsToUpdate.map(async (item) => {
        const physicalQty = parseFloat(physicalCounts[item.id]);
        const theoreticalQty = item.current_stock;
        const varianceVal = physicalQty - theoreticalQty;

        // 1. Update the current_stock in inventory_items
        const { item: saved, error } = await saveItem(
          { id: item.id, current_stock: physicalQty },
          false,
        );

        if (error || !saved) {
          throw new Error(error || `Failed to update stock for ${item.name}`);
        }

        // 2. Insert record into stock_audits
        const { error: auditError } = await supabase
          .from("stock_audits")
          .insert({
            tenant_id: tenantId,
            inventory_item_id: item.id,
            theoretical_qty: theoreticalQty,
            physical_qty: physicalQty,
            variance: varianceVal,
            recorded_by: currentUser?.id || null,
          });

        if (auditError) {
          console.error(
            `Failed to create stock audit trail for ${item.name}:`,
            auditError.message,
          );
        }
      });

      await Promise.all(updatePromises);

      // Success behavior
      setIsConfirmOpen(false);
      setIsSuccessOpen(true);
    } catch (err: any) {
      console.error("Error submitting inventory audit:", err);
      setSubmitError(
        err?.message || "An unexpected error occurred during submission.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setPhysicalCounts({});
    setNotes({});
    setSubmitError(null);
  };

  const handleCloseSuccess = () => {
    setIsSuccessOpen(false);
    handleReset();
    // reload page / soft refresh router
    router.refresh();
  };

  // Render shimmer loader
  if (isLoading) {
    return <AuditPageSkeleton />;
  }

  return (
    <div className="w-full pb-44 font-inter">
      {/* ─── HEADER SECTION ─── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-black/5">
        <div>
          <h2 className="h2 text-text-primary tracking-tight font-bold">
            Inventory Audit
          </h2>
          <p className="b1 text-text-secondary mt-2">
            Reconcile physical stock counts with digital database records
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex shrink-0 items-center bg-white/80 backdrop-blur-md rounded-2xl border border-black/5 shadow-sm divide-x divide-black/5 overflow-hidden h-16 md:h-20">
          <div className="px-5 sm:px-8 flex flex-col items-center justify-center min-w-[90px] sm:min-w-[120px]">
            <p className="b5 font-bold text-text-secondary uppercase tracking-wider">
              Audited
            </p>
            <p className="h3 text-text-primary leading-none mt-1">
              {stats.audited}{" "}
              <span className="b3 text-text-secondary">/ {stats.total}</span>
            </p>
          </div>
          <div className="px-5 sm:px-8 flex flex-col items-center justify-center min-w-[90px] sm:min-w-[120px]">
            <p className="b5 font-bold text-text-secondary uppercase tracking-wider">
              To-Do
            </p>
            <p className="h3 text-brand-accent leading-none mt-1">
              {stats.remaining}
            </p>
          </div>
        </div>
      </header>

      {/* ─── PROGRESS & CONTROLS ─── */}
      <div className="mt-8 space-y-5">
        {/* Animated Progress Bar */}
        <div className="w-full bg-white/60 border border-black/5 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="b3 font-bold text-text-primary">
              Audit Progress
            </span>
            <span className="b3 font-bold text-brand-accent">
              {stats.progressPercent}% Completed
            </span>
          </div>
          <div className="w-full h-3 bg-black/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-secondary to-brand-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${stats.progressPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Live search input */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search active inventory ingredients by name..."
            className="w-full h-12 md:h-14 pl-11 pr-4 bg-white border border-black/5 rounded-2xl b3 focus:outline-none focus:border-brand-accent transition-all shadow-sm"
          />
        </div>
      </div>

      {/* ─── ERROR BANNER ─── */}
      {(actionError || submitError) && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-2 mt-6">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span className="b4 font-medium">{actionError || submitError}</span>
        </div>
      )}

      {/* ─── LABELS FOR BIGGER SCREENS ─── */}
      <div className="hidden lg:block px-6 mt-10">
        <div className="flex items-center text-text-secondary b4 font-bold uppercase tracking-[0.2em] px-8 pb-4">
          <div className="flex-1">Ingredient Details</div>
          <div className="w-32 text-center">System Stock</div>
          <div className="w-64 text-center">Physical Count</div>
          <div className="w-40 text-center">Variance</div>
          <div className="w-20 text-right">Notes</div>
        </div>
      </div>

      {/* ─── LIVE GROUPS & LISTS ─── */}
      <div className="mt-6 space-y-12">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white/50 border border-black/5 rounded-3xl min-h-[300px]">
            <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mb-4">
              <ClipboardCheck size={32} />
            </div>
            <h3 className="h4 text-text-primary font-semibold">
              No stock items available
            </h3>
            <p className="b2 text-text-secondary mt-2">
              There are no inventory items registered to audit for this store.
            </p>
          </div>
        ) : (
          <>
            {/* 1. Measurement Based Group */}
            {groupedItems.measurement.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="b4 font-bold text-brand-accent uppercase tracking-widest">
                    Measurement-Based Ingredients (
                    {groupedItems.measurement.length})
                  </h3>
                  <div className="flex-1 h-px bg-black/5" />
                </div>

                <div className="grid gap-4">
                  {groupedItems.measurement.map((item) => (
                    <InventoryAuditRow
                      key={item.id}
                      item={item}
                      count={physicalCounts[item.id] || ""}
                      note={notes[item.id] || ""}
                      onCountChange={(val) => handleCountChange(item.id, val)}
                      onAdjustCount={(delta) => handleAdjustCount(item, delta)}
                      onQuickMatch={() => handleQuickMatch(item)}
                      onOpenNote={() => setActiveNoteId(item.id)}
                      variance={getVariance(item)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 2. Unit Based Group */}
            {groupedItems.unit.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="b4 font-bold text-brand-accent uppercase tracking-widest">
                    Unit-Based Stock ({groupedItems.unit.length})
                  </h3>
                  <div className="flex-1 h-px bg-black/5" />
                </div>

                <div className="grid gap-4">
                  {groupedItems.unit.map((item) => (
                    <InventoryAuditRow
                      key={item.id}
                      item={item}
                      count={physicalCounts[item.id] || ""}
                      note={notes[item.id] || ""}
                      onCountChange={(val) => handleCountChange(item.id, val)}
                      onAdjustCount={(delta) => handleAdjustCount(item, delta)}
                      onQuickMatch={() => handleQuickMatch(item)}
                      onOpenNote={() => setActiveNoteId(item.id)}
                      variance={getVariance(item)}
                    />
                  ))}
                </div>
              </section>
            )}

            {filteredItems.length === 0 && (
              <div className="text-center py-12 bg-white/45 rounded-3xl border border-black/5">
                <p className="b2 text-text-secondary">
                  No ingredients match your search query.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── BOTTOM FLOATING SUMMARY BAR ─── */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-black/5 shadow-2xl z-40">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-text-secondary b3">
              <AlertCircle
                size={18}
                className="text-brand-accent flex-shrink-0"
              />
              <span>
                Please review all counts and note discrepancies prior to
                completion.
              </span>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Button
                variant="outline"
                shape="rounded"
                onClick={handleReset}
                leftIcon={<RotateCcw size={16} />}
                className="font-bold border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white bg-white shrink-0"
              >
                Reset
              </Button>
              <Button
                variant="accent"
                shape="rounded"
                className="flex-grow sm:flex-grow-0 px-8 py-3 bg-brand-accent border-brand-accent text-white font-bold"
                onClick={() => setIsConfirmOpen(true)}
              >
                Complete Audit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── NOTES POPUP MODAL ─── */}
      <AnimatePresence>
        {activeNoteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveNoteId(null)}
              className="absolute inset-0"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[24px] w-full max-w-lg shadow-2xl p-6 border border-black/5 z-10"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="b2 font-bold text-text-primary flex items-center gap-2">
                  <FileText className="text-brand-accent" size={20} />
                  Add Discrepancy Note
                </h3>
                <button
                  onClick={() => setActiveNoteId(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-text-secondary transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="b3 text-text-secondary mb-4">
                Provide context for discrepancies on{" "}
                <span className="font-bold text-text-primary">
                  {items.find((i) => i.id === activeNoteId)?.name}
                </span>
              </p>

              <textarea
                autoFocus
                value={notes[activeNoteId] || ""}
                onChange={(e) =>
                  setNotes((prev) => ({
                    ...prev,
                    [activeNoteId!]: e.target.value,
                  }))
                }
                placeholder="Reason for discrepancy (e.g. Spillage, Spoiled goods, Damaged packaging, Missing items...)"
                className="w-full h-36 p-4 bg-bg-primary border border-black/5 rounded-2xl focus:border-brand-accent focus:outline-none b3 resize-none transition-all shadow-inner"
              />

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setActiveNoteId(null)}
                  className="font-semibold text-text-secondary"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setActiveNoteId(null)}
                  className="bg-brand-accent hover:bg-brand-accent/90 border-brand-accent text-white font-bold"
                >
                  Save Note
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── AUDIT SUMMARY CONFIRM MODAL ─── */}
      <AnimatePresence>
        {isConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirmOpen(false)}
              className="absolute inset-0"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[28px] w-full max-w-xl shadow-2xl p-6 md:p-8 border border-black/5 z-10 overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-secondary to-brand-accent" />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="h3 font-bold text-text-primary">
                    Review Stock Audit
                  </h3>
                  <p className="b3 text-text-secondary mt-1">
                    Confirm counts before updating store databases
                  </p>
                </div>
                <button
                  onClick={() => setIsConfirmOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-text-secondary transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Progress Summary Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-bg-primary rounded-2xl p-4 border border-black/5 text-center">
                  <span className="b4 text-text-secondary uppercase font-bold tracking-wide">
                    Counted Items
                  </span>
                  <p className="h3 text-text-primary mt-1 font-bold">
                    {stats.audited}
                  </p>
                </div>
                <div className="bg-bg-primary rounded-2xl p-4 border border-black/5 text-center">
                  <span className="b4 text-text-secondary uppercase font-bold tracking-wide">
                    Uncounted (Skipped)
                  </span>
                  <p className="h3 text-brand-accent mt-1 font-bold">
                    {stats.remaining}
                  </p>
                </div>
              </div>

              {/* Warnings and Uncounted messages */}
              {stats.remaining > 0 && (
                <div className="bg-yellow-50/70 border border-yellow-200/50 rounded-2xl p-4 flex gap-3 text-yellow-800 b3 mb-6">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">
                      Uncounted Items Present
                    </span>
                    <span>
                      {stats.remaining} item{stats.remaining > 1 ? "s" : ""}{" "}
                      will remain at their existing system stock level. Do you
                      wish to continue?
                    </span>
                  </div>
                </div>
              )}

              {/* Discrepancy details */}
              <div className="flex-1 overflow-y-auto mb-6 custom-scrollbar max-h-48 pr-2">
                <h4 className="b3 font-bold text-text-primary uppercase tracking-wider mb-3">
                  Discrepancies Found ({discrepancies.length})
                </h4>

                {discrepancies.length === 0 ? (
                  <div className="text-center py-6 bg-slate-50 rounded-2xl border border-black/5">
                    <p className="b3 text-text-secondary">
                      Perfect stock alignment! No discrepancies reported.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {discrepancies.map(({ item, variance, notes: dNote }) => (
                      <div
                        key={item.id}
                        className="bg-bg-primary rounded-xl p-3 border border-black/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
                      >
                        <div>
                          <p className="b3 font-bold text-text-primary">
                            {item.name}
                          </p>
                          {dNote && (
                            <p className="b4 text-text-secondary italic mt-0.5">
                              Note: &quot;{dNote}&quot;
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="b4 text-text-secondary">
                            System: {item.current_stock} &rarr; Physical:{" "}
                            {physicalCounts[item.id]}
                          </span>
                          <Badge
                            color={variance > 0 ? "success" : "error"}
                            variant="subtle"
                            className="font-bold py-0.5"
                          >
                            {variance > 0 ? `+${variance}` : `${variance}`}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t border-black/5 pt-6 flex flex-col md:flex-row justify-end gap-3 mt-auto">
                <Button
                  variant="outline"
                  onClick={() => setIsConfirmOpen(false)}
                  disabled={isSubmitting}
                  className="font-bold border-black/10 text-text-primary hover:bg-black/5 bg-white"
                >
                  Go Back & Edit
                </Button>
                <Button
                  variant="accent"
                  onClick={handleSubmitAudit}
                  loading={isSubmitting}
                  className="bg-brand-accent border-brand-accent text-white font-bold px-8 py-3"
                >
                  Submit & Save Counts
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── CELEBRATION SUCCESS MODAL ─── */}
      <AnimatePresence>
        {isSuccessOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-8 border border-black/5 text-center relative overflow-hidden"
            >
              {/* Confetti Background Sparkles */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-10 left-12 w-6 h-6 bg-brand-secondary rounded-full blur-[8px] animate-pulse" />
                <div className="absolute bottom-16 right-10 w-8 h-8 bg-brand-accent rounded-full blur-[10px] animate-pulse" />
              </div>

              <div className="w-20 h-20 bg-success-secondary text-success-primary rounded-full flex items-center justify-center mx-auto mb-6 border border-success-primary/20 shadow-inner">
                <CheckCircle2 size={44} className="stroke-[2.5]" />
              </div>

              <h3 className="h3 font-bold text-text-primary tracking-tight">
                Audit Session Completed
              </h3>
              <p className="b2 text-text-secondary mt-3 max-w-sm mx-auto">
                Physical stock updates have been securely synchronized with the
                database. Audit logs have been generated.
              </p>

              {/* Summary Stats */}
              <div className="my-6 bg-bg-primary rounded-2xl p-4 border border-black/5 divide-y divide-black/5">
                <div className="pb-2.5 flex justify-between b3">
                  <span className="text-text-secondary">Auditor Name:</span>
                  <span className="font-bold text-text-primary">
                    {currentUser?.name || "Employee"}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between b3">
                  <span className="text-text-secondary">
                    Total Counts Updated:
                  </span>
                  <span className="font-bold text-text-primary">
                    {stats.audited} items
                  </span>
                </div>
                <div className="pt-2.5 flex justify-between b3">
                  <span className="text-text-secondary">
                    Discrepancy Alerts:
                  </span>
                  <span
                    className={cn(
                      "font-bold",
                      discrepancies.length > 0
                        ? "text-brand-accent"
                        : "text-success-primary",
                    )}
                  >
                    {discrepancies.length} alerts
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  className="w-full py-3 bg-brand-primary border-brand-primary text-white font-bold"
                  onClick={handleCloseSuccess}
                >
                  Back to Stock Sheet
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-text-secondary font-semibold"
                  onClick={() => router.push(`/${tenantId}/employee/dashboard`)}
                >
                  Exit to Employee Dashboard
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── HELPER ROW COMPONENT ───
interface AuditRowProps {
  item: InventoryItem;
  count: string;
  note: string;
  onCountChange: (val: string) => void;
  onAdjustCount: (delta: number) => void;
  onQuickMatch: () => void;
  onOpenNote: () => void;
  variance: {
    value: number;
    status: "pending" | "match" | "increase" | "decrease";
  };
}

function InventoryAuditRow({
  item,
  count,
  note,
  onCountChange,
  onAdjustCount,
  onQuickMatch,
  onOpenNote,
  variance,
}: AuditRowProps) {
  const isCounted = count !== "";
  const hasNote = note.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group bg-white rounded-3xl border p-5 transition-all duration-300 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 shadow-sm",
        isCounted
          ? "border-success-primary/20 bg-success-secondary/5 shadow-none"
          : "border-black/5 hover:border-black/10 hover:shadow-md",
      )}
    >
      {/* 1. Item Name / Type */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <h4
            className={cn(
              "b2 font-bold",
              isCounted ? "text-success-primary" : "text-text-primary",
            )}
          >
            {item.name}
          </h4>
          {isCounted && (
            <CheckCircle2
              size={16}
              className="text-success-primary flex-shrink-0"
            />
          )}
        </div>
        <p className="b5 text-text-secondary uppercase tracking-wider flex items-center gap-2">
          <span>Mode: {item.inventory_mode}</span>
          <span className="opacity-30">•</span>
          <span>Unit: {item.unit_type}</span>
        </p>
      </div>

      {/* 2. System stock */}
      <div className="lg:w-32 text-left lg:text-center mt-2 lg:mt-0">
        <p className="lg:hidden b5 font-bold text-text-secondary uppercase mb-0.5">
          System Stock
        </p>
        <p className="b1 text-text-primary font-semibold tabular-nums">
          {item.current_stock}{" "}
          <span className="b4 text-text-secondary">{item.unit_type}</span>
        </p>
      </div>

      {/* 3. Actual Count Controls */}
      <div className="lg:w-64 flex flex-col items-start lg:items-center mt-2 lg:mt-0">
        <p className="lg:hidden b5 font-bold text-text-secondary uppercase mb-1">
          Actual Count
        </p>
        <div className="flex items-center gap-2">
          {/* Decrement Button */}
          <button
            onClick={() => onAdjustCount(-1)}
            className="w-9 h-9 rounded-xl bg-bg-primary border border-black/5 flex items-center justify-center hover:bg-black/5 text-text-primary transition-all active:scale-95"
            title="Decrement by 1"
          >
            <Minus size={14} className="stroke-[2.5]" />
          </button>

          {/* Numeric Field */}
          <div className="relative">
            <input
              type="text"
              value={count}
              onChange={(e) => onCountChange(e.target.value)}
              placeholder="0.00"
              className={cn(
                "w-24 h-10 text-center b1 font-bold rounded-xl border transition-all focus:outline-none",
                isCounted
                  ? "border-success-primary/30 bg-success-secondary/10 text-success-primary"
                  : "border-black/10 focus:border-brand-accent bg-white text-text-primary",
              )}
            />
            {/* Snap Match Button */}
            {!isCounted && (
              <button
                onClick={onQuickMatch}
                className="absolute -right-11 top-1/2 -translate-y-1/2 w-9 h-9 bg-success-secondary text-success-primary rounded-xl flex items-center justify-center hover:bg-success-primary hover:text-white transition-all shadow-sm border border-success-primary/10"
                title="Match System Stock"
              >
                <Check size={14} className="stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Increment Button */}
          <button
            onClick={() => onAdjustCount(1)}
            className="w-9 h-9 rounded-xl bg-bg-primary border border-black/5 flex items-center justify-center hover:bg-black/5 text-text-primary transition-all active:scale-95"
            title="Increment by 1"
          >
            <Plus size={14} className="stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* 4. Variance Status Badge */}
      <div className="lg:w-40 flex flex-col items-start lg:items-center mt-2 lg:mt-0">
        <span className="lg:hidden b5 font-bold text-text-secondary uppercase mb-1">
          Variance
        </span>
        <Badge
          color={
            variance.status === "match"
              ? "success"
              : variance.status === "increase"
                ? "success"
                : variance.status === "pending"
                  ? "primary"
                  : "error"
          }
          variant={variance.status === "pending" ? "outline" : "subtle"}
          leftIcon={
            variance.status === "increase" ? (
              <TrendingUp size={12} strokeWidth={2.5} />
            ) : variance.status === "decrease" ? (
              <TrendingDown size={12} strokeWidth={2.5} />
            ) : null
          }
          className="min-w-[100px] justify-center text-center font-bold"
        >
          {variance.status === "pending"
            ? "---"
            : variance.status === "match"
              ? "Match"
              : `${variance.status === "increase" ? "+" : "-"}${variance.value.toFixed(2)}`}
        </Badge>
      </div>

      {/* 5. Discrepancy Note Button */}
      <div className="lg:w-20 flex items-center justify-end mt-2 lg:mt-0">
        <button
          onClick={onOpenNote}
          className={cn(
            "relative p-2 rounded-xl transition-all active:scale-95 border",
            hasNote
              ? "bg-brand-accent/10 border-brand-accent/20 text-brand-accent hover:bg-brand-accent/20"
              : "bg-bg-primary border-black/5 hover:bg-black/5 text-text-secondary",
          )}
          title={hasNote ? "Edit Discrepancy Note" : "Add Discrepancy Note"}
        >
          <FileText size={18} />
          {hasNote && (
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-brand-accent border-2 border-white rounded-full" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
