"use client";

import React, { useState, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Tokens                                                              */
/* ------------------------------------------------------------------ */
const AMBER        = "#ffc670";
const AMBER_LIGHT  = "#fff3de";
const AMBER_DARK   = "#92600a";
const ACCENT       = "#ff5269";
const ACCENT_LIGHT = "#fff0f2";
const ACCENT_DARK  = "#b5192e";
const BG           = "#fff9ef";
const INK          = "#2d2d2d";
const MUTED        = "#707070";
const FAINT        = "#b0a898";

const CARD_SHADOW       = "0 0 0 1.5px rgba(255,198,112,0.22), 0 2px 8px rgba(0,0,0,0.04)";
const CARD_SHADOW_HOVER = "0 0 0 2px rgba(255,198,112,0.5),  0 4px 16px rgba(0,0,0,0.07)";

/* ------------------------------------------------------------------ */
/*  Status helpers                                                      */
/* ------------------------------------------------------------------ */
type StatusKey = "high" | "medium" | "low";

const STATUS_CFG: Record<StatusKey, { barColor: string; textColor: string; bgColor: string }> = {
  high:   { barColor: "#1fad66", textColor: "#065f46", bgColor: "#e0fad6" },
  medium: { barColor: "#8b5cf6", textColor: "#4c1d95", bgColor: "#ede9fe" },
  low:    { barColor: "#b91c1c", textColor: "#7f1d1d", bgColor: "#fee2e2" },
};

const DISH_STATUS: Record<StatusKey, { bandBg: string; iconBg: string }> = {
  high:   { bandBg: "#dcfce7", iconBg: "#bbf7d0" },
  medium: { bandBg: "#ede9fe", iconBg: "#ddd6fe" },
  low:    { bandBg: "#fee2e2", iconBg: "#fecaca" },
};

function pctToStatus(pct: number): StatusKey {
  if (pct > 60) return "high";
  if (pct > 30) return "medium";
  return "low";
}

/* ------------------------------------------------------------------ */
/*  Category config                                                     */
/* ------------------------------------------------------------------ */
interface CatCfg { fg: string; bg: string; strip: string; iconBg: string }
const CAT_CFG: Record<string, CatCfg> = {
  "Meat & Poultry": { fg: "#7c3aed", bg: "rgba(139,92,246,0.12)", strip: "#8b5cf6", iconBg: "#ddd6fe" },
  "Fresh Produce":  { fg: "#166534", bg: "rgba(22,163,74,0.1)",   strip: "#22c55e", iconBg: "#bbf7d0" },
  "Seafood":        { fg: "#0369a1", bg: "rgba(14,165,233,0.12)",  strip: "#38bdf8", iconBg: "#bae6fd" },
  "Dairy & Eggs":   { fg: "#92400e", bg: "rgba(245,158,11,0.12)",  strip: "#f59e0b", iconBg: "#fde68a" },
};
const DEFAULT_CAT: CatCfg = { fg: MUTED, bg: "rgba(112,112,112,0.1)", strip: "#b0a898", iconBg: "#e5e7eb" };

/* ------------------------------------------------------------------ */
/*  Data types                                                          */
/* ------------------------------------------------------------------ */
export interface DishData {
  name: string;
  servings: number;
  max: number;
  status: StatusKey;
}

export interface IngredientData {
  cat: string;
  name: string;
  stock: number;
  max: number;
  unit: string;
}

/* ------------------------------------------------------------------ */
/*  Sample data                                                         */
/* ------------------------------------------------------------------ */
const DISH_DATA: DishData[] = [
  { name: "Spicy Seafood Noodles", servings: 20, max: 20, status: "high"   },
  { name: "Grilled Chicken Rice",  servings: 15, max: 20, status: "high"   },
  { name: "Beef Steak Plate",      servings:  8, max: 20, status: "medium" },
  { name: "Vegetable Stir Fry",    servings:  3, max: 20, status: "low"    },
  { name: "Pork Fried Rice",       servings: 20, max: 20, status: "high"   },
  { name: "Tom Yum Soup",          servings: 12, max: 20, status: "high"   },
  { name: "Pad Thai Noodles",      servings:  9, max: 20, status: "medium" },
  { name: "Mango Sticky Rice",     servings:  5, max: 20, status: "medium" },
  { name: "Green Curry Bowl",      servings:  2, max: 20, status: "low"    },
];

const INGREDIENT_DATA: IngredientData[] = [
  { cat: "Meat & Poultry", name: "Chicken Breast",  stock: 10,  max: 15, unit: "kg"    },
  { cat: "Fresh Produce",  name: "Bok Choy",         stock: 1.5, max: 10, unit: "kg"    },
  { cat: "Fresh Produce",  name: "Tomatoes",          stock: 2.0, max: 10, unit: "kg"    },
  { cat: "Seafood",        name: "Salmon Fillet",     stock: 5.0, max: 8,  unit: "kg"    },
  { cat: "Dairy & Eggs",   name: "Eggs (Dozen)",      stock: 8,   max: 12, unit: "units" },
  { cat: "Seafood",        name: "Shrimp",            stock: 3.5, max: 12, unit: "kg"    },
  { cat: "Meat & Poultry", name: "Ground Beef",       stock: 12,  max: 15, unit: "kg"    },
  { cat: "Fresh Produce",  name: "Broccoli",          stock: 2.5, max: 10, unit: "kg"    },
  { cat: "Dairy & Eggs",   name: "Cheddar Cheese",    stock: 4,   max: 6,  unit: "kg"    },
  { cat: "Seafood",        name: "Crab Meat",         stock: 2.0, max: 10, unit: "kg"    },
  { cat: "Fresh Produce",  name: "Carrots",           stock: 3.0, max: 10, unit: "kg"    },
  { cat: "Meat & Poultry", name: "Duck Breast",       stock: 6,   max: 8,  unit: "kg"    },
  { cat: "Dairy & Eggs",   name: "Butter",            stock: 2,   max: 8,  unit: "kg"    },
];

const DISH_ICONS = ["🍜","🍗","🥩","🥦","🍚","🍲","🍝","🍮","🍛"];

/* ------------------------------------------------------------------ */
/*  Icons                                                               */
/* ------------------------------------------------------------------ */
const IcoChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoInfo = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.2"/>
    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);
