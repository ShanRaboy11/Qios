"use client";

import React, { useState, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Tokens                                                              */
/* ------------------------------------------------------------------ */
const AMBER = "#ffc670";
const AMBER_LIGHT = "#fff3de";
const AMBER_DARK = "#92600a";
const ACCENT = "#ff5269";
const ACCENT_LIGHT = "#fff0f2";
const ACCENT_DARK = "#b5192e";
const INK = "#2d2d2d";
const MUTED = "#707070";
const FAINT = "#b0a898";

const CARD_SHADOW =
  "0 0 0 1.5px rgba(255,198,112,0.22), 0 2px 8px rgba(0,0,0,0.04)";
const CARD_SHADOW_HOVER =
  "0 0 0 2px rgba(255,198,112,0.5),  0 4px 16px rgba(0,0,0,0.07)";

/* ------------------------------------------------------------------ */
/*  Stock-level color palette                                           */
/* ------------------------------------------------------------------ */
const STOCK_COLORS = {
  high: {
    band: "#e0f2fe",
    icon: "#bae6fd",
    bar: "#0ea5e9",
    text: "#075985",
    badge: "#e0f2fe",
  },
  medium: {
    band: "#dcfce7",
    icon: "#bbf7d0",
    bar: "#22c55e",
    text: "#166534",
    badge: "#dcfce7",
  },
  low: {
    band: "#fee2e2",
    icon: "#fecaca",
    bar: "#ef4444",
    text: "#7f1d1d",
    badge: "#fee2e2",
  },
};

type StatusKey = "high" | "medium" | "low";

function pctToStatus(pct: number): StatusKey {
  if (pct > 60) return "high";
  if (pct > 30) return "medium";
  return "low";
}

/* ------------------------------------------------------------------ */
/*  Category config                                                     */
/* ------------------------------------------------------------------ */
interface CatCfg {
  fg: string;
  bg: string;
  strip: string;
  iconBg: string;
  emoji: string;
}
const CAT_CFG: Record<string, CatCfg> = {
  "Meat & Poultry": {
    fg: "#92400e",
    bg: "rgba(245,158,11,0.12)",
    strip: "#f59e0b",
    iconBg: "#ddd6fe",
    emoji: "🥩",
  },
  "Fresh Produce": {
    fg: "#92400e",
    bg: "rgba(245,158,11,0.12)",
    strip: "#f59e0b",
    iconBg: "#bbf7d0",
    emoji: "🥦",
  },
  Seafood: {
    fg: "#92400e",
    bg: "rgba(245,158,11,0.12)",
    strip: "#f59e0b",
    iconBg: "#bae6fd",
    emoji: "🦐",
  },
  "Dairy & Eggs": {
    fg: "#92400e",
    bg: "rgba(245,158,11,0.12)",
    strip: "#f59e0b",
    iconBg: "#fde68a",
    emoji: "🥚",
  },
};
const DEFAULT_CAT: CatCfg = {
  fg: MUTED,
  bg: "rgba(112,112,112,0.1)",
  strip: "#b0a898",
  iconBg: "#e5e7eb",
  emoji: "📦",
};

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

type ModalAction =
  | { type: "add-dish" }
  | { type: "add-ingredient"; cat?: string }
  | { type: "edit-dish"; data: DishData }
  | { type: "edit-ingredient"; data: IngredientData }
  | { type: "remove-dish"; data: DishData }
  | { type: "remove-ingredient"; data: IngredientData }
  | { type: "view-dish"; data: DishData; index: number }
  | { type: "view-ingredient"; data: IngredientData };

/* ------------------------------------------------------------------ */
/*  Sample data                                                         */
/* ------------------------------------------------------------------ */
const DISH_DATA: DishData[] = [
  { name: "Spicy Seafood Noodles", servings: 20, max: 20, status: "high" },
  { name: "Grilled Chicken Rice", servings: 15, max: 20, status: "high" },
  { name: "Beef Steak Plate", servings: 8, max: 20, status: "medium" },
  { name: "Vegetable Stir Fry", servings: 3, max: 20, status: "low" },
  { name: "Pork Fried Rice", servings: 20, max: 20, status: "high" },
  { name: "Tom Yum Soup", servings: 12, max: 20, status: "high" },
  { name: "Pad Thai Noodles", servings: 9, max: 20, status: "medium" },
  { name: "Mango Sticky Rice", servings: 5, max: 20, status: "medium" },
  { name: "Green Curry Bowl", servings: 2, max: 20, status: "low" },
];

const INGREDIENT_DATA: IngredientData[] = [
  {
    cat: "Meat & Poultry",
    name: "Chicken Breast",
    stock: 10,
    max: 15,
    unit: "kg",
  },
  { cat: "Fresh Produce", name: "Bok Choy", stock: 1.5, max: 10, unit: "kg" },
  { cat: "Fresh Produce", name: "Tomatoes", stock: 2.0, max: 10, unit: "kg" },
  { cat: "Seafood", name: "Salmon Fillet", stock: 5.0, max: 8, unit: "kg" },
  {
    cat: "Dairy & Eggs",
    name: "Eggs (Dozen)",
    stock: 8,
    max: 12,
    unit: "units",
  },
  { cat: "Seafood", name: "Shrimp", stock: 3.5, max: 12, unit: "kg" },
  {
    cat: "Meat & Poultry",
    name: "Ground Beef",
    stock: 12,
    max: 15,
    unit: "kg",
  },
  { cat: "Fresh Produce", name: "Broccoli", stock: 2.5, max: 10, unit: "kg" },
  { cat: "Dairy & Eggs", name: "Cheddar Cheese", stock: 4, max: 6, unit: "kg" },
  { cat: "Seafood", name: "Crab Meat", stock: 2.0, max: 10, unit: "kg" },
  { cat: "Fresh Produce", name: "Carrots", stock: 3.0, max: 10, unit: "kg" },
  { cat: "Meat & Poultry", name: "Duck Breast", stock: 6, max: 8, unit: "kg" },
  { cat: "Dairy & Eggs", name: "Butter", stock: 2, max: 8, unit: "kg" },
];

const DISH_ICONS = ["🍜", "🍗", "🥩", "🥦", "🍚", "🍲", "🍝", "🍮", "🍛"];

/* ------------------------------------------------------------------ */
/*  Icons                                                               */
/* ------------------------------------------------------------------ */
const IcoChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 18l-6-6 6-6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IcoChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IcoInfo = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.2" />
    <path
      d="M12 8v4M12 16h.01"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);
const IcoSearch = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke={FAINT} strokeWidth="2" />
    <path
      d="M21 21l-4.35-4.35"
      stroke={FAINT}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const IcoPlus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
