"use client";

import React, { useState } from "react";
import { 
  FileText, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  Calculator, 
  CheckCircle2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";

interface Ingredient {
  id: string;
  name: string;
  category: string;
  unit: string;
  systemCount: number;
}

interface AuditState {
  [key: string]: string;
}

const STOCK_DATA = {
  PROTEINS: [
    { id: "p1", name: "Pork Belly", category: "Refrigerated", unit: "kg", systemCount: 12.5 },
    { id: "p2", name: "Chicken", category: "Refrigerated", unit: "kg", systemCount: 15.0 },
    { id: "p3", name: "Fisherman", category: "Refrigerated", unit: "kg", systemCount: 8.0 },
  ],
  "DRY GOODS": [
    { id: "d1", name: "Pork Belly", category: "Dry Storage", unit: "kg", systemCount: 12.5 },
    { id: "d2", name: "Chicken", category: "Dry Storage", unit: "kg", systemCount: 15.0 },
    { id: "d3", name: "Fisherman", category: "Dry Storage", unit: "kg", systemCount: 8.0 },
  ]
};

export default function StockAudit() {
  const [physicalCounts, setPhysicalCounts] = useState<AuditState>({});
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const handleInputChange = (id: string, value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setPhysicalCounts(prev => ({ ...prev, [id]: value }));
    }
  };

  const getVariance = (id: string, systemCount: number) => {
    const input = physicalCounts[id];
    const physical = parseFloat(input || "0");
    
    // Inactive if no input or value is exactly 0
    if (!input || input === "" || physical === 0) {
      return { value: 0, status: "inactive" };
    }
    
    const diff = physical - systemCount;
    if (diff > 0) return { value: diff, status: "increase" };
    if (diff < 0) return { value: Math.abs(diff), status: "decrease" };
    return { value: 0, status: "inactive" };
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-12 lg:p-24 bg-orange-50 flex flex-col gap-8 md:gap-12 overflow-hidden font-figtree">
      <div className="w-full flex flex-col gap-7">
        
        {/* TABLE HEADER */}
        <div className="hidden md:flex w-full px-14 py-8 bg-neutral-500/10 rounded-t-[50px] items-center border-b border-neutral-200 font-figtree">
          <div className="flex-1 text-black text-sm md:text-lg lg:text-2xl font-semibold uppercase tracking-wider text-left">Ingredient</div>
          <div className="flex-1 text-center text-black text-sm md:text-lg lg:text-2xl font-semibold uppercase tracking-wider">System Count</div>
          <div className="flex-1 text-center text-black text-sm md:text-lg lg:text-2xl font-semibold uppercase tracking-wider">Physical Count</div>
          <div className="flex-1 text-center text-black text-sm md:text-lg lg:text-2xl font-semibold uppercase tracking-wider">Variance</div>
          <div className="w-24 text-right text-black text-sm md:text-lg lg:text-2xl font-semibold uppercase tracking-wider">Notes</div>
        </div>

        {/* CATEGORIES */}
        {Object.entries(STOCK_DATA).map(([categoryName, items]) => (
          <div key={categoryName} className="flex flex-col gap-6">
            <div className="flex items-center gap-4 px-2 md:px-7">
              <div className="text-neutral-500 text-lg md:text-xl lg:text-2xl font-bold tracking-widest font-figtree">{categoryName}</div>
              <div className="flex-1 h-[2px] bg-rose-500 opacity-20"></div>
            </div>

            <div className="flex flex-col gap-4">
              {items.map((item) => {
                const variance = getVariance(item.id, item.systemCount);
                const hasNote = notes[item.id] && notes[item.id].length > 0;
                
                return (
                  <div key={item.id} className="w-full px-5 md:px-14 py-5 md:py-6 bg-white rounded-[20px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.05)] flex flex-col md:flex-row md:items-center transition-all hover:shadow-md border border-transparent hover:border-orange-200 gap-5 md:gap-0">
                    
                    {/* Header Row for Mobile */}
                    <div className="flex justify-between items-start md:flex-1 md:block">
                      <div className="flex flex-col gap-0.5 text-left">
                        <div className="text-zinc-800 text-lg md:text-2xl lg:text-3xl font-bold font-figtree leading-tight">{item.name}</div>
                        <div className="flex items-center gap-2 text-[10px] md:text-xs lg:text-sm text-neutral-500 font-medium font-inter">
                          <span>{item.category}</span>
                          <span className="text-gray-400 font-normal leading-5">•</span>
                          <span>{item.unit}</span>
                        </div>
                      </div>

                      <div className="md:hidden">
                        <button 
                          onClick={() => setActiveNoteId(item.id)}
                          className={cn(
                            "p-2.5 rounded-lg transition-all relative",
                            hasNote ? "bg-amber-400 text-white shadow-md" : "bg-amber-200 text-zinc-800"
                          )}
                        >
                          <FileText size={18} />
                          {hasNote && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />}
                        </button>
                      </div>
                    </div>

                    {/* Mobile Stats Grid */}
                    <div className="grid grid-cols-2 md:contents gap-4 items-center">
                      
                      {/* System Count */}
                      <div className="flex flex-col md:block md:flex-1 text-left md:text-center">
                        <span className="md:hidden text-[9px] uppercase font-bold text-neutral-400 font-inter mb-0.5">System</span>
                        <div className="text-neutral-500 text-base md:text-lg lg:text-2xl font-normal font-figtree">
                          {item.systemCount.toFixed(2)} <span className="text-[10px] md:text-base">{item.unit}</span>
                        </div>
                      </div>

                      {/* Variance - Mobile View */}
                      <div className="flex flex-col md:hidden items-end">
                        <span className="text-[9px] uppercase font-bold text-neutral-400 font-inter mb-0.5">Variance</span>
                        <Badge 
                          variant="outline"
                          leftIcon={variance.status === "increase" ? <TrendingUp size={10} /> : variance.status === "decrease" ? <TrendingDown size={10} /> : <Minus size={10} />}
                          className={cn(
                            "font-inter text-[10px] px-2 py-0 h-6",
                            variance.status === "increase" && "border-success-primary text-success-primary bg-success-secondary/20",
                            variance.status === "decrease" && "border-warning-primary text-warning-primary bg-warning-secondary/20",
                            variance.status === "inactive" && "border-neutral-400 text-neutral-500 bg-transparent"
                          )}
                        >
                          {variance.value.toFixed(2)}
                        </Badge>
                      </div>

                      {/* Physical Count Input */}
                      <div className="col-span-2 md:col-span-1 md:flex-1 flex flex-col md:items-center">
                        <span className="md:hidden text-[9px] uppercase font-bold text-neutral-400 font-inter mb-0.5">Physical Count</span>
                        <div className="relative w-full md:w-40 lg:w-44 h-11 md:h-14">
                          <input
                            type="text"
                            value={physicalCounts[item.id] || ""}
                            onChange={(e) => handleInputChange(item.id, e.target.value)}
                            placeholder="0.00"
                            className="w-full h-full bg-white rounded-[12px] md:rounded-[20px] outline outline-2 outline-offset-[-2px] outline-neutral-500/30 text-center text-lg md:text-xl lg:text-2xl font-normal text-neutral-500/80 focus:outline-amber-400 font-figtree"
                          />
                        </div>
                      </div>

                      {/* Variance - Desktop View */}
                      <div className="hidden md:flex flex-1 justify-center">
                        <Badge 
                          variant="outline"
                          leftIcon={variance.status === "increase" ? <TrendingUp size={14} /> : variance.status === "decrease" ? <TrendingDown size={14} /> : <Minus size={14} />}
                          className={cn(
                            "font-inter text-xs md:text-h1 px-4",
                            variance.status === "increase" && "border-success-primary text-success-primary bg-success-secondary/20",
                            variance.status === "decrease" && "border-warning-primary text-warning-primary bg-warning-secondary/20",
                            variance.status === "inactive" && "border-neutral-400 text-neutral-500 bg-transparent"
                          )}
                        >
                          {variance.value.toFixed(2)} {item.unit}
                        </Badge>
                      </div>
                    </div>

                    {/* Notes - Desktop View */}
                    <div className="hidden md:flex w-24 justify-end">
                      <button 
                        onClick={() => setActiveNoteId(item.id)}
                        className={cn(
                          "p-3 rounded-lg transition-all relative",
                          hasNote ? "bg-amber-400 text-white shadow-md" : "bg-amber-200 text-zinc-800 hover:bg-amber-300"
                        )}
                      >
                        <FileText size={24} />
                        {hasNote && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex flex-col sm:flex-row justify-center md:justify-end items-center gap-3 md:gap-6 mt-4 md:mt-8 font-inter">
        <Button 
          variant="outline" 
          className="w-full sm:w-64 md:w-72 h-13 md:h-16 bg-amber-200 border-none hover:bg-amber-300 text-zinc-800 font-bold rounded-xl flex items-center justify-center gap-2 md:gap-3 text-sm md:text-lg"
        >
          <Calculator size={18} />
          Calculate Variance
        </Button>
        <Button 
          className="w-full sm:w-64 md:w-72 h-13 md:h-16 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 md:gap-3 shadow-lg shadow-rose-200 text-sm md:text-lg"
        >
          <CheckCircle2 size={18} />
          Submit Final Audit
        </Button>
      </div>

      {/* NOTES MODAL */}
      {activeNoteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] md:rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 md:p-8 flex flex-col gap-4 md:gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-2xl font-bold text-zinc-800 font-figtree">Add Discrepancy Note</h3>
                <button onClick={() => setActiveNoteId(null)} className="p-2 hover:bg-gray-100 rounded-full text-neutral-400">
                  <X size={18} />
                </button>
              </div>
              <textarea
                autoFocus
                value={notes[activeNoteId] || ""}
                onChange={(e) => setNotes(prev => ({ ...prev, [activeNoteId]: e.target.value }))}
                placeholder="Reason for discrepancy..."
                className="w-full h-32 md:h-40 p-4 bg-gray-50 border border-neutral-200 rounded-2xl focus:outline-none focus:border-amber-400 resize-none font-inter text-neutral-600 text-sm md:text-base"
              />
              <Button onClick={() => setActiveNoteId(null)} className="w-full h-11 md:h-12 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl font-inter text-sm md:text-base">
                Save Note
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}