const IcoSearch = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke={FAINT} strokeWidth="2"/>
    <path d="M21 21l-4.35-4.35" stroke={FAINT} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IcoFilter = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IcoPlus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);
const IcoPencil = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M15.232 5.232l3.536 3.536M9 11l-5 5v4h4l5-5M16.5 3.5a2.121 2.121 0 013 3L7 19H4v-3L16.5 3.5z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoTrash = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoGrid = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3"  y="3"  width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2.5"/>
    <rect x="14" y="3"  width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2.5"/>
    <rect x="3"  y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2.5"/>
  </svg>
);
const IcoList = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);
const IcoImage = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="1.5" opacity="0.5"/>
    <circle cx="9" cy="9" r="2" fill={color} opacity="0.4"/>
    <path d="M3 16l5-5 4 4 3-3 6 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Shared: Stock progress bar                                          */
/* ------------------------------------------------------------------ */
function StockBar({ pct, status, height = 5 }: { pct: number; status: StatusKey; height?: number }) {
  const cfg = STATUS_CFG[status];
  return (
    <div style={{ height, borderRadius: height / 2, background: "rgba(0,0,0,0.07)", overflow: "hidden", flex: 1 }}>
      <div style={{
        height: "100%", borderRadius: height / 2,
        background: cfg.barColor,
        width: `${pct}%`,
        transition: "width .4s",
      }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared: Small icon button                                           */
/* ------------------------------------------------------------------ */
function IconBtn({
  onClick, bg, hoverBg, color, hoverColor, borderColor, children,
}: {
  onClick?: () => void;
  bg: string; hoverBg: string;
  color: string; hoverColor?: string;
  borderColor: string;
  children: React.ReactNode;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30, borderRadius: 8,
        border: `1.5px solid ${borderColor}`,
        background: hov ? hoverBg : bg,
        color: hov && hoverColor ? hoverColor : color,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all .15s", flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

/* ================================================================== */
/*  PAGE HEADER                                                         */
/* ================================================================== */
function PageHeader({ tab }: { tab: "menu" | "ingredients" }) {
  const isIngr = tab === "ingredients";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button style={{
          width: 36, height: 36, borderRadius: 10,
          border: `1.5px solid rgba(255,198,112,0.5)`,
          background: AMBER_LIGHT, color: AMBER_DARK,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0,
        }}>
          <IcoChevronLeft />
        </button>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <span className="b4 font-medium" style={{ color: MUTED }}>Cebu Grill</span>
          </div>
          <div className="h3 font-bold" style={{ color: INK, letterSpacing: -0.5, lineHeight: 1.1 }}>
            Menu Inventory
          </div>
        </div>
      </div>

      {/* Type badge — top right, no stat pills */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 14px", borderRadius: 999,
        border: `1.5px solid ${isIngr ? "rgba(255,82,105,0.5)" : "rgba(255,198,112,0.7)"}`,
        background: isIngr ? "rgba(255,82,105,0.08)" : "rgba(255,198,112,0.15)",
        color: isIngr ? ACCENT_DARK : AMBER_DARK,
      }} className="b5 font-bold">
        <IcoInfo />
        {isIngr ? "Measurement-based" : "Unit-based"}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  INFO BANNER                                                         */
/* ================================================================== */
function InfoBanner({ tab }: { tab: "menu" | "ingredients" }) {
  const text = tab === "ingredients"
    ? "Measurement-based inventory — deducts stock based on the quantity specified per order."
    : "Unit-based inventory — deducts one (1) unit from stock per order placed.";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "rgba(255,215,122,0.18)",
      border: `1.5px solid rgba(255,198,112,0.55)`,
      borderRadius: 999, padding: "8px 18px",
      margin: "0 0 16px",
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%",
        background: "rgba(255,198,112,0.3)", color: AMBER_DARK,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <IcoInfo />
      </div>
      <p className="b4" style={{ color: "#5c3d06", lineHeight: 1.4 }}>{text}</p>
    </div>
  );
}

/* ================================================================== */
/*  TOOLBAR                                                             */
/* ================================================================== */
import { SearchFilterBar } from "@/components/molecules/SearchFilterBar";

function Toolbar({
  tab, search, onSearch,
}: {
  tab: "menu" | "ingredients";
  search: string;
  onSearch: (v: string) => void;
}) {
  const [aHov, setAHov] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div className="
        [&_input]:!h-[40px] [&_input]:!py-0 [&_input]:!pl-[38px] [&_input]:!pr-[14px] 
        [&_input]:!rounded-[10px] [&_input]:!text-[13px] 
        [&_input]:!border-[1.5px]
        [&_.left-5]:!left-[12px] [&_svg]:!w-[18px] [&_svg]:!h-[18px]
        [&_button]:!h-[40px] [&_button]:!px-[14px] [&_button]:!rounded-[10px] [&_button]:!text-[13px] [&_button]:!font-bold
        [&_button]:!border-[1.5px]
        [&_.gap-3]:!gap-[8px]
      ">
        <SearchFilterBar 
          searchWidth="312px"
          placeholder="Search…"
          onSearch={(v) => onSearch(v)}
        />
      </div>

      {/* Add */}
      <button
        onMouseEnter={() => setAHov(true)}
        onMouseLeave={() => setAHov(false)}
        style={{
          height: 40, padding: "0 18px", borderRadius: 10,
          border: "none", background: aHov ? ACCENT_DARK : ACCENT,
          color: "#fff", fontSize: 13, fontWeight: 800,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
          transition: "all .15s", transform: aHov ? "translateY(-1px)" : "none",
        }}
      >
        <IcoPlus /> {tab === "ingredients" ? "Add ingredient" : "Add dish"}
      </button>
    </div>
  );
}

/* ================================================================== */
/*  TAB NAV                                                             */
/* ================================================================== */
function TabNav({
  active, onChange,
}: {
  active: "menu" | "ingredients";
  onChange: (t: "menu" | "ingredients") => void;
}) {
  return (
    <div style={{
      display: "flex", borderRadius: 10, overflow: "hidden",
      border: `1.5px solid rgba(255,198,112,0.5)`,
    }}>
      {(["menu", "ingredients"] as const).map(t => {
        const on = active === t;
        return (
          <button key={t} onClick={() => onChange(t)} style={{
            padding: "8px 22px", fontSize: 13, fontWeight: 700,
            border: "none", background: on ? AMBER : "transparent",
            color: on ? "#ffffff" : MUTED,
            cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap",
          }}>
            {t === "menu" ? "Menu" : "Ingredients"}
          </button>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/*  MENU — DISH CARD                                                    */
/* ================================================================== */
function DishCard({ data, index }: { data: DishData; index: number }) {
  const [hov, setHov] = useState(false);
  const pct  = Math.round((data.servings / data.max) * 100);
  const ds   = DISH_STATUS[data.status];
  const scfg = STATUS_CFG[data.status];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff", borderRadius: 20, overflow: "hidden",
        display: "flex", flexDirection: "column", cursor: "pointer",
        boxShadow: hov ? CARD_SHADOW_HOVER : CARD_SHADOW,
        transform: hov ? "translateY(-3px)" : "none",
        transition: "transform .2s, box-shadow .2s",
      }}
    >
      {/* Colored band + floating emoji icon */}
      <div style={{ height: 86, background: ds.bandBg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
        <div style={{ position: "absolute", bottom: -28, left: "50%", transform: "translateX(-50%)" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            border: "3px solid #fff", background: ds.iconBg,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
          }}>
            {DISH_ICONS[index % DISH_ICONS.length]}
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "38px 16px 0", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 6 }}>
        <div className="b3 font-extrabold" style={{ color: INK, lineHeight: 1.25 }}>{data.name}</div>
        <div className="b4 font-medium" style={{ color: MUTED }}>{data.servings} servings left</div>
        <div style={{ width: "100%", padding: "10px 0 4px" }}>
          <StockBar pct={pct} status={data.status} />
        </div>
      </div>

      {/* Footer actions */}
      <div style={{ display: "flex", marginTop: 12, borderTop: `1.5px solid rgba(255,198,112,0.18)` }}>
        {[
          { label: "Edit",   icon: <IcoPencil />, color: AMBER_DARK, hoverBg: AMBER_LIGHT },
          { label: "Remove", icon: <IcoTrash />,  color: ACCENT,     hoverBg: ACCENT_LIGHT, borderLeft: true },
        ].map(btn => (
          <CfBtn key={btn.label} {...btn} />
        ))}
      </div>
    </div>
  );
}

function CfBtn({ label, icon, color, hoverBg, borderLeft }: {
  label: string; icon: React.ReactNode; color: string; hoverBg: string; borderLeft?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="b4 font-bold"
      style={{
        flex: 1, padding: "14px 0",
        border: "none",
        borderLeft: borderLeft ? `1.5px solid rgba(255,198,112,0.18)` : "none",
        background: hov ? hoverBg : "transparent",
        color, cursor: "pointer", transition: "background .15s",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
      }}
    >
      {icon} {label}
    </button>
  );
}

/* ================================================================== */
/*  MENU — ADD DISH CARD                                                */
/* ================================================================== */
function AddDishCard() {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `2px dashed ${hov ? ACCENT : AMBER}`,
        borderRadius: 20, minHeight: 260,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 12, cursor: "pointer",
        background: hov ? "rgba(255,82,105,0.04)" : "rgba(255,198,112,0.03)",
        transition: "all .2s",
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        border: `2px solid ${hov ? ACCENT : AMBER}`,
        background: hov ? ACCENT : AMBER_LIGHT,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: hov ? "#fff" : AMBER_DARK, transition: "all .2s",
      }}>
        <IcoPlus />
      </div>
      <span className="b3 font-extrabold" style={{ color: hov ? ACCENT : AMBER_DARK, transition: "color .2s" }}>
        Add new dish
      </span>
      <span className="b4" style={{ color: FAINT }}>Click to create</span>
    </div>
  );
}

/* ================================================================== */
/*  MENU — GRID VIEW                                                    */
/* ================================================================== */
function DishGrid({ dishes }: { dishes: DishData[] }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: 16,
    }}>
      <AddDishCard />
      {dishes.map((d, i) => <DishCard key={d.name} data={d} index={i} />)}
    </div>
  );
}

