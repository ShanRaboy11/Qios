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
  ClipboardCheck,
  Package,
  Search,
  Check,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Custom Atoms & Molecules ---
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { SearchFilterBar } from "@/components/molecules/SearchFilterBar";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  // ADDITION: Quick match function
  const handleQuickMatch = (id: string, count: number) => {
    setPhysicalCounts(prev => ({ ...prev, [id]: count.toString() }));
  };

  const getVariance = (id: string, systemCount: number) => {
    const input = physicalCounts[id];
    if (input === undefined || input === "") return { value: 0, status: "pending" as const };
    const physical = parseFloat(input);
    const diff = physical - systemCount;
    if (diff > 0) return { value: diff, status: "increase" as const };
    if (diff < 0) return { value: Math.abs(diff), status: "decrease" as const };
    return { value: 0, status: "match" as const };
  };

  // --- Stats & Filtering ---
  const allItemsList = useMemo(() => Object.values(STOCK_DATA).flat(), []);
  
  const stats = useMemo(() => {
    const auditedCount = Object.keys(physicalCounts).filter(id => physicalCounts[id] !== "").length;
    return { 
        total: allItemsList.length, 
        audited: auditedCount,
        remaining: allItemsList.length - auditedCount
    };
  }, [physicalCounts, allItemsList]);

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const result: any = {};
    Object.entries(STOCK_DATA).forEach(([category, items]) => {
      const filtered = items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        category.toLowerCase().includes(query)
      );
      if (filtered.length > 0) result[category] = filtered;
    });
    return result;
  }, [searchQuery]);

  const isAuditComplete = stats.audited === stats.total;

  return (
    <div className="w-full min-h-screen pb-40 bg-bg-primary font-inter kds-fade-in">
      
      {/* ─── HEADER & SEARCH (IMPROVED HUD) ─── */}
      <header className="sticky top-0 z-30 bg-brand-primary backdrop-blur-md border-b border-kds-border-warm px-6 py-8 md:px-12">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="h2 text-text-primary tracking-tighter">Stock Audit</h1>
              <p className="b3 text-text-secondary">Physical verification session</p>
            </div>

            {/* ADDITION: Progress HUD */}
            <div className="flex items-center gap-4 bg-bg-primary p-2 rounded-2xl border border-kds-border-warm">
                <div className="px-4 border-r border-kds-border-warm">
                    <p className="b4 font-semibold text-text-primary uppercase">Items Audited</p>
                    <p className="b2 font-black text-text-primary text-center">{stats.audited} </p>
                </div>
                <div className="px-4">
                    <p className="b4 font-bold text-text-primary uppercase">To-Do</p>
                    <p className="b2 font-black text-brand-accent text-center">{stats.remaining}</p>
                </div>
            </div>
          </div>

          <SearchFilterBar 
            placeholder="Search by ingredient name..."
            onSearch={(val) => setSearchQuery(val)}
            onFilterClick={() => console.log("Filters")}
          />
        </div>
      </header>

      {/* ─── CONTENT LABELS ─── */}
      <div className="hidden lg:block max-w-6xl mx-auto px-6 mt-10">
        <div className="flex items-center text-text-primary b4 font-bold uppercase tracking-[0.2em] px-8">
          <div className="flex-1">Ingredient Details</div>
          <div className="w-32 text-center">System</div>
          <div className="w-64 text-center">Actual Found</div>
          <div className="w-40 text-center">Variance</div>
          <div className="w-20 text-right">Notes</div>
        </div>
      </div>

      {/* ─── AUDIT LIST ─── */}
      <div className="max-w-6xl mx-auto px-6 mt-6 space-y-12">
        {Object.entries(filteredData).map(([categoryName, items]: any, catIdx) => (
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
              {items.map((item: any) => {
                const variance = getVariance(item.id, item.systemCount);
                const hasNote = notes[item.id]?.length > 0;
                const isFinished = variance.status !== "pending";
                
                return (
                  <div 
                    key={item.id} 
                    className={cn(
                      "group bg-white rounded-[24px] border-2 p-5 md:p-6 transition-all flex flex-col lg:flex-row lg:items-center gap-6",
                      isFinished ? "border-success-primary/20 bg-success-secondary/5" : "border-transparent shadow-card"
                    )}
                  >
                    {/* Item Info */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className={cn("b1 font-bold transition-colors", isFinished ? "text-success-primary" : "text-text-primary")}>
                            {item.name}
                        </h4>
                        {isFinished && <CheckCircle2 size={16} className="text-success-primary" />}
                      </div>
                      <p className="b4 text-text-secondary flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-md font-semibold text-[10px] uppercase">{item.category}</span>
                        <span className="opacity-40">•</span>
                        <span>{item.unit}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between lg:justify-end gap-8 md:gap-12 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0">
                      
                      <div className="text-center">
                        <p className="lg:hidden b5 font-bold text-text-tertiary uppercase mb-1">System</p>
                        <p className="b1 font-medium text-text-primary tabular-nums">{item.systemCount}</p>
                      </div>

                      {/* Physical Input Group */}
                      <div className="space-y-1">
                        <p className="lg:hidden b5 font-bold text-text-tertiary uppercase text-center">Actual Found</p>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => adjustCount(item.id, physicalCounts[item.id], -1)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-brand-primary/20 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          
                          <div className="relative group">
                            <input
                                type="text"
                                value={physicalCounts[item.id] || ""}
                                onChange={(e) => handleInputChange(item.id, e.target.value)}
                                placeholder="0.00"
                                className="w-20 h-10 text-center b1 font-bold rounded-xl border-2 border-kds-border-warm focus:border-brand-primary focus:outline-none transition-all"
                            />
                            {/* ADDITION: Quick Match Checkmark */}
                            {!isFinished && (
                                <button 
                                    onClick={() => handleQuickMatch(item.id, item.systemCount)}
                                    className="absolute -right-10 top-1/2 -translate-y-1/2 w-7 h-7 bg-success-secondary text-success-primary rounded-full flex items-center justify-center hover:bg-success-primary hover:text-white transition-all shadow-sm"
                                    title="Match System"
                                >
                                    <Check size={14} />
                                </button>
                            )}
                          </div>

                          <button 
                             onClick={() => adjustCount(item.id, physicalCounts[item.id], 1)}
                             className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-brand-primary/20 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                     {/* ─── FIXED VARIANCE DISPLAY ─── */}
                      <div className="w-full lg:w-32 flex justify-between lg:block items-center">
                        <span className="lg:hidden b5 font-bold text-text-tertiary uppercase">Variance</span>
                        <div className="text-center">
                            <Badge 
                                color={
                                    (variance.status === "match" || variance.status === "increase") ? "success" : 
                                    variance.status === "pending" ? "primary" : 
                                    "error"
                                }
                                variant={variance.status === "pending" ? "outline" : "subtle"}
                                leftIcon={
                                    variance.status === "increase" ? <TrendingUp size={12} /> : 
                                    variance.status === "decrease" ? <TrendingDown size={12} /> : 
                                    null
                                }
                                className="min-w-[90px] justify-center font-bold"
                            >
                                {variance.status === "pending" ? "---" : `${variance.status === 'increase' ? '+' : variance.status === 'decrease' ? '-' : ''}${variance.value.toFixed(2)}`}
                            </Badge>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center">
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
            <Button variant="outline" shape="pill" onClick={() => setPhysicalCounts({})} leftIcon={<RotateCcw size={16}/>}>
                Reset
            </Button>
            <Button 
                variant="accent" 
                shape="pill" 
                className="flex-1 sm:flex-none px-12 py-6 shadow-coral" 
                leftIcon={<ClipboardCheck size={20} />}
                disabled={!isAuditComplete}
            >
              Complete Audit
            </Button>
          </div>
        </div>
      </div>

      {/* ─── NOTES MODAL (Original Logic preserved) ─── */}
      <AnimatePresence>
        {activeNoteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveNoteId(null)} className="absolute inset-0" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-[32px] w-full max-w-lg shadow-2xl p-8 overflow-hidden border border-kds-border-warm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="h4 text-text-primary tracking-tight">Add Discrepancy Note</h3>
                <Button variant="ghost" size="icon" shape="rounded" onClick={() => setActiveNoteId(null)}><X size={20}/></Button>
              </div>
              <textarea
                autoFocus
                value={notes[activeNoteId] || ""}
                onChange={(e) => setNotes(prev => ({ ...prev, [activeNoteId!]: e.target.value }))}
                placeholder="Reason for discrepancy..."
                className="w-full h-40 p-5 bg-bg-primary border-2 border-kds-border-warm rounded-2xl focus:border-brand-primary focus:outline-none b2 resize-none transition-all"
              />
              <div className="mt-8">
                <Button onClick={() => setActiveNoteId(null)} className="w-full py-4 shadow-gold">Save Note</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}