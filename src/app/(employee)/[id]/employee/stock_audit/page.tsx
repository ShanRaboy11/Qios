"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  TrendingDown,
  TrendingUp,
  Minus,
  Plus,
  CheckCircle2,
  X,
  AlertCircle,
  ClipboardCheck,
  Check,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";

const STOCK_DATA = {
  PROTEINS: [
    {
      id: "p1",
      name: "Pork Belly",
      category: "Refrigerated",
      unit: "kg",
      systemCount: 12.5,
    },
    {
      id: "p2",
      name: "Chicken Breast",
      category: "Refrigerated",
      unit: "kg",
      systemCount: 15.0,
    },
    {
      id: "p3",
      name: "Fisherman Catch",
      category: "Refrigerated",
      unit: "kg",
      systemCount: 8.0,
    },
  ],
  "DRY GOODS": [
    {
      id: "d1",
      name: "Jasmine Rice",
      category: "Dry Storage",
      unit: "kg",
      systemCount: 50.0,
    },
    {
      id: "d2",
      name: "Sea Salt",
      category: "Dry Storage",
      unit: "kg",
      systemCount: 5.0,
    },
  ],
};

export default function StockAudit() {
  const [physicalCounts, setPhysicalCounts] = useState<{
    [key: string]: string;
  }>({});
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (id: string, value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setPhysicalCounts((prev) => ({ ...prev, [id]: value }));
    }
  };

  const adjustCount = (id: string, currentVal: string, delta: number) => {
    const val = parseFloat(currentVal || "0");
    const nextVal = Math.max(0, val + delta).toString();
    handleInputChange(id, nextVal);
  };

  const handleQuickMatch = (id: string, count: number) => {
    setPhysicalCounts((prev) => ({ ...prev, [id]: count.toString() }));
  };

  const getVariance = (id: string, systemCount: number) => {
    const input = physicalCounts[id];
    if (input === undefined || input === "")
      return { value: 0, status: "pending" as const };
    const physical = parseFloat(input);
    const diff = physical - systemCount;
    if (diff > 0) return { value: diff, status: "increase" as const };
    if (diff < 0) return { value: Math.abs(diff), status: "decrease" as const };
    return { value: 0, status: "match" as const };
  };

  const allItemsList = useMemo(() => Object.values(STOCK_DATA).flat(), []);
  const stats = useMemo(() => {
    const auditedCount = Object.keys(physicalCounts).filter(
      (id) => physicalCounts[id] !== "",
    ).length;
    return {
      total: allItemsList.length,
      audited: auditedCount,
      remaining: allItemsList.length - auditedCount,
    };
  }, [physicalCounts, allItemsList]);

  const isAuditComplete = stats.audited === stats.total;

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const result: any = {};
    Object.entries(STOCK_DATA).forEach(([category, items]) => {
      const filtered = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          category.toLowerCase().includes(query),
      );
      if (filtered.length > 0) result[category] = filtered;
    });
    return result;
  }, [searchQuery]);

  return (
    <div className="w-full min-h-screen pb-40 bg-bg-primary kds-fade-in">
      {/* ─── header ─── */}
      <header className="sticky top-0 z-30 bg-brand-primary backdrop-blur-md border-b border-kds-border-warm px-4 py-6 md:px-12 md:py-8">
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="h2 text-text-primary tracking-tighter truncate">
                Stock Audit
              </h2>
              <p className="b1 text-text-secondary mt-2">
                Physical verification session
              </p>
            </div>

            <div className="flex shrink-0 items-center bg-white/90 rounded-2xl border border-kds-border-warm shadow-sm divide-x divide-kds-border-warm overflow-hidden h-12 md:h-20">
              <div className="px-3 sm:px-8 flex flex-col items-center justify-center min-w-[70px] sm:min-w-[100px] md:min-w-[120px]">
                <p className="b5 md:b5 font-bold text-text-secondary uppercase tracking-tight">
                  Audited
                </p>
                <p className="b2 md:h2 text-text-primary leading-none">
                  {stats.audited}
                </p>
              </div>
              <div className="px-3 sm:px-8 flex flex-col items-center justify-center min-w-[70px] sm:min-w-[100px] md:min-w-[120px]">
                <p className="b5 md:b5 font-bold text-text-secondary uppercase tracking-tight">
                  To-Do
                </p>
                <p className="b2 md:h2 text-brand-accent leading-none">
                  {stats.remaining}
                </p>
              </div>
            </div>
          </div>

          {/* search & filter */}
          <div className="flex items-center gap-2 md:gap-4 w-full">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by ingredient name..."
                className="w-full h-12 md:h-14 pl-11 pr-4 bg-white border border-kds-border-warm rounded-[15px] b3 focus:outline-none focus:border-brand-accent transition-all shadow-sm"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="h-12 md:h-14 px-4 md:px-8 bg-white border-kds-border-warm rounded-[15px] flex items-center gap-2 hover:bg-bg-primary transition-all shadow-sm shrink-0"
              onClick={() => console.log("Open Filters")}
            >
              <SlidersHorizontal size={18} className="text-text-primary" />
              <span className="b3 text-text-primary font-semibold hidden xs:block">
                Filters
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* ─── labels ─── */}
      <div className="hidden lg:block max-w-6xl mx-auto px-6 mt-10">
        <div className="flex items-center text-text-primary b4 font-bold uppercase tracking-[0.2em] px-8 pb-4">
          <div className="flex-1">Ingredient Details</div>
          <div className="w-32 text-center">System</div>
          <div className="w-64 text-center">Actual Found</div>
          <div className="w-40 text-center">Variance</div>
          <div className="w-20 text-right">Notes</div>
        </div>
        <div className="mx-8 h-px bg-kds-border-warm opacity-60" />
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-6 space-y-12">
        {Object.entries(filteredData).map(
          ([categoryName, items]: any, catIdx) => (
            <motion.section
              key={categoryName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <h3 className="b4 font-bold text-brand-accent uppercase tracking-widest">
                  {categoryName}
                </h3>
                <div className="flex-1 h-px bg-kds-border-warm" />
              </div>

              <div className="grid gap-4">
                {items.map((item: any) => {
                  const variance = getVariance(item.id, item.systemCount);
                  const hasNote = notes[item.id]?.length > 0;
                  const isFinished = variance.status !== "pending";

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "group bg-white rounded-[24px] border-2 p-5 md:px-8 md:py-6 transition-all flex flex-col lg:flex-row lg:items-center",
                        isFinished
                          ? "border-success-primary/20 bg-success-secondary/5"
                          : "border-transparent shadow-card",
                      )}
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4
                            className={cn(
                              "b3 font-bold",
                              isFinished
                                ? "text-success-primary"
                                : "text-text-primary",
                            )}
                          >
                            {item.name}
                          </h4>
                          {isFinished && (
                            <CheckCircle2
                              size={16}
                              className="text-success-primary"
                            />
                          )}
                        </div>
                        <p className="b4 text-text-secondary flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-bg-primary rounded-md font-semibold text-[10px] uppercase border border-kds-border-warm">
                            {item.category}
                          </span>
                          <span className="opacity-40">•</span>
                          <span>{item.unit}</span>
                        </p>
                      </div>

                      <div className="lg:w-32 text-center mt-4 lg:mt-0">
                        <p className="lg:hidden b5 font-bold text-text-secondary uppercase mb-1">
                          System
                        </p>
                        <p className="b1 text-text-primary tabular-nums">
                          {item.systemCount}
                        </p>
                      </div>

                      <div className="lg:w-64 flex flex-col items-center mt-4 lg:mt-0">
                        <p className="lg:hidden b5 font-bold text-text-secondary uppercase mb-1">
                          Actual Found
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              adjustCount(item.id, physicalCounts[item.id], -1)
                            }
                            className="w-8 h-8 rounded-full bg-bg-primary border border-kds-border-warm flex items-center justify-center hover:bg-brand-primary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <div className="relative">
                            <input
                              type="text"
                              value={physicalCounts[item.id] || ""}
                              onChange={(e) =>
                                handleInputChange(item.id, e.target.value)
                              }
                              placeholder="0.00"
                              className="w-20 h-10 text-center b1 font-bold rounded-xl border-2 border-kds-border-warm focus:border-brand-accent focus:outline-none transition-all"
                            />
                            {!isFinished && (
                              <button
                                onClick={() =>
                                  handleQuickMatch(item.id, item.systemCount)
                                }
                                className="absolute -right-10 top-1/2 -translate-y-1/2 w-8 h-8 bg-success-secondary text-success-primary rounded-full flex items-center justify-center hover:bg-success-primary hover:text-white transition-all shadow-sm"
                                title="Match System"
                              >
                                <Check size={14} />
                              </button>
                            )}
                          </div>
                          <button
                            onClick={() =>
                              adjustCount(item.id, physicalCounts[item.id], 1)
                            }
                            className="w-8 h-8 rounded-full bg-bg-primary border border-kds-border-warm flex items-center justify-center hover:bg-brand-primary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="lg:w-40 flex flex-col items-center mt-4 lg:mt-0">
                        <span className="lg:hidden b5 font-bold text-text-secondary uppercase mb-1">
                          Variance
                        </span>
                        <Badge
                          color={
                            variance.status === "match" ||
                            variance.status === "increase"
                              ? "success"
                              : variance.status === "pending"
                                ? "primary"
                                : "error"
                          }
                          variant={
                            variance.status === "pending" ? "outline" : "subtle"
                          }
                          leftIcon={
                            variance.status === "increase" ? (
                              <TrendingUp size={12} />
                            ) : variance.status === "decrease" ? (
                              <TrendingDown size={12} />
                            ) : null
                          }
                          className="min-w-[90px] justify-center text-center font-semibold"
                        >
                          {variance.status === "pending"
                            ? "---"
                            : `${variance.status === "increase" ? "+" : variance.status === "decrease" ? "-" : ""}${variance.value.toFixed(2)}`}
                        </Badge>
                      </div>

                      <div className="lg:w-20 flex justify-end mt-4 lg:mt-0">
                        <Button
                          variant={hasNote ? "primary" : "ghost"}
                          size="icon"
                          shape="rounded"
                          onClick={() => setActiveNoteId(item.id)}
                          className="relative text-text-primary"
                        >
                          <FileText size={20} />
                          {hasNote && (
                            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand-accent rounded-full border-2 border-white" />
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          ),
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-kds-border-warm z-40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-text-secondary b3">
            <AlertCircle size={18} className="text-brand-accent" />
            <span>Review all variances before submitting.</span>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button
              variant="outline"
              shape="pill"
              onClick={() => setPhysicalCounts({})}
              leftIcon={<RotateCcw size={16} />}
              className="b2 font-semibold"
            >
              Reset
            </Button>
            <Button
              variant="accent"
              shape="pill"
              className="flex-1 sm:flex-none px-12 py-6 shadow-coral b2 font-bold"
              disabled={!isAuditComplete}
            >
              Complete Audit
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeNoteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveNoteId(null)}
              className="absolute inset-0"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-[32px] w-full max-w-lg shadow-2xl p-8 border border-kds-border-warm"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="h4 text-text-primary">Add Discrepancy Note</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  shape="rounded"
                  onClick={() => setActiveNoteId(null)}
                >
                  <X size={20} />
                </Button>
              </div>
              <textarea
                autoFocus
                value={notes[activeNoteId] || ""}
                onChange={(e) =>
                  setNotes((prev) => ({
                    ...prev,
                    [activeNoteId!]: e.target.value,
                  }))
                }
                placeholder="Reason for discrepancy..."
                className="w-full h-40 p-5 bg-bg-primary border-2 border-kds-border-warm rounded-2xl focus:border-brand-accent focus:outline-none b2 resize-none transition-all"
              />
              <div className="mt-8">
                <Button
                  onClick={() => setActiveNoteId(null)}
                  className="w-full py-4 shadow-gold b2 font-bold"
                >
                  Save Note
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
