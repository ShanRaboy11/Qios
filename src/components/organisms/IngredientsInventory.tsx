"use client";

import React from "react";

const imgRectangle6389 =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96' fill='none'%3E%3Crect width='96' height='96' rx='12' fill='%23F3F4F6'/%3E%3Cpath d='M24 62L38 48L50 58L60 46L72 62V72H24V62Z' fill='%23D1D5DB'/%3E%3Ccircle cx='35' cy='34' r='7' fill='%23D1D5DB'/%3E%3C/svg%3E";

const svgPaths = {
  p29a32100:
    "M7 1.16699C3.78334 1.16699 1.16667 3.78366 1.16667 7.00033C1.16667 10.217 3.78334 12.8337 7 12.8337C10.2167 12.8337 12.8333 10.217 12.8333 7.00033C12.8333 3.78366 10.2167 1.16699 7 1.16699Z",
  p25f52600:
    "M7 0C3.134 0 0 3.134 0 7C0 10.866 3.134 14 7 14C8.474 14 9.843 13.542 10.97 12.765L14.664 16.45C15.054 16.84 15.687 16.84 16.077 16.45C16.467 16.06 16.467 15.427 16.077 15.037L12.365 11.325C13.19 10.19 13.666 8.8 13.666 7C13.666 3.134 10.532 0 7 0ZM7 2C9.76 2 12 4.24 12 7C12 9.76 9.76 12 7 12C4.24 12 2 9.76 2 7C2 4.24 4.24 2 7 2Z",
  p2611f400: "M8.4 0.9V15.9M0.9 8.4H15.9",
  p9b36e80:
    "M13.4063 0.9375C12.7813 0.3125 11.7813 0.3125 11.1563 0.9375L1.2188 10.875L0.75 13.875L3.75 13.4063L13.6875 3.4688C14.3125 2.8438 14.3125 1.8438 13.6875 1.2188L13.4063 0.9375Z",
  pTabShape:
    "M1209 63C1225.57 63 1239 76.4315 1239 93V807H0V63H80C102.308 63 107.532 63 108.141 12.0254C108.22 5.39845 113.578 0 120.205 0H238.795C245.422 0 250.78 5.39845 250.859 12.0254C251.468 63 256.692 63 279 63H1209Z",
};

/* ─── Info Banner ─────────────────────────────────────────── */
function InfoBanner() {
  return (
    <div className="flex items-center justify-center gap-2 w-full bg-[rgba(255,215,122,0.15)] rounded-full py-1.5 px-4">
      <div className="shrink-0 size-[14px] relative">
        <svg
          className="absolute inset-0 size-full"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            d={svgPaths.p29a32100}
            stroke="#FF5269"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 4.7425V7.56"
            stroke="#FF5269"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.9968 9.33333H7.00204"
            stroke="#FF5269"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="font-['Inter',sans-serif] text-[#ff5269] text-[10.24px]">
        Note: Measurement-based inventory deducts stock based on the quantity
        specified per order.
      </p>
    </div>
  );
}

/* ─── Tabs + Search row (inside cream area) ──────────────────── */
export function SearchFilterBar() {
  return (
    <div className="flex items-center justify-end gap-3 w-full">
      <div className="relative bg-white border border-[#e5e7eb] rounded-2xl h-[51px] flex items-center px-5 gap-3 w-[340px]">
        <svg className="shrink-0 w-4 h-4" fill="none" viewBox="0 0 16.67 16.67">
          <path d={svgPaths.p25f52600} fill="#707070" />
        </svg>
        <span className="font-['Inter',sans-serif] text-[#707070] text-[16px]">
          Search
        </span>
      </div>
      <div className="bg-white border border-[#e5e7eb] rounded-2xl h-[51px] flex items-center gap-2 px-4">
        <svg className="shrink-0 size-5" fill="none" viewBox="0 0 20 20">
          <path
            d="M17.67 3.33H11.84"
            stroke="#707070"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
          />
          <path
            d="M8.51 3.33H2.67"
            stroke="#707070"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
          />
          <path
            d="M17.67 10H10.17"
            stroke="#707070"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
          />
          <path
            d="M6.84 10H2.67"
            stroke="#707070"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
          />
          <path
            d="M17.67 16.67H13.51"
            stroke="#707070"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
          />
          <path
            d="M10.17 16.67H2.67"
            stroke="#707070"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
          />
          <path
            d="M11.84 1.67V5"
            stroke="#707070"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
          />
          <path
            d="M6.84 8.33V11.67"
            stroke="#707070"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
          />
          <path
            d="M13.51 15V18.33"
            stroke="#707070"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
          />
        </svg>
        <span className="font-['Inter',sans-serif] text-[#707070] text-[16px]">
          Filters
        </span>
      </div>
    </div>
  );
}

/* ─── Add New Ingredient Slot ─────────────────────────────── */
function AddProduct() {
  return (
    <div className="relative flex-1 min-w-0 flex items-center justify-center h-[67px] rounded-[8px] border-2 border-dashed border-[#ff5269] bg-[rgba(255,82,105,0.05)] pl-3 pr-3 py-1.5">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 16.8 16.8">
          <path
            d={svgPaths.p2611f400}
            stroke="#FF5269"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
        <p className="font-['Inter',sans-serif] font-medium text-[#ff5269] text-[16px]">
          Add new ingredient
        </p>
      </div>
    </div>
  );
}