const IcoPencil = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path
      d="M15.232 5.232l3.536 3.536M9 11l-5 5v4h4l5-5M16.5 3.5a2.121 2.121 0 013 3L7 19H4v-3L16.5 3.5z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IcoTrash = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IcoGrid = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="2.5"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="2.5"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="2.5"
    />
    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="2.5"
    />
  </svg>
);
const IcoList = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
const IcoX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
const IcoWarning = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 9v4M12 17h.01"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Shared: Stock progress bar                                          */
/* ------------------------------------------------------------------ */
function StockBar({
  pct,
  status,
  height = 5,
}: {
  pct: number;
  status: StatusKey;
  height?: number;
}) {
  const cfg = STOCK_COLORS[status];
  return (
    <div
      style={{
        height,
        borderRadius: height / 2,
        background: "rgba(0,0,0,0.07)",
        overflow: "hidden",
        flex: 1,
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: height / 2,
          background: cfg.bar,
          width: `${pct}%`,
          transition: "width .4s",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared: Small icon button                                           */
/* ------------------------------------------------------------------ */
function IconBtn({
  onClick,
  bg,
  hoverBg,
  color,
  hoverColor,
  borderColor,
  children,
}: {
  onClick?: (e: React.MouseEvent) => void;
  bg: string;
  hoverBg: string;
  color: string;
  hoverColor?: string;
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
        width: 30,
        height: 30,
        borderRadius: 8,
        border: `1.5px solid ${borderColor}`,
        background: hov ? hoverBg : bg,
        color: hov && hoverColor ? hoverColor : color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all .15s",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared: View toggle (grid / list)                                   */
/* ------------------------------------------------------------------ */
function ViewToggle({
  view,
  setView,
}: {
  view: "grid" | "list";
  setView: (v: "grid" | "list") => void;
}) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {(["grid", "list"] as const).map((v) => {
        const on = view === v;
        const [hov, setHov] = useState(false);
        return (
          <button
            key={v}
            onClick={() => setView(v)}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: `1.5px solid rgba(255,198,112,0.4)`,
              background: on || hov ? AMBER : AMBER_LIGHT,
              color: on || hov ? "#fff" : AMBER_DARK,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            {v === "grid" ? <IcoGrid /> : <IcoList />}
          </button>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/*  MODALS                                                              */
/* ================================================================== */

function ModalOverlay({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function ModalCloseBtn({ onClose }: { onClose: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClose}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        border: `1.5px solid rgba(255,198,112,0.4)`,
        background: hov ? AMBER_LIGHT : "#fff",
        color: AMBER_DARK,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all .15s",
        flexShrink: 0,
      }}
    >
      <IcoX />
    </button>
  );
}

function ConfirmModal({
  title,
  message,
  confirmLabel,
  confirmColor,
  onConfirm,
  onClose,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [hov, setHov] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  return (
    <ModalOverlay onClose={onClose}>
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "min(400px, 90vw)",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            padding: "28px 28px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: confirmColor === ACCENT ? ACCENT_LIGHT : AMBER_LIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: confirmColor,
            }}
          >
            <IcoWarning />
          </div>
          <div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: INK,
                marginBottom: 6,
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
              {message}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            padding: "0 28px 24px",
          }}
        >
          <button
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={onClose}
            style={{
              flex: 1,
              height: 42,
              borderRadius: 10,
              border: `1.5px solid rgba(255,198,112,0.5)`,
              background: cancelHov ? AMBER_LIGHT : "#fff",
              color: AMBER_DARK,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            Cancel
          </button>
          <button
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            onClick={onConfirm}
            style={{
              flex: 1,
              height: 42,
              borderRadius: 10,
              border: "none",
              background: hov
                ? confirmColor === ACCENT
                  ? ACCENT_DARK
                  : AMBER_DARK
                : confirmColor,
              color: "#fff",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

function ModalField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: MUTED,
          letterSpacing: ".6px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          height: 42,
          padding: "0 14px",
          borderRadius: 10,
          border: `1.5px solid ${focused ? AMBER : "rgba(255,198,112,0.45)"}`,
          boxShadow: focused ? `0 0 0 3px rgba(255,198,112,0.18)` : "none",
          fontSize: 13,
          outline: "none",
          fontFamily: "inherit",
          color: INK,
          background: "#fff",
          transition: "border .15s, box-shadow .15s",
        }}
      />
      {hint && <span style={{ fontSize: 11, color: FAINT }}>{hint}</span>}
    </div>
  );
}

function FormModal({
  title,
  fields,
  submitLabel,
  submitColor,
  onSubmit,
  onClose,
  icon,
}: {
  title: string;
  fields: Array<{
    label: string;
    placeholder: string;
    type?: string;
    hint?: string;
  }>;
  submitLabel: string;
  submitColor?: string;
  onSubmit: () => void;
  onClose: () => void;
  icon?: React.ReactNode;
}) {
  const [values, setValues] = useState<string[]>(fields.map(() => ""));
  const [hov, setHov] = useState(false);
  const btnBg = submitColor ?? ACCENT;
  const btnHov = submitColor === AMBER ? AMBER_DARK : ACCENT_DARK;
  return (
    <ModalOverlay onClose={onClose}>
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "min(440px, 92vw)",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "20px 24px 18px",
            borderBottom: `1.5px solid rgba(255,198,112,0.2)`,
          }}
        >
          {icon && (
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: AMBER_LIGHT,
                color: AMBER_DARK,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: INK }}>
              {title}
            </div>
          </div>
          <ModalCloseBtn onClose={onClose} />
        </div>
        <div
          style={{
            padding: "20px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {fields.map((f, i) => (
            <ModalField
              key={f.label}
              label={f.label}
              value={values[i]}
              onChange={(v) =>
                setValues((prev) => {
                  const n = [...prev];
                  n[i] = v;
                  return n;
                })
              }
              placeholder={f.placeholder}
              type={f.type}
              hint={f.hint}
            />
          ))}
          <button
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            onClick={onSubmit}
            style={{
              height: 44,
              borderRadius: 10,
              border: "none",
              background: hov ? btnHov : btnBg,
              color: "#fff",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              transition: "all .15s",
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

function EditDishModal({
  data,
  onClose,
}: {
  data: DishData;
  onClose: () => void;
}) {
  const pct = Math.round((data.servings / data.max) * 100);
  const sc = STOCK_COLORS[data.status];

  const [name, setName] = useState(data.name);
  const [maxSrv, setMaxSrv] = useState(String(data.max));
  const [currSrv, setCurrSrv] = useState(String(data.servings));
  const [hov, setHov] = useState(false);

  const previewPct = Math.min(
    100,
    Math.max(
      0,
      maxSrv && currSrv
        ? Math.round((parseFloat(currSrv) / parseFloat(maxSrv)) * 100)
        : pct,
    ),
  );
  const previewStatus = pctToStatus(previewPct);
  const previewSc = STOCK_COLORS[previewStatus];

  return (
    <ModalOverlay onClose={onClose}>
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "min(460px, 94vw)",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            background: previewSc.band,
            padding: "20px 24px 16px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "3px solid #fff",
              background: previewSc.icon,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            🍽️
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: previewSc.text,
                marginBottom: 2,
                opacity: 0.7,
              }}
            >
              Editing dish
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: INK,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {name || data.name}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 6,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: "rgba(0,0,0,0.1)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${previewPct}%`,
                    background: previewSc.bar,
                    borderRadius: 2,
                    transition: "width .3s",
                  }}
                />
              </div>
              <span
                style={{ fontSize: 11, fontWeight: 800, color: previewSc.text }}
              >
                {previewPct}%
              </span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.6)",
                  color: previewSc.text,
                  textTransform: "uppercase",
                }}
              >
                {previewStatus}
              </span>
            </div>
          </div>
          <div style={{ position: "absolute", top: 14, right: 14 }}>
            <ModalCloseBtn onClose={onClose} />
          </div>
        </div>

        <div
          style={{
            padding: "20px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <ModalField
            label="Dish Name"
            value={name}
            onChange={setName}
            placeholder="e.g. Adobo Fried Rice"
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <ModalField
              label="Current Stock"
              value={currSrv}
              onChange={setCurrSrv}
              placeholder={String(data.servings)}
              type="number"
              hint="servings available"
            />
            <ModalField
              label="Max Servings"
              value={maxSrv}
              onChange={setMaxSrv}
              placeholder={String(data.max)}
              type="number"
              hint="total capacity"
            />
          </div>
          <button
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            onClick={onClose}
            style={{
              height: 44,
              borderRadius: 10,
              border: "none",
              background: hov ? AMBER_DARK : AMBER,
              color: "#fff",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              transition: "all .15s",
              marginTop: 4,
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

function EditIngredientModal({
  data,
  onClose,
}: {
  data: IngredientData;
  onClose: () => void;
}) {
  const cfg = CAT_CFG[data.cat] ?? DEFAULT_CAT;
  const pct = Math.round((data.stock / data.max) * 100);

  const [iname, setIname] = useState(data.name);
  const [unit, setUnit] = useState(data.unit);
  const [maxSt, setMaxSt] = useState(String(data.max));
  const [currSt, setCurrSt] = useState(String(data.stock));
  const [hov, setHov] = useState(false);

  const previewPct = Math.min(
    100,
    Math.max(
      0,
      maxSt && currSt
        ? Math.round((parseFloat(currSt) / parseFloat(maxSt)) * 100)
        : pct,
    ),
  );
  const previewStatus = pctToStatus(previewPct);
  const previewSc = STOCK_COLORS[previewStatus];

  return (
    <ModalOverlay onClose={onClose}>
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "min(460px, 94vw)",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            background: previewSc.band,
            padding: "20px 24px 16px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "3px solid #fff",
              background: previewSc.icon,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {cfg.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: cfg.fg,
                marginBottom: 2,
              }}
            >
              {data.cat}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: INK,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {iname || data.name}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 6,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: "rgba(0,0,0,0.1)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${previewPct}%`,
                    background: previewSc.bar,
                    borderRadius: 2,
                    transition: "width .3s",
                  }}
                />
              </div>
              <span
                style={{ fontSize: 11, fontWeight: 800, color: previewSc.text }}
              >
                {previewPct}%
              </span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.6)",
                  color: previewSc.text,
                  textTransform: "uppercase",
                }}
              >
                {previewStatus}
              </span>
            </div>
          </div>
          <div style={{ position: "absolute", top: 14, right: 14 }}>
            <ModalCloseBtn onClose={onClose} />
          </div>
        </div>

        <div
          style={{
            padding: "20px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 12,
              alignItems: "end",
            }}
          >
            <ModalField
              label="Ingredient Name"
              value={iname}
              onChange={setIname}
              placeholder="e.g. Pork Belly"
            />
            <div style={{ width: 90 }}>
              <ModalField
                label="Unit"
                value={unit}
                onChange={setUnit}
                placeholder="kg / units"
              />
            </div>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <ModalField
              label="Current Stock"
              value={currSt}
              onChange={setCurrSt}
              placeholder={String(data.stock)}
              type="number"
              hint={`currently ${data.stock} ${data.unit}`}
            />
            <ModalField
              label="Max Stock"
              value={maxSt}
              onChange={setMaxSt}
              placeholder={String(data.max)}
              type="number"
              hint={`max was ${data.max} ${data.unit}`}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 10,
              background: previewSc.band,
              border: `1.5px solid ${previewSc.icon}`,
            }}
          >
            <div
              style={{
                flex: 1,
                fontSize: 12,
                color: previewSc.text,
                fontWeight: 600,
              }}
            >
              Stock after save:{" "}
              <strong>
                {currSt || data.stock} / {maxSt || data.max} {unit || data.unit}
              </strong>
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: 999,
                background: previewSc.icon,
                color: previewSc.text,
                textTransform: "uppercase",
              }}
            >
              {previewStatus}
            </span>
          </div>
          <button
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            onClick={onClose}
            style={{
              height: 44,
              borderRadius: 10,
              border: "none",
              background: hov ? AMBER_DARK : AMBER,
              color: "#fff",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

/* ------------------------------------------------------------------ */
/*  Dish detail modal — stock level bar REMOVED                        */
/* ------------------------------------------------------------------ */
function DishDetailModal({
  data,
  index,
  onClose,
}: {
  data: DishData;
  index: number;
  onClose: () => void;
}) {
  const pct = Math.round((data.servings / data.max) * 100);
  const sc = STOCK_COLORS[data.status];
  return (
    <ModalOverlay onClose={onClose}>
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          width: "min(360px, 92vw)",
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
        }}
      >
        {/* Band */}
        <div
          style={{
            height: 110,
            background: sc.band,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", top: 12, right: 12 }}>
            <ModalCloseBtn onClose={onClose} />
          </div>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              border: "3px solid #fff",
              background: sc.icon,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              marginTop: 20,
            }}
          >
            {DISH_ICONS[index % DISH_ICONS.length]}
          </div>
        </div>
        {/* Body */}
        <div
          style={{
            padding: "24px 28px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 800, color: INK }}>
            {data.name}
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              padding: "4px 14px",
              borderRadius: 999,
              background: sc.badge,
              color: sc.text,
              textTransform: "uppercase",
              letterSpacing: ".5px",
            }}
          >
            {data.status} stock
          </div>
          {/* Stats row */}
          <div
            style={{ display: "flex", gap: 16, width: "100%", marginTop: 6 }}
          >
            {[
              { label: "Servings Left", val: `${data.servings}` },
              { label: "Max Capacity", val: `${data.max}` },
              { label: "Availability", val: `${pct}%` },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  flex: 1,
                  background: "#fff9ef",
                  borderRadius: 12,
                  padding: "12px 8px",
                  textAlign: "center",
                  border: `1.5px solid rgba(255,198,112,0.3)`,
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 800, color: INK }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 10, color: MUTED, marginTop: 3 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          {/* Stock level bar REMOVED */}
        </div>
      </div>
    </ModalOverlay>
  );
}

/* ------------------------------------------------------------------ */
/*  Ingredient detail modal — stock level bar REMOVED                  */
/* ------------------------------------------------------------------ */
function IngredientDetailModal({
  data,
  onClose,
}: {
  data: IngredientData;
  onClose: () => void;
}) {
  const cfg = CAT_CFG[data.cat] ?? DEFAULT_CAT;
  const pct = Math.round((data.stock / data.max) * 100);
  const st = pctToStatus(pct);
  const sc = STOCK_COLORS[st];
  return (
    <ModalOverlay onClose={onClose}>
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          width: "min(360px, 92vw)",
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            height: 110,
            background: sc.band,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", top: 12, right: 12 }}>
            <ModalCloseBtn onClose={onClose} />
          </div>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              border: "3px solid #fff",
              background: sc.icon,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              marginTop: 20,
            }}
          >
            {cfg.emoji}
          </div>
        </div>
        <div
          style={{
            padding: "24px 28px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 800, color: INK }}>
            {data.name}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: cfg.fg }}>
            {data.cat}
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              padding: "4px 14px",
              borderRadius: 999,
              background: sc.badge,
              color: sc.text,
              textTransform: "uppercase",
              letterSpacing: ".5px",
            }}
          >
            {st} stock
          </div>
          <div
            style={{ display: "flex", gap: 16, width: "100%", marginTop: 6 }}
          >
            {[
              { label: "In Stock", val: `${data.stock} ${data.unit}` },
              { label: "Max Storage", val: `${data.max} ${data.unit}` },
              { label: "Level", val: `${pct}%` },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  flex: 1,
                  background: "#fff9ef",
                  borderRadius: 12,
                  padding: "12px 8px",
                  textAlign: "center",
                  border: `1.5px solid rgba(255,198,112,0.3)`,
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 800, color: INK }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 10, color: MUTED, marginTop: 3 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          {/* Stock level bar REMOVED */}
        </div>
      </div>
    </ModalOverlay>
  );
}

