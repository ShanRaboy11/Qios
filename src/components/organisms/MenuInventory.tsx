"use client";

import React, { useState } from "react";
import { SearchFilterBar } from "@/components/molecules/SearchFilterBar";

const imgDishPlaceholder =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 240'><rect width='320' height='240' fill='%23FFF9EF'/><rect x='24' y='24' width='272' height='192' rx='16' fill='%23f0ebe1'/><circle cx='160' cy='104' r='36' fill='%23c8bfb0'/><path d='M106 168c16-20 35-30 54-30s38 10 54 30' fill='none' stroke='%23c8bfb0' stroke-width='12' stroke-linecap='round'/><text x='160' y='214' text-anchor='middle' font-family='Arial,sans-serif' font-size='16' fill='%23a09080'>Dish image</text></svg>";

/* ------------------------------------------------------------------ */
/*  Tokens                                                              */
/* ------------------------------------------------------------------ */
const BRAND_AMBER   = "#FFC670";
const BRAND_ACCENT  = "#FF5269";
const EDIT_GRADIENT = "linear-gradient(250deg, #FFD77A 15.53%, #FF5269 84.47%)";

const CARD_SHADOW = `
  0 0 0 1.5px rgba(255,198,112,0.28),
  0 2px 8px rgba(0,0,0,0.05),
  0 6px 24px rgba(255,198,112,0.10)
`;
const CARD_SHADOW_HOVER = `
  0 0 0 2px rgba(255,198,112,0.45),
  0 4px 16px rgba(0,0,0,0.07),
  0 12px 36px rgba(255,198,112,0.18)
`;

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */
interface DishData {
  name: string;
  servings: number;
  status: "High" | "Medium" | "Low";
}

const dishData: DishData[] = [
  { name: "Spicy Seafood Noodles",  servings: 20, status: "High"   },
  { name: "Grilled Chicken Rice",    servings: 15, status: "High"   },
  { name: "Beef Steak Plate",        servings:  8, status: "Medium" },
  { name: "Vegetable Stir Fry",      servings:  3, status: "Low"    },
  { name: "Pork Fried Rice",         servings: 20, status: "High"   },
  { name: "Tom Yum Soup",            servings: 12, status: "High"   },
  { name: "Pad Thai Noodles",        servings:  9, status: "Medium" },
  { name: "Mango Sticky Rice",       servings:  5, status: "Medium" },
  { name: "Green Curry Bowl",        servings:  2, status: "Low"    },
];

const STATUS = {
  High:   { label: "High",   fg: "#14783f", bg: "#dcfce7", dot: "#22c55e" },
  Medium: { label: "Medium", fg: "#6d28d9", bg: "#ede9fe", dot: "#8b5cf6" },
  Low:    { label: "Low",    fg: "#b91c1c", bg: "#fee2e2", dot: "#ef4444" },
};

/* ------------------------------------------------------------------ */
/*  Icons                                                               */
/* ------------------------------------------------------------------ */
const IcoChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IcoFilter = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IcoPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);
const IcoPencil = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M15.232 5.232l3.536 3.536M9 11l-5 5v4h4l5-5M16.5 3.5a2.121 2.121 0 013 3L7 19H4v-3L16.5 3.5z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoInfo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.2"/>
    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Dish Card Shell — amber ring shadow, no border prop                 */
