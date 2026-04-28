"use client";

import React, { useState } from "react";
import { 
  FileText, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  Calculator, 
  CheckCircle2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";

interface Ingredient {
  id: string;
  name: string;
  category: string; // e.g., "Refrigerated"
  unit: string;
  systemCount: number;
}

interface AuditState {
  [key: string]: string; // Stores physical count inputs
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

  const handleInputChange = (id: string, value: string) => {
    // Only allow numbers and decimals
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
        
        {/* TABLE HEADER */}
        <div className="w-full px-6 lg:px-14 py-8 bg-neutral-500/10 rounded-t-[50px] flex justify-between items-center border-b border-neutral-200">
          <div className="w-1/4 text-black text-xl lg:text-2xl font-semibold uppercase tracking-wider">Ingredient</div>
          <div className="w-1/4 text-center text-black text-xl lg:text-2xl font-semibold uppercase tracking-wider">System Count</div>
          <div className="w-1/3 flex justify-between items-center">
            <div className="text-black text-xl lg:text-2xl font-semibold uppercase tracking-wider">Physical Count</div>
            <div className="text-black text-xl lg:text-2xl font-semibold uppercase tracking-wider">Variance</div>
          </div>
          <div className="w-12 text-center text-black text-xl lg:text-2xl font-semibold uppercase tracking-wider">Notes</div>
        </div>

        {/* CATEGORIES */}
        {Object.entries(STOCK_DATA).map(([categoryName, items]) => (
          <div key={categoryName} className="flex flex-col gap-7">
            {/* Category Subheader */}
            <div className="flex items-center gap-4 px-7">
              <div className="text-neutral-500 text-2xl font-bold tracking-widest">{categoryName}</div>
              <div className="flex-1 h-[2px] bg-rose-500 opacity-20"></div>
            </div>

            {/* Items List */}
            <div className="flex flex-col gap-4">
              {items.map((item) => {
                const variance = getVariance(item.id, item.systemCount);
                
                return (
                  <div key={item.id} className="w-full px-8 lg:px-14 py-6 bg-white rounded-[20px] shadow-sm flex justify-between items-center transition-all hover:shadow-md border border-transparent hover:border-orange-200">
                    
                    {/* Ingredient Name & Meta */}
                    <div className="w-1/4 flex flex-col gap-1">
                      <div className="text-zinc-800 text-2xl lg:text-3xl font-bold">{item.name}</div>
                      <div className="flex items-center gap-3 text-neutral-500 font-medium font-inter">
                        <span>{item.category}</span>
                        <span className="text-gray-300">•</span>
                        <span>{item.unit}</span>
                      </div>
                    </div>

                    {/* System Count */}
                    <div className="w-1/4 text-center text-neutral-500 text-xl lg:text-2xl font-medium">
                      {item.systemCount.toFixed(2)} {item.unit}
                    </div>

                    {/* Physical Input & Variance */}
                    <div className="w-1/3 flex justify-between items-center gap-8">
                      {/* Input Field */}
                      <div className="relative w-40 lg:w-48 h-14">
                        <input
                          type="text"
                          value={physicalCounts[item.id] || ""}
                          onChange={(e) => handleInputChange(item.id, e.target.value)}
                          placeholder="0.00"
                          className="w-full h-full bg-white rounded-2xl border-2 border-neutral-200 px-4 text-center text-xl font-bold text-neutral-700 focus:outline-none focus:border-amber-400 transition-colors"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">{item.unit}</span>
                      </div>

                      {/* Variance Badge */}
                      <div className={cn(
                        "min-w-[100px] px-4 py-2 rounded-full border flex items-center justify-center gap-2 transition-all",
                        variance.status === "increase" && "bg-green-50 border-green-500 text-green-600",
                        variance.status === "decrease" && "bg-red-50 border-red-500 text-red-600",
                        variance.status === "inactive" && "bg-white border-neutral-300 text-neutral-400"
                      )}>
                        {variance.status === "increase" && <TrendingUp size={16} />}
                        {variance.status === "decrease" && <TrendingDown size={16} />}
                        {variance.status === "inactive" && <Minus size={16} />}
                        <span className="text-sm font-bold font-inter">
                          {variance.value.toFixed(2)} {item.unit}
                        </span>
                      </div>
                    </div>

                    {/* Notes Trigger */}
                    <button className="p-3 bg-amber-200 hover:bg-amber-300 rounded-xl transition-colors text-zinc-800">
                      <FileText size={24} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-center lg:justify-end items-center gap-6 mt-8">
        <Button 
          variant="outline" 
          className="w-72 h-16 bg-amber-200 border-none hover:bg-amber-300 text-zinc-800 font-bold rounded-2xl flex items-center gap-3 text-lg"
        >
          <Calculator size={20} className="text-zinc-800" />
          Calculate Variance
        </Button>
        <Button 
          className="w-72 h-16 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl flex items-center gap-3 shadow-lg shadow-rose-200 text-lg"
        >
          <CheckCircle2 size={20} />
          Submit Final Audit
        </Button>
      </div>
    </div>
  );
}