function ModalController({
  action,
  onClose,
}: {
  action: ModalAction | null;
  onClose: () => void;
}) {
  if (!action) return null;

  if (action.type === "add-dish")
    return (
      <FormModal
        title="Add New Dish"
        fields={[
          { label: "DISH NAME", placeholder: "e.g. Adobo Fried Rice" },
          { label: "MAX SERVINGS", placeholder: "e.g. 20", type: "number" },
          { label: "CURRENT STOCK", placeholder: "e.g. 15", type: "number" },
        ]}
        submitLabel="Add Dish"
        onSubmit={onClose}
        onClose={onClose}
      />
    );

  if (action.type === "add-ingredient")
    return (
      <FormModal
        title={`Add Ingredient${action.cat ? ` — ${action.cat}` : ""}`}
        fields={[
          { label: "INGREDIENT NAME", placeholder: "e.g. Pork Belly" },
          { label: "UNIT", placeholder: "e.g. kg, units" },
          { label: "MAX STOCK", placeholder: "e.g. 15", type: "number" },
          { label: "CURRENT STOCK", placeholder: "e.g. 10", type: "number" },
        ]}
        submitLabel="Add Ingredient"
        onSubmit={onClose}
        onClose={onClose}
      />
    );

  if (action.type === "edit-dish")
    return <EditDishModal data={action.data} onClose={onClose} />;

  if (action.type === "edit-ingredient")
    return <EditIngredientModal data={action.data} onClose={onClose} />;

  if (action.type === "remove-dish")
    return (
      <ConfirmModal
        title="Remove Dish"
        message={`Are you sure you want to remove "${action.data.name}" from the menu? This action cannot be undone.`}
        confirmLabel="Yes, Remove"
        confirmColor={ACCENT}
        onConfirm={onClose}
        onClose={onClose}
      />
    );

  if (action.type === "remove-ingredient")
    return (
      <ConfirmModal
        title="Remove Ingredient"
        message={`Are you sure you want to remove "${action.data.name}" from inventory? This action cannot be undone.`}
        confirmLabel="Yes, Remove"
        confirmColor={ACCENT}
        onConfirm={onClose}
        onClose={onClose}
      />
    );

  if (action.type === "view-dish")
    return (
      <DishDetailModal
        data={action.data}
        index={action.index}
        onClose={onClose}
      />
    );

  if (action.type === "view-ingredient")
    return <IngredientDetailModal data={action.data} onClose={onClose} />;

  return null;
}