/* ─── Edit Button ─────────────────────────────────────────── */
function EditButton() {
  return (
    <div className="relative shrink-0 w-[86px] h-[40px]">
      <div className="absolute inset-0 bg-[#ff5269] opacity-25 rounded-[12px]" />
      <div className="relative flex items-center justify-center gap-1.5 h-full">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 15 14.984">
          <path d={svgPaths.p9b36e80} fill="#FF5269" />
        </svg>
        <span className="font-['Inter',sans-serif] text-[#ff5269] text-[12.8px]">
          Edit
        </span>
      </div>
    </div>
  );
}

/* ─── Ingredient Card ─────────────────────────────────────── */
interface IngredientCardData {
  categoryLabel: string;
  categoryColor: string;
  categoryBg: string;
  name: string;
  stock: string;
  status: string;
  statusColor: string;
}

function IngredientCard({ data }: { data: IngredientCardData }) {
  return (
    <div className="relative flex-1 min-w-0 bg-[#ffd77a] border border-[#ff5269] rounded-[8px] h-[67px] flex items-center pl-3 pr-3 py-1.5 gap-6">
      {/* Thumbnail */}
      <div className="shrink-0 size-[50px] rounded-[12px] overflow-hidden">
        <img
          alt={`${data.name} thumbnail`}
          className="w-full h-full object-cover"
          src={imgRectangle6389}
        />
      </div>

      {/* Info */}
      <div className="flex items-end gap-8 flex-1 min-w-0">
        {/* Name + category */}
        <div className="flex flex-col gap-1 min-w-[130px]">
          <div
            className="self-start border rounded-full px-[7px] h-[16px] flex items-center"
            style={{
              backgroundColor: data.categoryBg,
              borderColor: data.categoryColor,
            }}
          >
            <p
              className="font-['Inter',sans-serif] text-[10.24px] whitespace-nowrap"
              style={{ color: data.categoryColor }}
            >
              {data.categoryLabel}
            </p>
          </div>
          <p className="font-['Inter',sans-serif] font-semibold text-[#2d2d2d] text-[16px] leading-tight whitespace-nowrap">
            {data.name}
          </p>
        </div>

        {/* Stock */}
        <div className="flex flex-col gap-1">
          <p className="font-['Inter',sans-serif] text-[#707070] text-[12.8px]">
            In Stock
          </p>
          <p className="font-['Inter',sans-serif] font-semibold text-[#2d2d2d] text-[16px]">
            {data.stock}
          </p>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <p className="font-['Inter',sans-serif] text-[#707070] text-[12.8px]">
            Status
          </p>
          <p
            className="font-['Inter',sans-serif] font-semibold text-[16px]"
            style={{ color: data.statusColor }}
          >
            {data.status}
          </p>
        </div>
      </div>

      <EditButton />
    </div>
  );
}

/* ─── Data ────────────────────────────────────────────────── */
const ingredientData: IngredientCardData[] = [
  {
    categoryLabel: "Meat & Poultry",
    categoryColor: "#8b5cf6",
    categoryBg: "rgba(139,92,246,0.15)",
    name: "Chicken Breast",
    stock: "10 kg",
    status: "High",
    statusColor: "#1fad66",
  },
  {
    categoryLabel: "Fresh Produce",
    categoryColor: "#1fad66",
    categoryBg: "rgba(31,173,102,0.15)",
    name: "Bok Choy",
    stock: "1.5 kg",
    status: "Low",
    statusColor: "rgba(236,19,19,0.9)",
  },
  {
    categoryLabel: "Fresh Produce",
    categoryColor: "#1fad66",
    categoryBg: "rgba(31,173,102,0.15)",
    name: "Tomatoes",
    stock: "2.0 kg",
    status: "Low",
    statusColor: "rgba(236,19,19,0.9)",
  },
  {
    categoryLabel: "Seafood",
    categoryColor: "#1fad66",
    categoryBg: "rgba(31,173,102,0.15)",
    name: "Salmon Fillet",
    stock: "5.0 kg",
    status: "High",
    statusColor: "#1fad66",
  },
  {
    categoryLabel: "Dairy & Eggs",
    categoryColor: "#8b5cf6",
    categoryBg: "rgba(139,92,246,0.15)",
    name: "Eggs (Dozen)",
    stock: "8 units",
    status: "High",
    statusColor: "#1fad66",
  },
  {
    categoryLabel: "Seafood",
    categoryColor: "#1fad66",
    categoryBg: "rgba(31,173,102,0.15)",
    name: "Shrimp",
    stock: "3.5 kg",
    status: "Low",
    statusColor: "rgba(236,19,19,0.9)",
  },
  {
    categoryLabel: "Meat & Poultry",
    categoryColor: "#8b5cf6",
    categoryBg: "rgba(139,92,246,0.15)",
    name: "Ground Beef",
    stock: "12 kg",
    status: "High",
    statusColor: "#1fad66",
  },
  {
    categoryLabel: "Fresh Produce",
    categoryColor: "#1fad66",
    categoryBg: "rgba(31,173,102,0.15)",
    name: "Broccoli",
    stock: "2.5 kg",
    status: "Low",
    statusColor: "rgba(236,19,19,0.9)",
  },
  {
    categoryLabel: "Dairy & Eggs",
    categoryColor: "#8b5cf6",
    categoryBg: "rgba(139,92,246,0.15)",
    name: "Cheddar Cheese",
    stock: "4 kg",
    status: "High",
    statusColor: "#1fad66",
  },
  {
    categoryLabel: "Seafood",
    categoryColor: "#1fad66",
    categoryBg: "rgba(31,173,102,0.15)",
    name: "Crab Meat",
    stock: "2.0 kg",
    status: "Low",
    statusColor: "rgba(236,19,19,0.9)",
  },
  {
    categoryLabel: "Fresh Produce",
    categoryColor: "#1fad66",
    categoryBg: "rgba(31,173,102,0.15)",
    name: "Carrots",
    stock: "3.0 kg",
    status: "High",
    statusColor: "#1fad66",
  },
  {
    categoryLabel: "Meat & Poultry",
    categoryColor: "#8b5cf6",
    categoryBg: "rgba(139,92,246,0.15)",
    name: "Duck Breast",
    stock: "6 kg",
    status: "High",
    statusColor: "#1fad66",
  },
  {
    categoryLabel: "Dairy & Eggs",
    categoryColor: "#8b5cf6",
    categoryBg: "rgba(139,92,246,0.15)",
    name: "Butter",
    stock: "2 kg",
    status: "Low",
    statusColor: "rgba(236,19,19,0.9)",
  },
];

