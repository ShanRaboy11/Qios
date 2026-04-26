"use client";

import React, { useState } from "react";
import { SegmentedControl } from "@/components/molecules/SegmentedControl";
import { AlertBanner } from "@/components/molecules/AlertBanner";
import { Button } from "@/components/atoms/Button";
import { Dropdown } from "@/components/molecules/Dropdown";
import { Badge } from "@/components/atoms/Badge";
import { Input } from "@/components/atoms/Input";
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types & Mock DB ---
export interface MockIngredient {
  id: string;
  name: string;
  baseUnit: string;
  onHand: number;
}

const INGREDIENTS_DB: MockIngredient[] = [
  { id: "1", name: "Pork face/cheek", baseUnit: "g", onHand: 2400 },
  { id: "2", name: "Chili (siling labuyo)", baseUnit: "g", onHand: 180 },
  { id: "3", name: "White onion", baseUnit: "g", onHand: 250 },
  { id: "4", name: "Calamansi", baseUnit: "pcs", onHand: 42 },
  { id: "5", name: "Cooking oil", baseUnit: "mL", onHand: 320 },
  { id: "6", name: "Pork belly", baseUnit: "kg", onHand: 15 },
  { id: "7", name: "Soy Sauce", baseUnit: "L", onHand: 4.5 },
];

const UNIT_OPTIONS = [
  { label: "Grams (g)", value: "g" },
  { label: "Kilograms (kg)", value: "kg" },
  { label: "Milliliters (mL)", value: "mL" },
  { label: "Liters (L)", value: "L" },
  { label: "Pieces (pcs)", value: "pcs" },
];

const INGREDIENT_OPTIONS = INGREDIENTS_DB.map((ing) => ({
  label: ing.name,
  value: ing.id,
}));

// --- Logic Helpers ---
function getIngredient(id: string) {
  return INGREDIENTS_DB.find((i) => i.id === id);
}

function convertToBase(
  qty: number,
  fromUnit: string,
  baseUnit: string,
): number {
  if (fromUnit === baseUnit) return qty;
  // Weight conversions
  if (fromUnit === "kg" && baseUnit === "g") return qty * 1000;
  if (fromUnit === "g" && baseUnit === "kg") return qty / 1000;
  // Volume conversions
  if (fromUnit === "L" && baseUnit === "mL") return qty * 1000;
  if (fromUnit === "mL" && baseUnit === "L") return qty / 1000;
  return qty;
}

function getStatusBadge(estimatedOrders: number) {
  if (isNaN(estimatedOrders))
    return { label: "-", color: "secondary" as const };
  if (estimatedOrders > 10)
    return { label: "Enough", color: "success" as const };
  if (estimatedOrders >= 1) return { label: "Low", color: "error" as const };
  return { label: "Out", color: "primary" as const };
}

// --- Dynamic Recipe Editor Component ---
type RecipeRowState = {
  id: string; // row unique ID
  ingredientId: string | null;
  ingredientName: string;
  qty: string;
  unit: string;
};

interface RecipeEditorProps {
  name: string;
  badgeLabel: string;
  badgeColor: any;
  badgeVariant: any;
  subtext: string;
  headerColorClass: string;
  initialExpanded?: boolean;
  mode: "measurement" | "unit";
  initialRows: RecipeRowState[];
}