/* ================================================================== */
/*  PAGE HEADER                                                         */
/* ================================================================== */
function PageHeader({ tab }: { tab: "menu" | "ingredients" }) {
  const isIngr = tab === "ingredients";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: `1.5px solid rgba(255,198,112,0.5)`,
            background: AMBER_LIGHT,
            color: AMBER_DARK,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <IcoChevronLeft />
        </button>
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: MUTED,
              marginBottom: 2,
            }}
          >
            Cebu Grill
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: INK,
              letterSpacing: -0.5,
              lineHeight: 1.1,
            }}
          >
            Menu Inventory
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 14px",
          borderRadius: 999,
          border: `1.5px solid ${isIngr ? "rgba(255,82,105,0.5)" : "rgba(255,198,112,0.7)"}`,
          background: isIngr
            ? "rgba(255,82,105,0.08)"
            : "rgba(255,198,112,0.15)",
          color: isIngr ? ACCENT_DARK : AMBER_DARK,
          fontSize: 11,
          fontWeight: 800,
        }}
      >
        <IcoInfo />
        {isIngr ? " Measurement-based" : " Unit-based"}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  INFO BANNER                                                         */
/* ================================================================== */
function InfoBanner({ tab }: { tab: "menu" | "ingredients" }) {
  const text =
    tab === "ingredients"
      ? "Measurement-based inventory — deducts stock based on the quantity specified per order."
      : "Unit-based inventory — deducts one (1) unit from stock per order placed.";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "rgba(255,215,122,0.18)",
        border: `1.5px solid rgba(255,198,112,0.55)`,
        borderRadius: 999,
        padding: "8px 18px",
        margin: "0 0 16px",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "rgba(255,198,112,0.3)",
          color: AMBER_DARK,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <IcoInfo />
      </div>
      <p style={{ color: "#5c3d06", lineHeight: 1.4, fontSize: 13 }}>{text}</p>
    </div>
  );
}