/* ================================================================== */
/*  MENU — LIST VIEW                                                    */
/* ================================================================== */
function DishListRow({ data, index }: { data: DishData; index: number }) {
  const [hov, setHov] = useState(false);
  const pct  = Math.round((data.servings / data.max) * 100);
  const ds   = DISH_STATUS[data.status];
  const scfg = STATUS_CFG[data.status];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? AMBER_LIGHT : "#fff",
        display: "flex", alignItems: "center", gap: 14,
        padding: "13px 18px",
        borderBottom: `1px solid rgba(255,198,112,0.14)`,
        cursor: "pointer", transition: "background .15s",
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: ds.bandBg, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
      }}>
        {DISH_ICONS[index % DISH_ICONS.length]}
      </div>
      <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: INK }}>{data.name}</div>
      <div style={{ width: 80 }}>
        <StockBar pct={pct} status={data.status} />
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, width: 60, textAlign: "right", color: scfg.textColor }}>
        {data.servings} left
      </div>
      <div style={{
        fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999,
        width: 62, textAlign: "center", flexShrink: 0,
        background: scfg.bgColor, color: scfg.textColor,
      }}>
        {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
      </div>
      <IconBtn bg={AMBER_LIGHT} hoverBg={AMBER} color={AMBER_DARK} borderColor="rgba(255,198,112,0.4)">
        <IcoPencil />
      </IconBtn>
    </div>
  );
}