/* ─── Grid ────────────────────────────────────────────────── */
function Grid() {
  const rows: React.ReactNode[] = [];

  // Row 0: Add Product slot + first ingredient card
  rows.push(
    <div key="row-0" className="flex gap-5 w-full">
      <AddProduct />
      <IngredientCard data={ingredientData[0]} />
    </div>,
  );

  // Remaining rows: 2 cards each
  for (let i = 1; i < ingredientData.length; i += 2) {
    const left = ingredientData[i];
    const right = ingredientData[i + 1];
    rows.push(
      <div key={`row-${i}`} className="flex gap-5 w-full">
        <IngredientCard data={left} />
        {right ? (
          <IngredientCard data={right} />
        ) : (
          <div className="flex-1 min-w-0" />
        )}
      </div>,
    );
  }

  return <div className="flex flex-col gap-5 w-full">{rows}</div>;
}

function IngredientContent() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-['Figtree',sans-serif] font-bold text-[#2d2d2d] text-[25px]">
          Ingredients Inventory
        </h3>
        <div className="flex items-center gap-3">
          <div className="relative bg-white border border-[#e5e7eb] rounded-2xl h-[44px] flex items-center px-5 gap-3 w-[340px]">
            <svg
              className="shrink-0 w-4 h-4"
              fill="none"
              viewBox="0 0 16.67 16.67"
            >
              <path d={svgPaths.p25f52600} fill="#707070" />
            </svg>
            <span className="font-['Inter',sans-serif] text-[#707070] text-[16px]">
              Search ingredients
            </span>
          </div>
          <div className="bg-white border border-[#e5e7eb] rounded-2xl h-[44px] flex items-center gap-2 px-4 cursor-pointer">
            <svg className="shrink-0 size-5" fill="none" viewBox="0 0 20 20">
              <path
                d="M17.67 3.33H11.84"
                stroke="#707070"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
              />
              <path
                d="M8.51 3.33H2.67"
                stroke="#707070"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
              />
              <path
                d="M17.67 10H10.17"
                stroke="#707070"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
              />
              <path
                d="M6.84 10H2.67"
                stroke="#707070"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
              />
              <path
                d="M17.67 16.67H13.51"
                stroke="#707070"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
              />
              <path
                d="M10.17 16.67H2.67"
                stroke="#707070"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
              />
              <path
                d="M11.84 1.67V5"
                stroke="#707070"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
              />
              <path
                d="M6.84 8.33V11.67"
                stroke="#707070"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
              />
              <path
                d="M13.51 15V18.33"
                stroke="#707070"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
              />
            </svg>
            <span className="font-['Inter',sans-serif] text-[#707070] text-[16px]">
              Filters
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-9">
        <div className="flex flex-col gap-4">
          <p className="font-['Figtree',sans-serif] text-[#2d2d2d] text-[20px] font-semibold">
            Fresh Produce
          </p>
          <Grid />
        </div>
      </div>
    </div>
  );
}

/* ─── Root export ─────────────────────────────────────────── */
export default function IngredientsInventory() {
  return (
    <div className="w-full flex flex-col gap-6 bg-white rounded-3xl p-6 shadow-sm border border-black/5 mt-8">
      <InfoBanner />
      <IngredientContent />
    </div>
  );
}
