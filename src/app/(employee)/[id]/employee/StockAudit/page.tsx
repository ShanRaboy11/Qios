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
    const physical = parseFloat(physicalCounts[id] || "0");
    if (!physicalCounts[id]) return { value: 0, status: "inactive" };
    
    const diff = physical - systemCount;
    if (diff > 0) return { value: diff, status: "increase" };
    if (diff < 0) return { value: Math.abs(diff), status: "decrease" };
    return { value: 0, status: "inactive" };
  };

  return (
    <div className="w-full min-h-screen p-6 lg:p-24 bg-orange-50 flex flex-col gap-12 overflow-hidden font-figtree">
      <div className="w-full flex flex-col gap-7">
        
        {/* TABLE HEADER - Adjusted for symmetry + Font Applied */}
        <div className="w-full px-14 py-8 bg-neutral-500/10 rounded-t-[50px] flex items-center border-b border-neutral-200 font-figtree">
          <div className="flex-1 text-black text-xl lg:text-2xl font-semibold uppercase tracking-wider text-left">Ingredient</div>
          <div className="flex-1 text-center text-black text-xl lg:text-2xl font-semibold uppercase tracking-wider">System Count</div>
          <div className="flex-1 text-center text-black text-xl lg:text-2xl font-semibold uppercase tracking-wider">Physical Count</div>
          <div className="flex-1 text-center text-black text-xl lg:text-2xl font-semibold uppercase tracking-wider">Variance</div>
          <div className="w-24 text-right text-black text-xl lg:text-2xl font-semibold uppercase tracking-wider">Notes</div>
        </div>

        {/* CATEGORIES */}
        {Object.entries(STOCK_DATA).map(([categoryName, items]) => (
          <div key={categoryName} className="flex flex-col gap-7">
            <div className="flex items-center gap-4 px-7">
              <div className="text-neutral-500 text-2xl font-bold tracking-widest font-figtree">{categoryName}</div>
              <div className="flex-1 h-[2px] bg-rose-500 opacity-20"></div>
            </div>

            <div className="flex flex-col gap-4">
              {items.map((item) => {
                const variance = getVariance(item.id, item.systemCount);
                const hasNote = notes[item.id] && notes[item.id].length > 0;
                
                return (
                  <div key={item.id} className="w-full px-14 py-6 bg-white rounded-[20px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.05)] flex items-center transition-all hover:shadow-md border border-transparent hover:border-orange-200">
                    
                    {/* Ingredient - Symmetrical Left + Font Applied */}
                    <div className="flex-1 flex flex-col gap-1 text-left">
                      <div className="text-zinc-800 text-2xl lg:text-3xl font-bold font-figtree">{item.name}</div>
                      <div className="flex items-center gap-3 text-neutral-500 font-medium font-inter">
                        <span>{item.category}</span>
                        <span className="text-gray-400 text-sm leading-5">•</span>
                        <span>{item.unit}</span>
                      </div>
                    </div>

                    {/* System Count - Font Applied */}
                    <div className="flex-1 text-center text-neutral-500 text-2xl font-normal font-figtree">
                      {item.systemCount.toFixed(2)} {item.unit}
                    </div>

                    {/* Physical Count - Font Applied */}
                    <div className="flex-1 flex justify-center">
                      <div className="relative w-40 lg:w-44 h-14">
                        <input
                          type="text"
                          value={physicalCounts[item.id] || ""}
                          onChange={(e) => handleInputChange(item.id, e.target.value)}
                          placeholder="0.00"
                          className="w-full h-full bg-white rounded-[20px] outline outline-2 outline-offset-[-2px] outline-neutral-500/30 text-center text-2xl font-normal text-neutral-500 focus:outline-amber-400 font-figtree"
                        />
                      </div>
                    </div>

                    {/* Variance - Meta uses font-inter */}
                    <div className="flex-1 flex justify-center">
                      <div className={cn(
                        "w-32 px-4 py-2 rounded-[50px] outline outline-1 outline-offset-[-1px] flex justify-center items-center gap-[5px] overflow-hidden transition-all",
                        variance.status === "increase" && "bg-lime-100 outline-green-500 text-green-500",
                        variance.status === "decrease" && "bg-red-600/20 outline-red-600/90 text-red-600/90",
                        variance.status === "inactive" && "bg-white outline-neutral-500 text-neutral-500"
                      )}>
                        {variance.status === "increase" && <TrendingUp size={16} />}
                        {variance.status === "decrease" && <TrendingDown size={16} />}
                        {variance.status === "inactive" && <Minus size={16} />}
                        <div className="text-xs font-normal font-inter">{variance.value.toFixed(2)} {item.unit}</div>
                      </div>
                    </div>

                    {/* Notes - Symmetrical Right */}
                    <div className="w-24 flex justify-end">
                      <button 
                        onClick={() => setActiveNoteId(item.id)}
                        className={cn(
                          "p-3 rounded-lg transition-all relative",
                          hasNote ? "bg-amber-400 text-white" : "bg-amber-200 text-zinc-800 hover:bg-amber-300"
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

      {/* FOOTER ACTIONS - Buttons use font-inter */}
      <div className="flex justify-center lg:justify-end items-center gap-6 mt-8 font-inter">
        <Button 
          variant="outline" 
          className="w-72 h-16 bg-amber-200 border-none hover:bg-amber-300 text-zinc-800 font-bold rounded-xl flex items-center gap-3 text-lg"
        >
          <Calculator size={20} />
          Calculate Variance
        </Button>
        <Button 
          className="w-72 h-16 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl flex items-center gap-3 shadow-lg shadow-rose-200 text-lg"
        >
          <CheckCircle2 size={20} />
          Submit Final Audit
        </Button>
      </div>

      {/* FUNCTIONAL NOTES MODAL */}
      {activeNoteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-zinc-800 font-figtree">Add Discrepancy Note</h3>
                <button onClick={() => setActiveNoteId(null)} className="p-2 hover:bg-gray-100 rounded-full text-neutral-400">
                  <X size={20} />
                </button>
              </div>
              <textarea
                autoFocus
                value={notes[activeNoteId] || ""}
                onChange={(e) => setNotes(prev => ({ ...prev, [activeNoteId]: e.target.value }))}
                placeholder="Type discrepancy reason..."
                className="w-full h-40 p-4 bg-gray-50 border border-neutral-200 rounded-2xl focus:outline-none focus:border-amber-400 resize-none font-inter text-neutral-600"
              />
              <Button onClick={() => setActiveNoteId(null)} className="w-full h-12 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl font-inter">
                Save Note
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}