/* ------------------------------------------------------------------ */
function CardShell({ children, className = "", onClick, style = {} }: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-white rounded-[1.25rem] relative overflow-hidden flex flex-col
        transition-transform duration-300 ${hovered ? "-translate-y-1" : ""} ${className}`}
      style={{
        boxShadow: hovered ? CARD_SHADOW_HOVER : CARD_SHADOW,
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Header                                                         */
/* ------------------------------------------------------------------ */
function PageHeader() {
  return (
    <div className="flex items-center gap-4">
      <button
        className="w-9 h-9 rounded-xl flex items-center justify-center bg-white transition-all"
        style={{ boxShadow: CARD_SHADOW, color: "var(--color-text-primary)" }}
      >
        <IcoChevronLeft />
      </button>
      <div className="flex flex-col">
        <h3
          className="font-['Figtree',sans-serif] font-bold leading-tight"
          style={{ fontSize: "26px", color: "var(--color-text-primary)" }}
        >
          Inventory
        </h3>
        <p className="b5 font-medium" style={{ color: "var(--color-text-secondary)" }}>
          Cebu Grill · Menu Items
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Info Banner                                                         */
/* ------------------------------------------------------------------ */
function InfoBanner() {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-5 py-3"
      style={{
        background: `rgba(255,198,112,0.14)`,
        border: `1.5px solid ${BRAND_AMBER}`,
      }}
    >
      <span
        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ background: "rgba(255,198,112,0.3)", color: "#92600a" }}
      >
        <IcoInfo />
      </span>
      <p className="b4" style={{ color: "#5c3d06" }}>
        <strong>Unit-based inventory</strong> — deducts one (1) unit from stock per order placed.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab Toggle                                                          */
/* ------------------------------------------------------------------ */
function TabNav({ active, onChange }: { active: string; onChange: (t: string) => void }) {
  return (
    <div
      className="flex items-center p-1 rounded-[14px] gap-1"
      style={{
        background: "rgba(255,198,112,0.14)",
        border: `1.5px solid ${BRAND_AMBER}`,
      }}
    >
      {["Menu", "Ingredients"].map((tab) => {
        const on = active === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className="px-5 py-[7px] rounded-[10px] b4 font-semibold transition-all duration-200 whitespace-nowrap"
            style={{
              background: on ? BRAND_AMBER : "transparent",
              color: on ? "#3d2000" : "var(--color-text-secondary)",
              boxShadow: on ? "0 2px 8px rgba(255,198,112,0.45)" : "none",
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Toolbar                                                             */
/* ------------------------------------------------------------------ */
function Toolbar({ search, onSearch }: { search: string; onSearch: (v: string) => void }) {
  return (
    <div className="flex w-full items-center justify-end gap-3">
      <SearchFilterBar
        onSearch={onSearch}
        placeholder="Search dishes…"
        searchWidth="380px"
        className="w-auto"
      />

      {/* Add dish — solid amber, NOT gradient */}
      <button
        className="flex shrink-0 items-center gap-2 rounded-2xl px-6 h-[52px] b4 font-bold whitespace-nowrap"
        style={{
          background: BRAND_AMBER,
          color: "#3d2000",
          boxShadow: "0 4px 14px rgba(255,198,112,0.55)",
        }}
      >
        <IcoPlus />
        Add Dish
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dish Card                                                           */
/* ------------------------------------------------------------------ */
function DishCard({ data }: { data: DishData }) {
  const cfg = STATUS[data.status];
  return (
    <CardShell>
      {/* Image area */}
      <div
        className="flex items-center justify-center py-6 px-5"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <img
          src={imgDishPlaceholder}
          alt={data.name}
          className="w-[108px] h-[108px] rounded-xl object-cover"
        />
      </div>

      {/* Thin amber separator */}
      <div style={{ height: "1px", background: "rgba(255,198,112,0.35)" }} />

      {/* Info */}
      <div className="flex flex-col gap-2 px-4 pt-3.5 pb-3 flex-1">
        <p className="b2 font-bold leading-snug" style={{ color: "var(--color-text-primary)" }}>
          {data.name}
        </p>
        <div className="flex items-center justify-between">
          <p className="b5 font-medium" style={{ color: "var(--color-text-secondary)" }}>
            {data.servings} servings left
          </p>
          <span
            className="flex items-center gap-1.5 rounded-full px-2.5 py-[3px]"
            style={{ background: cfg.bg, border: `1.5px solid ${cfg.fg}` }}
          >
            <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: cfg.dot }} />
            <span className="b5 font-bold" style={{ color: cfg.fg, fontSize: "10px" }}>
              {cfg.label}
            </span>
          </span>
        </div>
      </div>

      {/* Edit button — gradient, feels warm not alarming */}
      <button
        className="flex items-center justify-center gap-1.5 mx-4 mb-4 py-2.5 rounded-xl b5 font-bold transition-opacity duration-150 hover:opacity-90"
        style={{
          background: EDIT_GRADIENT,
          color: "white",
          boxShadow: "0 3px 10px rgba(255,82,105,0.28)",
        }}
      >
        <IcoPencil />
        Edit dish
      </button>
    </CardShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Add Dish Card                                                       */
/* ------------------------------------------------------------------ */
function AddDishCard() {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="flex flex-col items-center justify-center rounded-[1.25rem] cursor-pointer transition-all duration-300 gap-3 py-10 px-5"
      style={{
        border: `2px dashed ${hov ? BRAND_ACCENT : BRAND_AMBER}`,
        background: hov ? "rgba(255,198,112,0.08)" : "rgba(255,198,112,0.04)",
        minHeight: "240px",
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200"
        style={{
          background: BRAND_AMBER,
          color: "#3d2000",
          transform: hov ? "scale(1.12)" : "scale(1)",
          boxShadow: hov ? "0 4px 14px rgba(255,198,112,0.55)" : "none",
        }}
      >
        <IcoPlus />
      </div>
      <div className="text-center">
        <p className="b4 font-bold" style={{ color: hov ? BRAND_ACCENT : "#92600a" }}>
          Add new dish
        </p>
        <p className="b5 mt-0.5 font-medium" style={{ color: "var(--color-text-secondary)" }}>
          Click to create
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                             */
/* ------------------------------------------------------------------ */
function DishSection({ title, dishes }: { title: string; dishes: DishData[] }) {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4
          className="font-['Figtree',sans-serif] font-bold"
          style={{ fontSize: "20px", color: "var(--color-text-primary)" }}
        >
          {title}
        </h4>
        <p className="b4 font-semibold" style={{ color: "var(--color-text-secondary)" }}>
          {dishes.length} {dishes.length === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Amber rule */}
      <div
        style={{
          height: "2px",
          borderRadius: "2px",
          background: BRAND_AMBER,
          opacity: 0.5,
        }}
      />

      {/* Grid */}
      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(196px, 1fr))" }}
      >
        <AddDishCard />
        {dishes.map((d, i) => <DishCard key={i} data={d} />)}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                                */
/* ------------------------------------------------------------------ */
export default function MenuInventory() {
  const [tab, setTab]       = useState("Menu");
  const [search, setSearch] = useState("");

  const filtered = dishData.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{
        background: "var(--color-bg-primary)",
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      {/* ── Sticky header ── */}
      <header
        className="sticky top-0 z-30 flex flex-col gap-4 px-10 pt-8 pb-5"
        style={{
          background: "var(--color-bg-primary)",
          borderBottom: `1.5px solid rgba(255,198,112,0.35)`,
        }}
      >
        <PageHeader />
        <InfoBanner />

        {/* Nav row */}
        <div className="flex items-center justify-between gap-4">
          <TabNav active={tab} onChange={setTab} />
          <Toolbar search={search} onSearch={setSearch} />
        </div>
      </header>

      {/* ── Body ── */}
      <main className="flex-1 px-10 py-8 overflow-y-auto">
        {tab === "Menu" ? (
          <DishSection title="Meal" dishes={filtered} />
        ) : (
          <div
            className="flex flex-col items-center justify-center py-32 gap-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <p className="b2 font-bold">Ingredients view</p>
            <p className="b4">Switch to Menu to browse dishes.</p>
          </div>
        )}
      </main>
    </div>
  );
}