function DishListView({ dishes }: { dishes: DishData[] }) {
  return (
    <div style={{
      borderRadius: 20, overflow: "hidden",
      border: `1.5px solid rgba(255,198,112,0.22)`,
    }}>
      {dishes.map((d, i) => (
        <DishListRow key={d.name} data={d} index={i} />
      ))}
    </div>
  );
}

/* ================================================================== */
/*  MENU TAB                                                            */
/* ================================================================== */
function MenuTab({ dishes }: { dishes: DishData[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  const VBtn = ({ v, icon }: { v: "grid" | "list"; icon: React.ReactNode }) => {
    const on = view === v;
    const [hov, setHov] = useState(false);
    return (
      <button
        onClick={() => setView(v)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width: 40, height: 40, borderRadius: 12,
          border: `1.5px solid rgba(255,198,112,0.4)`,
          background: on || hov ? AMBER : AMBER_LIGHT,
          color: on || hov ? "var(--color-bg-primary)" : AMBER_DARK,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all .15s",
        }}
      >
        {icon}
      </button>
    );
  };

  return (
    <div style={{ padding: "28px 32px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: MUTED, letterSpacing: ".5px", textTransform: "uppercase" }}>
          Meal · {dishes.length} items
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          <VBtn v="grid" icon={<IcoGrid />} />
          <VBtn v="list" icon={<IcoList />} />
        </div>
      </div>
      {view === "grid" ? <DishGrid dishes={dishes} /> : <DishListView dishes={dishes} />}
    </div>
  );
}

/* ================================================================== */
/*  INGREDIENT CARD — stock bar layout                                  */
/* ================================================================== */
function IngredientCard({ data }: { data: IngredientData }) {
  const [hov, setHov] = useState(false);
  const cfg  = CAT_CFG[data.cat] ?? DEFAULT_CAT;
  const pct  = Math.round((data.stock / data.max) * 100);
  const st   = pctToStatus(pct);
  const scfg = STATUS_CFG[st];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff", borderRadius: 14, overflow: "hidden",
        display: "flex", alignItems: "stretch",
        boxShadow: hov ? CARD_SHADOW_HOVER : CARD_SHADOW,
        transform: hov ? "translateY(-1px)" : "none",
        transition: "transform .15s, box-shadow .2s",
        cursor: "pointer",
      }}
    >
      {/* Left colour strip */}
      <div style={{ width: 4, background: cfg.strip, flexShrink: 0 }} />

      {/* Icon box */}
      <div style={{
        width: 60, display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, margin: "14px 0 14px 14px",
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: cfg.iconBg,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <IcoImage color={cfg.fg} />
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0, padding: "14px 16px 14px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Top row: name + stock amount */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{
              display: "inline-flex", alignItems: "center",
              borderRadius: 999, padding: "2px 10px",
              border: `1px solid ${cfg.fg}`, background: cfg.bg,
            }}>
              <span className="b5 font-bold" style={{ color: cfg.fg }}>{data.cat}</span>
            </div>
            <div className="b3 font-extrabold" style={{ color: INK }}>{data.name}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
            <div className="b3 font-extrabold" style={{ color: INK }}>{data.stock} {data.unit}</div>
            <div className="b5 font-medium" style={{ color: MUTED }}>of {data.max} {data.unit}</div>
          </div>
        </div>

        {/* Bar row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <StockBar pct={pct} status={st} height={8} />
          <span className="b5 font-bold" style={{ minWidth: 32, textAlign: "right", color: scfg.textColor }}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 6, padding: "10px 12px 10px 0", flexShrink: 0,
      }}>
        <IconBtn bg={AMBER_LIGHT} hoverBg={AMBER} color={AMBER_DARK} borderColor="rgba(255,198,112,0.45)">
          <IcoPencil />
        </IconBtn>
        <IconBtn
          bg={ACCENT_LIGHT} hoverBg={ACCENT}
          color={ACCENT} hoverColor="#fff"
          borderColor="rgba(255,82,105,0.25)"
        >
          <IcoTrash />
        </IconBtn>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  INGREDIENT CATEGORY SECTION                                         */
/* ================================================================== */
function IngredientSection({ catName, items }: { catName: string; items: IngredientData[] }) {
  const [addHov, setAddHov] = useState(false);
  const cfg = CAT_CFG[catName] ?? DEFAULT_CAT;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Category header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: cfg.fg, fontFamily: "'Figtree', system-ui, sans-serif" }}>
          {catName}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 800, padding: "2px 9px", borderRadius: 999,
          background: cfg.bg, color: cfg.fg,
        }}>
          {items.length}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: 1.5, borderRadius: 2, background: cfg.strip, opacity: 0.35, marginBottom: 2 }} />

      {/* Ingredient cards */}
      {items.map(item => <IngredientCard key={item.name} data={item} />)}

      {/* Add ingredient row */}
      <div
        onMouseEnter={() => setAddHov(true)}
        onMouseLeave={() => setAddHov(false)}
        style={{
          border: `2px dashed ${addHov ? ACCENT : "rgba(255,198,112,0.45)"}`,
          borderRadius: 14,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "12px 18px", cursor: "pointer",
          background: addHov ? "rgba(255,82,105,0.04)" : "rgba(255,198,112,0.03)",
          transition: "all .2s", marginTop: 2,
        }}
      >
        <div style={{
          width: 26, height: 26, borderRadius: 8,
          border: `1.5px solid ${addHov ? ACCENT : AMBER}`,
          background: addHov ? ACCENT : AMBER_LIGHT,
          color: addHov ? "#fff" : AMBER_DARK,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .2s", flexShrink: 0,
        }}>
          <IcoPlus />
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: addHov ? ACCENT : AMBER_DARK, transition: "color .2s" }}>
          Add {catName.toLowerCase()} ingredient
        </span>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  INGREDIENTS TAB                                                     */