/* ================================================================== */
/*  TOOLBAR                                                             */
/* ================================================================== */
import { SearchFilterBar } from "@/components/molecules/SearchFilterBar";
import { useRef, useEffect } from "react";

function Toolbar({
  search,
  onSearch,
  filter,
  onFilter,
}: {
  search: string;
  onSearch: (v: string) => void;
  filter: string;
  onFilter: (v: string) => void;
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`
      relative
      [&_input]:!h-[40px] [&_input]:!py-0 [&_input]:!pl-[38px] [&_input]:!pr-[14px] 
      [&_input]:!rounded-[10px] [&_input]:!text-[13px] 
      [&_input]:!border-[1.5px]
      [&_.left-5]:!left-[12px] [&_svg]:!w-[18px] [&_svg]:!h-[18px]
      [&_button]:!h-[40px] [&_button]:!px-[14px] [&_button]:!rounded-[10px] [&_button]:!text-[13px] [&_button]:!font-bold
      [&_button]:!border-[1.5px] [&_button]:transition-all [&_button]:duration-200
      [&_button:hover]:!border-[#ff5269] [&_button:hover_span]:!text-[#ff5269] [&_button:hover_svg]:!text-[#ff5269] [&_button:hover]:!bg-[rgba(255,82,105,0.05)]
      ${filterOpen ? "[&_button]:!border-[#ff5269] [&_button_span]:!text-[#ff5269] [&_button_svg]:!text-[#ff5269] [&_button]:!bg-[rgba(255,82,105,0.05)]" : ""}
      [&_.gap-3]:!gap-[8px]
    `}
    >
      <SearchFilterBar
        searchWidth="316px"
        placeholder="Search…"
        onSearch={(v) => onSearch(v)}
        onFilterClick={() => setFilterOpen((prev) => !prev)}
      />

      {filterOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            border: "1.5px solid rgba(255,198,112,0.25)",
            padding: "8px",
            minWidth: 180,
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 800, color: MUTED, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Filter by Status
          </div>
          {["All", "High Stock", "Medium Stock", "Low Stock"].map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onFilter(opt);
                setFilterOpen(false);
              }}
              style={{
                width: "100%",
                background: filter === opt ? "rgba(255,82,105,0.08)" : "transparent",
                border: "none",
                textAlign: "left",
                padding: "10px 12px",
                fontSize: 13,
                fontWeight: 600,
                color: filter === opt ? ACCENT : INK,
                borderRadius: 8,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,82,105,0.08)";
                e.currentTarget.style.color = ACCENT;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = INK;
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  TAB NAV                                                             */
/* ================================================================== */
function TabNav({
  active,
  onChange,
}: {
  active: "menu" | "ingredients";
  onChange: (t: "menu" | "ingredients") => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        borderRadius: 10,
        overflow: "hidden",
        border: `1.5px solid rgba(255,198,112,0.5)`,
      }}
    >
      {(["menu", "ingredients"] as const).map((t) => {
        const on = active === t;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            style={{
              padding: "8px 22px",
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              background: on ? AMBER : "transparent",
              color: on ? "#ffffff" : MUTED,
              cursor: "pointer",
              transition: "all .2s",
              whiteSpace: "nowrap",
            }}
          >
            {t === "menu" ? "Menu" : "Ingredients"}
          </button>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/*  MENU — DISH CARD (grid)                                             */
/* ================================================================== */
function DishCard({
  data,
  index,
  onAction,
}: {
  data: DishData;
  index: number;
  onAction: (a: ModalAction) => void;
}) {
  const [hov, setHov] = useState(false);
  const pct = Math.round((data.servings / data.max) * 100);
  const sc = STOCK_COLORS[data.status];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onAction({ type: "view-dish", data, index })}
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        boxShadow: hov ? CARD_SHADOW_HOVER : CARD_SHADOW,
        transform: hov ? "translateY(-3px)" : "none",
        transition: "transform .2s, box-shadow .2s",
      }}
    >
      <div
        style={{
          height: 86,
          background: sc.band,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: -28,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "3px solid #fff",
              background: sc.icon,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
            }}
          >
            {DISH_ICONS[index % DISH_ICONS.length]}
          </div>
        </div>
      </div>
      <div
        style={{
          padding: "38px 16px 0",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: INK,
            lineHeight: 1.25,
          }}
        >
          {data.name}
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: MUTED }}>
          {data.servings} servings left
        </div>
        <div style={{ width: "100%", padding: "10px 0 4px" }}>
          <StockBar pct={pct} status={data.status} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 12,
          borderTop: `1.5px solid rgba(255,198,112,0.18)`,
        }}
      >
        {[
          {
            label: "Edit",
            icon: <IcoPencil />,
            color: AMBER_DARK,
            hoverBg: AMBER_LIGHT,
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              onAction({ type: "edit-dish", data });
            },
          },
          {
            label: "Remove",
            icon: <IcoTrash />,
            color: ACCENT,
            hoverBg: ACCENT_LIGHT,
            borderLeft: true,
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              onAction({ type: "remove-dish", data });
            },
          },
        ].map((btn) => (
          <CfBtn key={btn.label} {...btn} />
        ))}
      </div>
    </div>
  );
}

function CfBtn({
  label,
  icon,
  color,
  hoverBg,
  borderLeft,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  color: string;
  hoverBg: string;
  borderLeft?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        flex: 1,
        padding: "14px 0",
        border: "none",
        borderLeft: borderLeft ? `1.5px solid rgba(255,198,112,0.18)` : "none",
        background: hov ? hoverBg : "transparent",
        color,
        cursor: "pointer",
        transition: "background .15s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      {icon} {label}
    </button>
  );
}

/* ================================================================== */
/*  MENU — ADD DISH CARD                                                */
/* ================================================================== */
function AddDishCard({ onAction }: { onAction: (a: ModalAction) => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onAction({ type: "add-dish" })}
      style={{
        border: `2px dashed ${hov ? ACCENT : AMBER}`,
        borderRadius: 20,
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        cursor: "pointer",
        background: hov ? "rgba(255,82,105,0.04)" : "rgba(255,198,112,0.03)",
        transition: "all .2s",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          border: `2px solid ${hov ? ACCENT : AMBER}`,
          background: hov ? ACCENT : AMBER_LIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: hov ? "#fff" : AMBER_DARK,
          transition: "all .2s",
        }}
      >
        <IcoPlus />
      </div>
      <span
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: hov ? ACCENT : AMBER_DARK,
          transition: "color .2s",
        }}
      >
        Add new dish
      </span>
      <span style={{ fontSize: 13, color: FAINT }}>Click to create</span>
    </div>
  );
}