const RecipeEditor = ({
  name,
  badgeLabel,
  badgeColor,
  badgeVariant,
  subtext,
  headerColorClass,
  initialExpanded = false,
  mode,
  initialRows,
}: RecipeEditorProps) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [rows, setRows] = useState<RecipeRowState[]>(initialRows);

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: Math.random().toString(36).substring(7),
        ingredientId: null,
        ingredientName: "",
        qty: "1",
        unit: "g",
      },
    ]);
  };

  const updateRow = (
    id: string,
    field: keyof RecipeRowState,
    value: string,
  ) => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id !== id) return row;

        let newRow = { ...row, [field]: value };

        // Auto-select unit when ingredient name matches DB
        if (field === "ingredientName") {
          const ingredient = INGREDIENTS_DB.find(
            (i) => i.name.toLowerCase() === value.toLowerCase(),
          );
          if (ingredient) {
            newRow.ingredientId = ingredient.id;
            newRow.unit = ingredient.baseUnit;
          } else {
            newRow.ingredientId = null;
          }
        }
        return newRow;
      }),
    );
  };

  const removeRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#E5E5E5] mb-6 shadow-sm transition-all text-left">
      {/* Accordion Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "p-4 md:px-6 md:py-4 flex flex-col md:flex-row items-start rounded-t-[24px] overflow-hidden md:items-center justify-between cursor-pointer transition-colors gap-4 md:gap-0",
          headerColorClass,
          isExpanded ? "rounded-t-3xl" : "rounded-[24px]",
        )}
      >
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm overflow-hidden flex items-center justify-center border border-[#E5E5E5]/50 shrink-0">
              {/* Placeholder for image */}
              <div className="w-full h-full bg-slate-200"></div>
            </div>
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                <h3 className="text-lg md:text-xl font-extrabold text-text-primary leading-tight">
                  {name}
                </h3>
                <Badge
                  color={badgeColor}
                  variant={badgeVariant}
                  shape="pill"
                  className="w-fit"
                >
                  {badgeLabel}
                </Badge>
              </div>
              <p className="b4 font-medium text-text-secondary mt-1">
                {subtext}
              </p>
            </div>
          </div>

          <div className="flex md:hidden items-center gap-4 shrink-0">
            <div className="w-2 h-2 rounded-full bg-success-primary"></div>
            {isExpanded ? (
              <ChevronUp className="text-text-secondary" />
            ) : (
              <ChevronDown className="text-text-secondary" />
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 shrink-0">
          <div className="w-2 h-2 rounded-full bg-success-primary"></div>
          {isExpanded ? (
            <ChevronUp className="text-text-secondary" />
          ) : (
            <ChevronDown className="text-text-secondary" />
          )}
        </div>
      </div>

      {/* Accordion Body */}
      {isExpanded && (
        <div className="flex flex-col">
          {/* DESKTOP VIEW: Table */}
          <div className="hidden md:block w-full">
            <div className="w-full border-t border-[#E5E5E5]">
              {/* Table Header */}
              <div
                className={cn(
                  "grid items-center gap-4 px-8 py-3 bg-slate-50 border-b border-[#E5E5E5]",
                  mode === "measurement"
                    ? "grid-cols-[2fr_2fr_1fr_1fr_1fr_auto]" // Qty + Unit are grouped closely or side-by-side explicitly
                    : "grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto]",
                )}
              >
                <span className="b4 font-bold text-text-primary uppercase tracking-wider">
                  INGREDIENT
                </span>
                <span className="b4 font-bold text-text-primary uppercase tracking-wider text-center">
                  {mode === "measurement" ? "QUANTITY & UNIT" : "UNITS/ORDER"}
                </span>
                <span className="b4 font-bold text-text-primary uppercase tracking-wider text-right">
                  ON HAND
                </span>
                <span className="b4 font-bold text-text-primary uppercase tracking-wider text-right">
                  EST. ORDERS
                </span>
                <span className="b4 font-bold text-text-primary uppercase tracking-wider text-right">
                  STATUS
                </span>
                <span className="w-[32px]"></span> {/* Action Col */}
              </div>

              {/* Ingredients List */}
              <div className="flex flex-col px-8">
                {rows.map((row) => {
                  const ingredient = row.ingredientId
                    ? getIngredient(row.ingredientId)
                    : null;

                  // Computations
                  let estimatedOrders = NaN;
                  if (ingredient && Number(row.qty) > 0) {
                    if (mode === "measurement") {
                      const convertedQty = convertToBase(
                        Number(row.qty),
                        row.unit,
                        ingredient.baseUnit,
                      );
                      estimatedOrders = Math.floor(
                        ingredient.onHand / convertedQty,
                      );
                    } else {
                      // Unit-based
                      estimatedOrders = Math.floor(
                        ingredient.onHand / Number(row.qty),
                      );
                    }
                  }
                  const status = getStatusBadge(estimatedOrders);

                  return (
                    <div
                      key={row.id}
                      className={cn(
                        "grid items-center gap-4 py-4 border-b border-[#E5E5E5] last:border-b-0",
                        mode === "measurement"
                          ? "grid-cols-[2fr_2fr_1fr_1fr_1fr_auto]"
                          : "grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto]",
                      )}
                    >
                      {/* Ingredient Dropdown */}
                      <div className="w-full flex items-center">
                        <span className="text-md font-regular text-text-primary">
                          {row.ingredientName || "New Ingredient"}
                        </span>
                      </div>

                      {/* Inputs Column */}
                      <div className="w-full flex items-center justify-center gap-2">
                        {mode === "measurement" ? (
                          <>
                            <div className="w-[100px]">
                              <Input
                                type="number"
                                value={row.qty}
                                onChange={(e) =>
                                  updateRow(row.id, "qty", e.target.value)
                                }
                                className="text-center font-medium"
                                min="0.01"
                                step="0.01"
                              />
                            </div>
                            <div className="w-[140px]">
                              <Dropdown
                                label=""
                                placeholder="Unit"
                                value={row.unit}
                                options={UNIT_OPTIONS}
                                onSelect={(opt) =>
                                  updateRow(row.id, "unit", opt.value)
                                }
                                size="sm"
                                className="text-md font-medium max-w-none"
                              />
                            </div>
                          </>
                        ) : (
                          <div className="w-[120px]">
                            <Input
                              type="number"
                              value={row.qty}
                              onChange={(e) =>
                                updateRow(row.id, "qty", e.target.value)
                              }
                              className="text-center font-medium"
                              min="1"
                              step="1"
                            />
                          </div>
                        )}
                      </div>

                      {/* On Hand Read Only */}
                      <span className="text-md font-medium text-text-secondary text-right">
                        {ingredient
                          ? `${ingredient.onHand} ${ingredient.baseUnit}`
                          : "-"}
                      </span>

                      {/* Est Orders */}
                      <span className="text-xl font-bold text-text-primary text-right">
                        {!isNaN(estimatedOrders) ? estimatedOrders : "-"}
                      </span>

                      {/* Status */}
                      <div className="flex justify-end">
                        {ingredient ? (
                          <Badge
                            color={status.color}
                            variant="subtle"
                            shape="pill"
                          >
                            {status.label}
                          </Badge>
                        ) : (
                          <span></span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeRow(row.id)}
                        className="p-2 text-text-secondary hover:text-brand-accent transition-colors rounded-full hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MOBILE VIEW: Stacked Cards */}
          <div className="flex flex-col md:hidden p-4 gap-4 bg-slate-50 border-t border-[#E5E5E5] w-full">
            {rows.length === 0 && (
              <p className="b4 text-center text-text-secondary py-4">
                No ingredients added yet.
              </p>
            )}

            {rows.map((row, index) => {
              const ingredient = row.ingredientId
                ? getIngredient(row.ingredientId)
                : null;

              let estimatedOrders = NaN;
              if (ingredient && Number(row.qty) > 0) {
                if (mode === "measurement") {
                  const convertedQty = convertToBase(
                    Number(row.qty),
                    row.unit,
                    ingredient.baseUnit,
                  );
                  estimatedOrders = Math.floor(
                    ingredient.onHand / convertedQty,
                  );
                } else {
                  estimatedOrders = Math.floor(
                    ingredient.onHand / Number(row.qty),
                  );
                }
              }
              const status = getStatusBadge(estimatedOrders);

              return (
                <div
                  key={row.id}
                  className="relative bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-sm flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                    <span className="b5 font-bold text-text-secondary uppercase tracking-wider">
                      Ingredient {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      {ingredient && (
                        <Badge
                          color={status.color}
                          variant="subtle"
                          shape="pill"
                          className="text-xs"
                        >
                          {status.label}
                        </Badge>
                      )}
                      <button
                        onClick={() => removeRow(row.id)}
                        className="text-text-secondary hover:text-brand-accent"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="w-full pb-2">
                    <span className="text-lg font-bold text-text-primary">
                      {row.ingredientName || "New Ingredient"}
                    </span>
                  </div>

                  <div className="flex gap-3 w-full">
                    <div className="flex-1">
                      <label className="b5 font-medium text-text-secondary mb-1.5 block">
                        {mode === "measurement" ? "Quantity" : "Units/Order"}
                      </label>
                      <Input
                        type="number"
                        value={row.qty}
                        onChange={(e) =>
                          updateRow(row.id, "qty", e.target.value)
                        }
                        className="text-center font-bold"
                      />
                    </div>
                    {mode === "measurement" && (
                      <div className="flex-1">
                        <Dropdown
                          label="Unit"
                          placeholder="Unit"
                          value={row.unit}
                          options={UNIT_OPTIONS}
                          onSelect={(opt) =>
                            updateRow(row.id, "unit", opt.value)
                          }
                          className="max-w-none"
                        />
                      </div>
                    )}
                  </div>

                  {ingredient && (
                    <div className="flex items-center justify-between bg-[#FAF7F2] p-3 rounded-lg border border-[#E5E5E5]/60 mt-1">
                      <div className="flex flex-col">
                        <span className="b6 uppercase font-bold text-text-secondary">
                          On Hand
                        </span>
                        <span className="b4 font-semibold text-text-primary">
                          {ingredient.onHand} {ingredient.baseUnit}
                        </span>
                      </div>
                      <div className="flex flex-col items-end text-right">
                        <span className="b6 uppercase font-bold text-text-secondary">
                          Est. Orders
                        </span>
                        <span className="text-lg font-extrabold text-brand-primary">
                          {!isNaN(estimatedOrders) ? estimatedOrders : "-"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Ingredients Footer */}
          <div className="px-4 md:px-8 py-5 border-t border-[#E5E5E5] text-center md:text-left bg-white rounded-b-[24px]">
            <Button
              variant="ghost"
              shape="rounded"
              leftIcon={<Plus size={16} />}
              className="text-text-primary font-bold px-0 hover:bg-transparent hover:text-brand-accent w-full md:w-auto"
              onClick={addRow}
            >
              Add Recipe Ingredient
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export const RecipeMatrixView = () => {
  const [segmentedMode, setSegmentedMode] = useState<"measurement" | "unit">(
    "measurement",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const alertMessage =
    segmentedMode === "measurement"
      ? "Uses exact quantities (g, mL, etc.). The system will automatically convert metrics and compute estimated possible orders based on total stock volume."
      : "Uses fixed portions (no measurement). Deducts 1 or more exact item units per order from stock. Ideal for items sold as whole pieces.";

  // Initial mockup rows
  const initialMeasRows: RecipeRowState[] = [
    {
      id: "row1",
      ingredientId: "1",
      ingredientName: "Pork face/cheek",
      qty: "300",
      unit: "g",
    },
    {
      id: "row2",
      ingredientId: "2",
      ingredientName: "Chili (siling labuyo)",
      qty: "10",
      unit: "g",
    },
    {
      id: "row3",
      ingredientId: "3",
      ingredientName: "White onion",
      qty: "50",
      unit: "g",
    },
    {
      id: "row4",
      ingredientId: "4",
      ingredientName: "Calamansi",
      qty: "3",
      unit: "pcs",
    },
  ];

  const initialUnitRows: RecipeRowState[] = [
    {
      id: "u1",
      ingredientId: "6",
      ingredientName: "Pork belly",
      qty: "1",
      unit: "pcs",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Segmented & Alert */}
      <div className="flex flex-col gap-4">
        <SegmentedControl
          options={[
            { label: "Measurement-Based", value: "measurement" },
            { label: "Unit-Based", value: "unit" },
          ]}
          activeValue={segmentedMode}
          onChange={(v) => setSegmentedMode(v as any)}
        />
        <AlertBanner message={alertMessage} />
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full">
        <div className="flex-grow flex items-center px-4 h-[52px] bg-white border border-[#E5E5E5] rounded-xl focus-within:border-brand-primary transition-colors">
          <Search className="text-text-secondary mr-3 w-5 h-5 shrink-0" />
          <input
            type="text"
            placeholder="Search menus (e.g. Pork Sisig)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-full outline-none b3 text-text-primary bg-transparent placeholder:text-text-secondary min-w-[100px]"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button
            variant="outline"
            shape="rounded"
            size="md"
            leftIcon={<Filter size={18} />}
            className="flex-1 md:flex-none border-[#E5E5E5] text-text-primary hover:bg-slate-50 hover:text-text-primary shrink-0 bg-white"
          >
            Filter
          </Button>
          <Button
            variant="accent"
            shape="rounded"
            size="md"
            className="flex-1 md:flex-none shrink-0 font-bold md:px-8"
          >
            Create New Menu Recipe
          </Button>
        </div>
      </div>

      {/* Recipe List */}
      <div className="mt-2">
        {"Pork Sisig".toLowerCase().includes(searchQuery.toLowerCase()) && (
          <RecipeEditor
            name="Pork Sisig"
            badgeLabel="Main"
            badgeColor="accent"
            badgeVariant="outline"
            subtext="Calculates dynamic cost based on actual ingredient weights"
            initialExpanded={true}
            headerColorClass="bg-[#FDD26E]"
            mode={segmentedMode}
            initialRows={
              segmentedMode === "measurement"
                ? initialMeasRows
                : initialUnitRows
            }
          />
        )}

        {"Sinigang na Baboy"
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) && (
          <RecipeEditor
            name="Sinigang na Baboy"
            badgeLabel="Soup"
            badgeColor="info"
            badgeVariant="outline"
            subtext="Rich and sour tamarind soup setup"
            initialExpanded={false}
            headerColorClass="bg-[#FDD26E]"
            mode={segmentedMode}
            initialRows={[]}
          />
        )}

        {"Halo-halo".toLowerCase().includes(searchQuery.toLowerCase()) && (
          <RecipeEditor
            name="Halo-halo"
            badgeLabel="Dessert"
            badgeColor="secondary"
            badgeVariant="outline"
            subtext="Traditional mixed sweet dessert"
            initialExpanded={false}
            headerColorClass="bg-[#FFF4F6]"
            mode={segmentedMode}
            initialRows={[]}
          />
        )}
      </div>
    </div>
  );
};
