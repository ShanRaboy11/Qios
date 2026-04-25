"use client";

import React, { useState, useMemo } from "react";
import { StatCard } from "@/components/molecules/StatCard";
import { FilterBar } from "@/components/molecules/FilterBar";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { ThresholdRow } from "@/components/molecules/ThresholdRow";
import { Button } from "@/components/atoms/Button";
import {
  Package,
  AlertTriangle,
  ArrowDownToLine,
  CheckCircle2,
} from "lucide-react";

type IngredientData = {
  id: string;
  name: string;
  category: string;
  unit: string;
  onHand: number;
  lowValue: string;
  criticalValue: string;
};

const INITIAL_DATA: IngredientData[] = [
  {
    id: "1",
    name: "Chicken (whole)",
    category: "Protein",
    unit: "pcs",
    onHand: 15,
    lowValue: "20",
    criticalValue: "5",
  },
  {
    id: "2",
    name: "Pork belly",
    category: "Protein",
    unit: "kg",
    onHand: 8,
    lowValue: "10",
    criticalValue: "3",
  },
  {
    id: "3",
    name: "White rice",
    category: "Staple",
    unit: "kg",
    onHand: 50,
    lowValue: "20",
    criticalValue: "10",
  },
  {
    id: "4",
    name: "Cooking oil",
    category: "Condiments",
    unit: "L",
    onHand: 2,
    lowValue: "5",
    criticalValue: "2",
  },
  {
    id: "5",
    name: "Soy Sauce",
    category: "Condiments",
    unit: "L",
    onHand: 4,
    lowValue: "3",
    criticalValue: "1",
  },
  {
    id: "6",
    name: "Garlic",
    category: "Produce",
    unit: "kg",
    onHand: 1.5,
    lowValue: "2",
    criticalValue: "0.5",
  },
  {
    id: "7",
    name: "Sweet Potato",
    category: "Produce",
    unit: "kg",
    onHand: 8,
    lowValue: "10",
    criticalValue: "3",
  },
];

export const ThresholdSettingsPanel = () => {
  const [items, setItems] = useState<IngredientData[]>(INITIAL_DATA);
  const [statusFilter, setStatusFilter] = useState("all");

  const handleUpdateItem = (
    id: string,
    field: "lowValue" | "criticalValue",
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const isSaveDisabled = useMemo(() => {
    return items.some((item) => {
      const low = Number(item.lowValue);
      const crit = Number(item.criticalValue);
      if (
        isNaN(low) ||
        isNaN(crit) ||
        item.lowValue === "" ||
        item.criticalValue === ""
      )
        return true;
      return crit >= low;
    });
  }, [items]);

  // Derived statistics
  const stats = useMemo(() => {
    let critical = 0;
    let low = 0;
    let enough = 0;

    items.forEach((item) => {
      const lowVal = Number(item.lowValue);
      const critVal = Number(item.criticalValue);
      if (!isNaN(lowVal) && !isNaN(critVal)) {
        if (item.onHand <= critVal) critical++;
        else if (item.onHand <= lowVal) low++;
        else enough++;
      } else {
        enough++; // default if unparseable
      }
    });

    return { total: items.length, critical, low, enough };
  }, [items]);

  const filteredItems = useMemo(() => {
    if (statusFilter === "all") return items;
    return items.filter((item) => {
      const lowVal = Number(item.lowValue);
      const critVal = Number(item.criticalValue);
      let status = "enough";
      if (!isNaN(lowVal) && !isNaN(critVal)) {
        if (item.onHand <= critVal) status = "critical";
        else if (item.onHand <= lowVal) status = "low";
      }
      return status === statusFilter;
    });
  }, [items, statusFilter]);

  // Group by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, IngredientData[]> = {};
    filteredItems.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <div className="w-full flex flex-col gap-6 md:gap-10">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="TOTAL STOCKS"
          value={stats.total.toString()}
          subtext="Total tracked items"
          variant="pink"
          icon={<Package size={20} className="text-pink-500" />}
        />
        <StatCard
          title="CRITICAL LEVEL"
          value={stats.critical.toString()}
          subtext="Needs reorder now"
          variant="coral"
          icon={<AlertTriangle size={20} className="text-warning-primary" />}
        />
        <StatCard
          title="LOW STOCKS"
          value={stats.low.toString()}
          subtext="Below threshold"
          variant="yellow"
          icon={<ArrowDownToLine size={20} className="text-brand-primary" />}
        />
        <StatCard
          title="SUFF. STOCKS"
          value={stats.enough.toString()}
          subtext="Within safe range"
          variant="green"
          icon={<CheckCircle2 size={20} className="text-success-primary" />}
        />
      </div>

      {/* Threshold Settings Panel */}
      <div className="bg-white rounded-[24px] border border-[#E5E5E5] overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-brand-primary/10 flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 gap-4 border-b border-[#E5E5E5]">
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-text-primary tracking-wide">
              THRESHOLD SETTINGS
            </h2>
            <p className="b4 text-text-secondary mt-1">
              Manage alert levels for your inventory.
            </p>
          </div>
          <FilterBar
            statusValue={statusFilter}
            onStatusChange={setStatusFilter}
            onAddClick={() => console.log("Add ingredient clicked")}
          />
        </div>

        {/* Responsive Table Wrapper */}
        <div className="w-full p-4 md:p-6">
          <div className="flex flex-col gap-6">
            {/* Table Header (Desktop Only) */}
            <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] items-center gap-6 px-4 pb-2 border-b-2 border-[#E5E5E5]">
              <span className="b3 font-bold text-text-secondary uppercase tracking-wider">
                INGREDIENT
              </span>
              <span className="b3 font-bold text-text-secondary uppercase tracking-wider">
                ON HAND
              </span>
              <span className="b3 font-bold text-text-secondary uppercase tracking-wider text-center">
                LOW LEVEL
              </span>
              <span className="b3 font-bold text-text-secondary uppercase tracking-wider text-center">
                CRITICAL LEVEL
              </span>
              <span className="b3 font-bold text-text-secondary uppercase tracking-wider text-right">
                STATUS
              </span>
            </div>

            {/* Grouped Table Body */}
            {Object.keys(groupedItems).length === 0 ? (
              <div className="py-10 text-center text-text-tertiary b3">
                No ingredients found for this filter.
              </div>
            ) : (
              Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category} className="flex flex-col gap-2">
                  <SectionHeader title={category} />
                  <div className="flex flex-col md:gap-0 gap-3">
                    {categoryItems.map((item) => (
                      <ThresholdRow
                        key={item.id}
                        ingredientName={item.name}
                        unit={item.unit}
                        onHand={item.onHand}
                        lowValue={item.lowValue}
                        criticalValue={item.criticalValue}
                        onLowChange={(val) =>
                          handleUpdateItem(item.id, "lowValue", val)
                        }
                        onCriticalChange={(val) =>
                          handleUpdateItem(item.id, "criticalValue", val)
                        }
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 md:p-6 border-t border-[#E5E5E5] flex flex-col md:flex-row justify-end gap-4 md:items-center bg-slate-50">
          <Button
            variant="ghost"
            shape="rounded"
            size="md"
            className="text-text-secondary font-bold order-2 md:order-1"
            onClick={() => setItems(INITIAL_DATA)}
          >
            Reset Changes
          </Button>
          <Button
            variant="accent"
            shape="rounded"
            size="md"
            className="order-1 md:order-2 w-full md:w-auto"
            disabled={isSaveDisabled}
          >
            Save Thresholds
          </Button>
        </div>
      </div>
    </div>
  );
};