/* ================================================================== */
/*  MENU — GRID VIEW                                                    */
/* ================================================================== */
function DishGrid({
  dishes,
  onAction,
}: {
  dishes: DishData[];
  onAction: (a: ModalAction) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 16,
      }}
    >
      <AddDishCard onAction={onAction} />
      {dishes.map((d, i) => (
        <DishCard key={d.name} data={d} index={i} onAction={onAction} />
      ))}
    </div>
  );
}

/* ================================================================== */
/*  MENU — LIST ROW                                                     */
/* ================================================================== */
function DishListRow({
  data,
  index,
  onAction,
}: {
  data: DishData;
  index: number;
  onAction: (a: ModalAction) => void;
}) {
  const [hov, setHov] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const pct = Math.round((data.servings / data.max) * 100);
  const sc = STOCK_COLORS[data.status];

  return (
    <div style={{ borderBottom: `1px solid rgba(255,198,112,0.14)` }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => onAction({ type: "view-dish", data, index })}
        style={{
          background: hov ? AMBER_LIGHT : "#fff",
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "13px 18px",
          cursor: "pointer",
          transition: "background .15s",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "3px solid #fff",
            background: sc.icon,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.05)",
          }}
        >
          {DISH_ICONS[index % DISH_ICONS.length]}
        </div>
        <div
          style={{
            flex: 1,
            fontSize: 14,
            fontWeight: 800,
            color: INK,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {data.name}
        </div>
        <div
          className="desktop-row-extras"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div style={{ width: 100, display: "flex", alignItems: "center" }}>
            <StockBar pct={pct} status={data.status} />
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              width: 100,
              textAlign: "right",
              color: MUTED,
            }}
          >
            {data.servings} servings left
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              padding: "3px 10px",
              borderRadius: 999,
              width: 62,
              textAlign: "center",
              background: sc.badge,
              color: sc.text,
            }}
          >
            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </div>
          <IconBtn
            onClick={(e) => {
              e.stopPropagation();
              onAction({ type: "edit-dish", data });
            }}
            bg={AMBER_LIGHT}
            hoverBg={AMBER}
            color={AMBER_DARK}
            borderColor="rgba(255,198,112,0.4)"
          >
            <IcoPencil />
          </IconBtn>
          <IconBtn
            onClick={(e) => {
              e.stopPropagation();
              onAction({ type: "remove-dish", data });
            }}
            bg={ACCENT_LIGHT}
            hoverBg={ACCENT}
            color={ACCENT}
            hoverColor="#fff"
            borderColor="rgba(255,82,105,0.25)"
          >
            <IcoTrash />
          </IconBtn>
        </div>
        <button
          className="mobile-chevron"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((p) => !p);
          }}
          style={{
            background: "none",
            border: "none",
            color: MUTED,
            cursor: "pointer",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
            flexShrink: 0,
            transform: expanded ? "rotate(180deg)" : "none",
            transition: "transform .2s",
          }}
        >
          <IcoChevronDown />
        </button>
      </div>
      {expanded && (
        <div
          className="mobile-expanded"
          style={{
            display: "none",
            padding: "12px 18px 16px",
            background: "#fff9ef",
            borderTop: `1px solid rgba(255,198,112,0.14)`,
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <StockBar pct={pct} status={data.status} />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: sc.text,
                minWidth: 32,
              }}
            >
              {pct}%
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: MUTED,
            }}
          >
            <span>
              Servings left:{" "}
              <strong style={{ color: INK }}>{data.servings}</strong>
            </span>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                padding: "2px 10px",
                borderRadius: 999,
                background: sc.badge,
                color: sc.text,
              }}
            >
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => onAction({ type: "edit-dish", data })}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 8,
                border: `1.5px solid rgba(255,198,112,0.4)`,
                background: AMBER_LIGHT,
                color: AMBER_DARK,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <IcoPencil /> Edit
            </button>
            <button
              onClick={() => onAction({ type: "remove-dish", data })}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 8,
                border: `1.5px solid rgba(255,82,105,0.3)`,
                background: ACCENT_LIGHT,
                color: ACCENT,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <IcoTrash /> Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AddDishRow({ onAction }: { onAction: (a: ModalAction) => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onAction({ type: "add-dish" })}
      style={{
        border: `2px dashed ${hov ? ACCENT : "rgba(255,198,112,0.45)"}`,
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "12px 18px",
        cursor: "pointer",
        background: hov ? "rgba(255,82,105,0.04)" : "rgba(255,198,112,0.03)",
        transition: "all .2s",
        marginTop: 2,
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          border: `1.5px solid ${hov ? ACCENT : AMBER}`,
          background: hov ? ACCENT : AMBER_LIGHT,
          color: hov ? "#fff" : AMBER_DARK,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all .2s",
          flexShrink: 0,
        }}
      >
        <IcoPlus />
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: hov ? ACCENT : AMBER_DARK,
          transition: "color .2s",
        }}
      >
        Add new dish
      </span>
    </div>
  );
}

function DishListView({
  dishes,
  onAction,
}: {
  dishes: DishData[];
  onAction: (a: ModalAction) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {dishes.length > 0 && (
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            border: `1.5px solid rgba(255,198,112,0.22)`,
          }}
        >
          {dishes.map((d, i) => (
            <DishListRow key={d.name} data={d} index={i} onAction={onAction} />
          ))}
        </div>
      )}
      <AddDishRow onAction={onAction} />
    </div>
  );
}

/* ================================================================== */
/*  MENU TAB                                                            */
/* ================================================================== */
function MenuTab({
  dishes,
  onAction,
}: {
  dishes: DishData[];
  onAction: (a: ModalAction) => void;
}) {
  const [view, setView] = useState<"grid" | "list">("grid");
  return (
    <div style={{ padding: "28px 32px 40px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: MUTED,
            letterSpacing: ".5px",
            textTransform: "uppercase",
          }}
        >
          Meal · {dishes.length} items
        </span>
        <ViewToggle view={view} setView={setView} />
      </div>
      {view === "grid" ? (
        <DishGrid dishes={dishes} onAction={onAction} />
      ) : (
        <DishListView dishes={dishes} onAction={onAction} />
      )}
    </div>
  );
}

