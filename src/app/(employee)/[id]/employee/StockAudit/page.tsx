"use client";

import React, { useState, useMemo } from "react";
import { 
  FileText, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  Plus,
  Calculator, 
  CheckCircle2,
  X,
  AlertCircle,
  ClipboardCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";

// --- Mock Data ---
const STOCK_DATA = {
  PROTEINS: [
    { id: "p1", name: "Pork Belly", category: "Refrigerated", unit: "kg", systemCount: 12.5 },
    { id: "p2", name: "Chicken Breast", category: "Refrigerated", unit: "kg", systemCount: 15.0 },
    { id: "p3", name: "Fisherman Catch", category: "Refrigerated", unit: "kg", systemCount: 8.0 },
  ],
  "DRY GOODS": [
    { id: "d1", name: "Jasmine Rice", category: "Dry Storage", unit: "kg", systemCount: 50.0 },
    { id: "d2", name: "Sea Salt", category: "Dry Storage", unit: "kg", systemCount: 5.0 },
  ]
};

export default function StockAudit() {
  const [physicalCounts, setPhysicalCounts] = useState<{ [key: string]: string }>({});
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // --- Logic ---
  const handleInputChange = (id: string, value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setPhysicalCounts(prev => ({ ...prev, [id]: value }));
    }
  };

  const adjustCount = (id: string, currentVal: string, delta: number) => {
    const val = parseFloat(currentVal || "0");
    const nextVal = Math.max(0, val + delta).toString();
    handleInputChange(id, nextVal);
  };

  const getVariance = (id: string, systemCount: number) => {
    const input = physicalCounts[id];
    if (!input || input === "") return { value: 0, status: "pending" as const };
    
    const physical = parseFloat(input);
    const diff = physical - systemCount;
    
    if (diff > 0) return { value: diff, status: "increase" as const };
    if (diff < 0) return { value: Math.abs(diff), status: "decrease" as const };
    return { value: 0, status: "match" as const };
  };

  // --- Stats ---
  const stats = useMemo(() => {
    const allItems = Object.values(STOCK_DATA).flat();
    const audited = Object.keys(physicalCounts).filter(id => physicalCounts[id] !== "").length;
    return { total: allItems.length, audited };
  }, [physicalCounts]);

  return (
    <div className="w-full min-h-screen p-4 md:p-10 bg-bg-primary font-inter kds-fade-in">
      
      {/* ─── HEADER & PROGRESS ─── */}
      <div className="max-w-6xl mx-auto mb-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Badge color="primary" variant="subtle" className="mb-2">Inventory Management</Badge>
            <h1 className="h2 text-text-primary">Stock Audit</h1>
            <p className="b2 text-text-secondary">Compare physical inventory against system records.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-kds-border-warm shadow-sm flex items-center gap-6">
            <div className="text-right">
              <p className="b5 font-bold text-text-secondary uppercase">Progress</p>
              <p className="b1 font-bold text-text-primary">{stats.audited} / {stats.total} Items</p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-brand-primary/20 flex items-center justify-center relative">
               <span className="text-[10px] font-bold text-brand-primary">
                {Math.round((stats.audited / stats.total) * 100)}%
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        {Object.entries(STOCK_DATA).map(([categoryName, items], catIdx) => (
          <motion.section 
            key={categoryName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <h3 className="b1 font-bold text-brand-accent uppercase tracking-widest">{categoryName}</h3>
              <div className="flex-1 h-px bg-kds-border-warm" />
            </div>

            <div className="grid gap-4">
              {items.map((item) => {
                const variance = getVariance(item.id, item.systemCount);
                const hasNote = notes[item.id]?.length > 0;
                
                return (
                  <div 
                    key={item.id} 
                    className={cn(
                      "group bg-white rounded-[24px] border-2 p-5 md:p-6 transition-all flex flex-col md:flex-row md:items-center gap-6",
                      variance.status === "match" ? "border-success-primary/20 bg-success-secondary/5" : 
                      variance.status === "pending" ? "border-transparent shadow-sm" : "border-brand-primary/20"
                    )}
                  >
                    {/* Item Info */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="b1 font-bold text-text-primary group-hover:text-brand-accent transition-colors">{item.name}</h4>
                        {variance.status === "match" && <CheckCircle2 size={16} className="text-success-primary" />}
                      </div>
                      <p className="b4 text-text-secondary flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-md font-semibold text-[10px] uppercase">{item.category}</span>
                        <span className="opacity-40">•</span>
                        <span>Unit: {item.unit}</span>
                      </p>
                    </div>

                    {/* Stats logic */}
                    <div className="flex flex-wrap items-center gap-8 md:gap-12">
                      <div className="text-center">
                        <p className="b5 font-bold text-text-tertiary uppercase mb-1">System</p>
                        <p className="b1 font-medium text-text-primary">{item.systemCount} <span className="text-[10px]">{item.unit}</span></p>
                      </div>

                      {/* Input Group */}
                      <div className="space-y-1">
                        <p className="b5 font-bold text-text-tertiary uppercase text-center md:text-left">Physical Count</p>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => adjustCount(item.id, physicalCounts[item.id], -1)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-brand-primary/20 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="text"
                            value={physicalCounts[item.id] || ""}
                            onChange={(e) => handleInputChange(item.id, e.target.value)}
                            placeholder="0.00"
                            className="w-24 h-11 text-center b1 font-bold rounded-xl border-2 border-kds-border-warm focus:border-brand-primary focus:outline-none transition-all"
                          />
                          <button 
                             onClick={() => adjustCount(item.id, physicalCounts[item.id], 1)}
                             className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-brand-primary/20 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Variance Badge */}
                      <div className="min-w-[100px] flex flex-col items-center">
                        <p className="b5 font-bold text-text-tertiary uppercase mb-2">Variance</p>
                        <Badge 
                          color={variance.status === "increase" ? "success" : variance.status === "decrease" ? "error" : "primary"}
                          variant={variance.status === "pending" ? "outline" : "subtle"}
                          leftIcon={variance.status === "increase" ? <TrendingUp size={12} /> : variance.status === "decrease" ? <TrendingDown size={12} /> : null}
                        >
                          {variance.status === "pending" ? "---" : `${variance.value.toFixed(2)} ${item.unit}`}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                         <Button 
                          variant={hasNote ? "primary" : "ghost"} 
                          size="icon" 
                          shape="rounded"
                          onClick={() => setActiveNoteId(item.id)}
                          className="relative"
                         >
                          <FileText size={20} />
                          {hasNote && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand-accent rounded-full border-2 border-white" />}
                         </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        ))}
      </div>

      {/* ─── STICKY FOOTER ACTIONS ─── */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-kds-border-warm z-40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-text-secondary b3">
            <AlertCircle size={18} className="text-brand-primary" />
            <span>Review all variances before submitting.</span>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button variant="outline" shape="pill" leftIcon={<Calculator size={18} />}>
              Recalculate
            </Button>
            <Button variant="accent" shape="pill" className="flex-1 sm:flex-none px-12" leftIcon={<ClipboardCheck size={20} />}>
              Complete Audit
            </Button>
          </div>
        </div>
      </div>

      {/* ─── NOTES MODAL ─── */}
      <AnimatePresence>
        {activeNoteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveNoteId(null)}
              className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[32px] w-full max-w-lg shadow-2xl p-8 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="h4 text-text-primary">Discrepancy Note</h3>
                  <p className="b4 text-text-secondary italic">Item ID: {activeNoteId}</p>
                </div>
                <Button variant="ghost" size="icon" shape="rounded" onClick={() => setActiveNoteId(null)}>
                  <X size={20} />
                </Button>
              </div>
              <textarea
                autoFocus
                value={notes[activeNoteId] || ""}
                onChange={(e) => setNotes(prev => ({ ...prev, [activeNoteId!]: e.target.value }))}
                placeholder="Why is there a difference? (e.g., spoilage, theft, incorrect delivery...)"
                className="w-full h-40 p-5 bg-bg-primary border-2 border-kds-border-warm rounded-2xl focus:border-brand-primary focus:outline-none b2 resize-none transition-all"
              />
              <div className="mt-8">
                <Button onClick={() => setActiveNoteId(null)} className="w-full py-4">Save and Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Spacer for sticky footer */}
      <div className="h-32" />
    </div>
  );
}