/* ================================================================== */
function IngredientsTab({ ingredients }: { ingredients: IngredientData[] }) {
  const grouped = useMemo(() => {
    const m: Record<string, IngredientData[]> = {};
    ingredients.forEach(i => { if (!m[i.cat]) m[i.cat] = []; m[i.cat].push(i); });
    return m;
  }, [ingredients]);

  return (
    <div style={{ padding: "28px 32px 40px", display: "flex", flexDirection: "column", gap: 28 }}>
      {Object.entries(grouped).map(([cat, items]) => (
        <IngredientSection key={cat} catName={cat} items={items} />
      ))}
    </div>
  );
}

/* ================================================================== */
/*  ROOT                                                                */
/* ================================================================== */
export default function MenuInventory() {
  const [tab,    setTab]    = useState<"menu" | "ingredients">("menu");
  const [search, setSearch] = useState("");

  const filteredDishes = useMemo(() =>
    DISH_DATA.filter(d => d.name.toLowerCase().includes(search.toLowerCase())),
    [search]);

  const filteredIngredients = useMemo(() =>
    INGREDIENT_DATA.filter(i =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.cat.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const handleTabChange = (t: "menu" | "ingredients") => {
    setTab(t);
    setSearch("");
  };

  return (
    <div className="bg-bg-primary min-h-screen font-inter text-text-primary p-4 md:p-6 lg:p-20">

      {/* ── Sticky header ── */}
      <header style={{
        background: "#fff",
        borderBottom: `1.5px solid rgba(255,198,112,0.25)`,
        padding: "24px 32px 0",
        position: "sticky", top: 0, zIndex: 30,
      }}>
        <PageHeader tab={tab} />
        <InfoBanner tab={tab} />

        {/* Tab + Toolbar row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <TabNav active={tab} onChange={handleTabChange} />
          <Toolbar tab={tab} search={search} onSearch={setSearch} />
        </div>
        <div style={{ height: 14 }} />
      </header>

      {/* ── Body ── */}
      {tab === "menu"
        ? <MenuTab        dishes={filteredDishes} />
        : <IngredientsTab ingredients={filteredIngredients} />
      }
    </div>
  );
}