/* ================================================================== */
/*  INGREDIENT — CARD (grid) — now matches menu card dimensions        */
/* ================================================================== */
function IngredientCard({
  data,
  onAction,
}: {
  data: IngredientData;
  onAction: (a: ModalAction) => void;
}) {
  const [hov, setHov] = useState(false);
  const cfg = CAT_CFG[data.cat] ?? DEFAULT_CAT;
  const pct = Math.round((data.stock / data.max) * 100);
  const st = pctToStatus(pct);
  const sc = STOCK_COLORS[st];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onAction({ type: "view-ingredient", data })}
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        boxShadow: hov ? CARD_SHADOW_HOVER : CARD_SHADOW,
        transform: hov ? "translateY(-3px)" : "none",
        transition: "transform .2s, box-shadow .2s",
      }}
    >
      {/* Band — same height as dish card (86px) */}
      <div
        style={{
          height: 86,
          background: sc.band,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {/* Icon — same size and offset as dish card (56px, -28px) */}
        <div
          style={{
            position: "absolute",
            bottom: -28,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "3px solid #fff",
              background: sc.icon,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
            }}
          >
            {cfg.emoji}
          </div>
        </div>
      </div>

      {/* Body — same top padding as dish card (38px) */}
      <div
        style={{
          padding: "38px 16px 0",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: INK,
            lineHeight: 1.25,
          }}
        >
          {data.name}
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: MUTED }}>
          {data.stock} / {data.max} {data.unit}
        </div>
        <div style={{ width: "100%", padding: "10px 0 4px" }}>
          <StockBar pct={pct} status={st} />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          marginTop: 12,
          borderTop: `1.5px solid rgba(255,198,112,0.18)`,
        }}
      >
        {[
          {
            label: "Edit",
            icon: <IcoPencil />,
            color: AMBER_DARK,
            hoverBg: AMBER_LIGHT,
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              onAction({ type: "edit-ingredient", data });
            },
          },
          {
            label: "Remove",
            icon: <IcoTrash />,
            color: ACCENT,
            hoverBg: ACCENT_LIGHT,
            borderLeft: true,
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              onAction({ type: "remove-ingredient", data });
            },
          },
        ].map((btn) => (
          <CfBtn key={btn.label} {...btn} />
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  INGREDIENT — LIST ROW                                              */
/* ================================================================== */
function IngredientListRow({
  data,
  onAction,
}: {
  data: IngredientData;
  onAction: (a: ModalAction) => void;
}) {
  const [hov, setHov] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const cfg = CAT_CFG[data.cat] ?? DEFAULT_CAT;
  const pct = Math.round((data.stock / data.max) * 100);
  const st = pctToStatus(pct);
  const sc = STOCK_COLORS[st];

  return (
    <div style={{ borderBottom: `1px solid rgba(255,198,112,0.14)` }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => onAction({ type: "view-ingredient", data })}
        style={{
          background: hov ? AMBER_LIGHT : "#fff",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 18px",
          cursor: "pointer",
          transition: "background .15s",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "3px solid #fff",
            background: sc.icon,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.05)",
          }}
        >
          {cfg.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: INK,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data.name}
          </div>
        </div>
        <div
          className="desktop-row-extras"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div
            style={{ width: 88, display: "flex", alignItems: "center", gap: 6 }}
          >
            <StockBar pct={pct} status={st} height={5} />
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: MUTED,
              whiteSpace: "nowrap",
              width: 100,
              textAlign: "right",
            }}
          >
            {data.stock} / {data.max} {data.unit}
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              padding: "3px 10px",
              borderRadius: 999,
              background: sc.badge,
              color: sc.text,
              whiteSpace: "nowrap",
              width: 46,
              textAlign: "center",
            }}
          >
            {pct}%
          </div>
          <IconBtn
            onClick={(e) => {
              e.stopPropagation();
              onAction({ type: "edit-ingredient", data });
            }}
            bg={AMBER_LIGHT}
            hoverBg={AMBER}
            color={AMBER_DARK}
            borderColor="rgba(255,198,112,0.4)"
          >
            <IcoPencil />
          </IconBtn>
          <IconBtn
            onClick={(e) => {
              e.stopPropagation();
              onAction({ type: "remove-ingredient", data });
            }}
            bg={ACCENT_LIGHT}
            hoverBg={ACCENT}
            color={ACCENT}
            hoverColor="#fff"
            borderColor="rgba(255,82,105,0.25)"
          >
            <IcoTrash />
          </IconBtn>
        </div>
        <button
          className="mobile-chevron"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((p) => !p);
          }}
          style={{
            background: "none",
            border: "none",
            color: MUTED,
            cursor: "pointer",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
            flexShrink: 0,
            transform: expanded ? "rotate(180deg)" : "none",
            transition: "transform .2s",
          }}
        >
          <IcoChevronDown />
        </button>
      </div>
      {expanded && (
        <div
          className="mobile-expanded"
          style={{
            display: "none",
            padding: "12px 18px 16px",
            background: "#fff9ef",
            borderTop: `1px solid rgba(255,198,112,0.14)`,
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <StockBar pct={pct} status={st} />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: sc.text,
                minWidth: 32,
              }}
            >
              {pct}%
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: MUTED,
            }}
          >
            <span>
              Stock:{" "}
              <strong style={{ color: INK }}>
                {data.stock}/{data.max} {data.unit}
              </strong>
            </span>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                padding: "2px 10px",
                borderRadius: 999,
                background: sc.badge,
                color: sc.text,
              }}
            >
              {st.charAt(0).toUpperCase() + st.slice(1)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => onAction({ type: "edit-ingredient", data })}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 8,
                border: `1.5px solid rgba(255,198,112,0.4)`,
                background: AMBER_LIGHT,
                color: AMBER_DARK,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <IcoPencil /> Edit
            </button>
            <button
              onClick={() => onAction({ type: "remove-ingredient", data })}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 8,
                border: `1.5px solid rgba(255,82,105,0.3)`,
                background: ACCENT_LIGHT,
                color: ACCENT,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <IcoTrash /> Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  INGREDIENT — ADD CARD — unified with AddDishCard design            */
/* ================================================================== */
function AddIngredientCard({
  catName,
  onAction,
  className,
}: {
  catName: string;
  onAction: (a: ModalAction) => void;
  className?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className={className}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onAction({ type: "add-ingredient", cat: catName })}
      style={{
        border: `2px dashed ${hov ? ACCENT : AMBER}`,
        borderRadius: 20,
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        cursor: "pointer",
        background: hov ? "rgba(255,82,105,0.04)" : "rgba(255,198,112,0.03)",
        transition: "all .2s",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          border: `2px solid ${hov ? ACCENT : AMBER}`,
          background: hov ? ACCENT : AMBER_LIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: hov ? "#fff" : AMBER_DARK,
          transition: "all .2s",
        }}
      >
        <IcoPlus />
      </div>
      <span
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: hov ? ACCENT : AMBER_DARK,
          transition: "color .2s",
        }}
      >
        Add ingredient
      </span>
      <span style={{ fontSize: 13, color: FAINT }}>Click to create</span>
    </div>
  );
}

/* ================================================================== */
/*  INGREDIENT — ADD ROW (list view)                                   */
/* ================================================================== */
function AddIngredientRow({
  catName,
  onAction,
}: {
  catName: string;
  onAction: (a: ModalAction) => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onAction({ type: "add-ingredient", cat: catName })}
      style={{
        border: `2px dashed ${hov ? ACCENT : "rgba(255,198,112,0.45)"}`,
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "12px 18px",
        cursor: "pointer",
        background: hov ? "rgba(255,82,105,0.04)" : "rgba(255,198,112,0.03)",
        transition: "all .2s",
        marginTop: 2,
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          border: `1.5px solid ${hov ? ACCENT : AMBER}`,
          background: hov ? ACCENT : AMBER_LIGHT,
          color: hov ? "#fff" : AMBER_DARK,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all .2s",
          flexShrink: 0,
        }}
      >
        <IcoPlus />
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: hov ? ACCENT : AMBER_DARK,
          transition: "color .2s",
        }}
      >
        Add {catName.toLowerCase()} ingredient
      </span>
    </div>
  );
}

/* ================================================================== */
/*  INGREDIENT — CATEGORY SECTION                                       */
/* ================================================================== */
function IngredientSection({
  catName,
  items,
  view,
  onAction,
}: {
  catName: string;
  items: IngredientData[];
  view: "grid" | "list";
  onAction: (a: ModalAction) => void;
}) {
  const cfg = CAT_CFG[catName] ?? DEFAULT_CAT;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 2,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 800, color: cfg.fg }}>
          {catName}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: MUTED }}>
          ({items.length})
        </span>
      </div>

      <div
        style={{
          height: 1.5,
          borderRadius: 2,
          background: cfg.strip,
          opacity: 0.35,
          marginBottom: 2,
        }}
      />

      {view === "grid" ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <AddIngredientCard
              catName={catName}
              onAction={onAction}
              className="add-ingr-card-grid"
            />
            {items.map((item) => (
              <IngredientCard key={item.name} data={item} onAction={onAction} />
            ))}
          </div>
          <div className="add-ingr-row-mobile" style={{ display: "none" }}>
            <AddIngredientRow catName={catName} onAction={onAction} />
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: `1.5px solid rgba(255,198,112,0.22)`,
            }}
          >
            {items.map((item) => (
              <IngredientListRow
                key={item.name}
                data={item}
                onAction={onAction}
              />
            ))}
          </div>
          <AddIngredientRow catName={catName} onAction={onAction} />
        </>
      )}
    </div>
  );
}

/* ================================================================== */
/*  INGREDIENTS TAB                                                     */
/* ================================================================== */
function IngredientsTab({
  ingredients,
  onAction,
}: {
  ingredients: IngredientData[];
  onAction: (a: ModalAction) => void;
}) {
  const [view, setView] = useState<"grid" | "list">("grid");

  const grouped = useMemo(() => {
    const m: Record<string, IngredientData[]> = {};
    ingredients.forEach((i) => {
      if (!m[i.cat]) m[i.cat] = [];
      m[i.cat].push(i);
    });
    return m;
  }, [ingredients]);

  return (
    <div style={{ padding: "28px 32px 40px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: MUTED,
            letterSpacing: ".5px",
            textTransform: "uppercase",
          }}
        >
          Ingredients · {ingredients.length} items
        </span>
        <ViewToggle view={view} setView={setView} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {Object.entries(grouped).map(([cat, items]) => (
          <IngredientSection
            key={cat}
            catName={cat}
            items={items}
            view={view}
            onAction={onAction}
          />
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  RESPONSIVE STYLE INJECTION                                          */
/* ================================================================== */
const RESPONSIVE_CSS = `
  @media (max-width: 640px) {
    .desktop-row-extras   { display: none !important; }
    .mobile-chevron       { display: flex !important; }
    .mobile-expanded      { display: flex !important; }
    .add-ingr-card-grid   { display: none !important; }
    .add-ingr-row-mobile  { display: flex !important; }
  }
`;

function ResponsiveStyles() {
  return <style>{RESPONSIVE_CSS}</style>;
}

/* ================================================================== */
/*  ROOT                                                                */
/* ================================================================== */
export default function MenuInventory() {
  const [tab, setTab] = useState<"menu" | "ingredients">("menu");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState<ModalAction | null>(null);

  const filteredDishes = useMemo(() => {
    let list = DISH_DATA.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase()),
    );
    if (filter !== "All") {
      const matchStatus = filter.split(" ")[0].toLowerCase();
      list = list.filter((d) => d.status === matchStatus);
    }
    return list;
  }, [search, filter]);

  const filteredIngredients = useMemo(() => {
    let list = INGREDIENT_DATA.filter(
      (i) =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.cat.toLowerCase().includes(search.toLowerCase()),
    );
    if (filter !== "All") {
      const matchStatus = filter.split(" ")[0].toLowerCase();
      list = list.filter((i) => pctToStatus(Math.round((i.stock / i.max) * 100)) === matchStatus);
    }
    return list;
  }, [search, filter]);

  const handleTabChange = (t: "menu" | "ingredients") => {
    setTab(t);
    setSearch("");
    setFilter("All");
  };

  return (
    <>
      <ResponsiveStyles />
      <div className="bg-bg-primary min-h-screen font-inter text-text-primary p-4 md:p-6 lg:p-20">
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            border: `1px solid rgba(255,198,112,0.25)`,
            boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <header
            style={{
              padding: "32px 32px 24px",
              borderBottom: `1px dashed rgba(255,198,112,0.3)`,
              position: "sticky",
              top: 0,
              zIndex: 30,
              background: "#fff",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
          >
            <PageHeader tab={tab} />
            <InfoBanner tab={tab} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <TabNav active={tab} onChange={handleTabChange} />
              <Toolbar
                search={search}
                onSearch={setSearch}
                filter={filter}
                onFilter={setFilter}
              />
            </div>
          </header>

          <div style={{ flex: 1 }}>
            {tab === "menu" ? (
              <MenuTab dishes={filteredDishes} onAction={setModal} />
            ) : (
              <IngredientsTab
                ingredients={filteredIngredients}
                onAction={setModal}
              />
            )}
          </div>
        </div>

        <ModalController action={modal} onClose={() => setModal(null)} />
      </div>
    </>
  );
}