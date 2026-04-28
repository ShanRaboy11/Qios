"use client";

import React, { useEffect, useState } from "react";
import { Hourglass, Flame, BadgeCheck } from "lucide-react";
import { PrepCard, Order, OrderStatus } from "@/components/molecules/PrepCard";
import { StatCard } from "@/components/molecules/StatCard";
import { cn } from "@/lib/utils";

const now = Date.now();

// Convenience helper — Unsplash images; emoji acts as fallback if image fails
const IMG = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=88&h=88&q=80`;

const INITIAL_ORDERS: Order[] = [
  {
    id: "R-4820",
    table: "Table 3",
    startedAt: now - 3 * 60 * 1000,
    status: "pending",
    items: [
      {
        qty: 1,
        name: "Chicken Adobo Rice Bowl",
        note: "Extra rice",
        emoji: "🍗",
        image: IMG("1598515214211-89d3c73ae83b"),
      },
      {
        qty: 2,
        name: "Sago't Gulaman",
        emoji: "🥤",
        image: IMG("1544145945-f90425340c7e"),
      },
    ],
    aiInstructions: ["No MSG — customer sensitive", "Serve rice on the side"],
  },
  {
    id: "R-4821",
    table: "Counter 1",
    startedAt: now - 7 * 60 * 1000,
    status: "preparing",
    items: [
      {
        qty: 1,
        name: "Pork Sinigang",
        note: "Extra kangkong",
        emoji: "🍲",
        image: IMG("1547592166-23ac45744acd"),
      },
      {
        qty: 1,
        name: "Garlic Rice",
        note: "Large serving",
        emoji: "🍚",
        image: IMG("1516684732162-798a0062be99"),
      },
      {
        qty: 1,
        name: "Calamansi Juice",
        emoji: "🍋",
        image: IMG("1621506289937-a8e4df240d0b"),
      },
    ],
    aiInstructions: ["VIP customer — premium presentation", "Extra garnish"],
  },
  {
    id: "R-4822",
    table: "Counter 2",
    startedAt: now - 5 * 60 * 1000,
    status: "preparing",
    items: [
      {
        qty: 1,
        name: "Kare-Kare Meal",
        note: "Mild peanut sauce",
        emoji: "🥘",
        image: IMG("1574484284002-952d92456975"),
      },
      {
        qty: 2,
        name: "Lumpia Shanghai",
        note: "10 pieces",
        emoji: "🥟",
        image: IMG("1563245372-f21724e3856d"),
      },
    ],
    aiInstructions: ["Rush order — customer in a hurry"],
  },
  {
    id: "R-4823",
    table: "Counter 1",
    startedAt: now - 4 * 60 * 1000,
    status: "pending",
    items: [
      {
        qty: 1,
        name: "Beef Tapa",
        note: "Well done",
        emoji: "🥩",
        image: IMG("1529692236671-f1f6cf9683ba"),
      },
      {
        qty: 1,
        name: "Garlic Rice",
        note: "Medium serving",
        emoji: "🍚",
        image: IMG("1516684732162-798a0062be99"),
      },
      {
        qty: 2,
        name: "Fried Egg",
        note: "Over easy",
        emoji: "🍳",
        image: IMG("1482049016688-2d3e1291311a"),
      },
    ],
  },
  {
    id: "R-4824",
    table: "Counter 4",
    startedAt: now - 17 * 60 * 1000,
    status: "ready",
    items: [
      {
        qty: 1,
        name: "Sisig Rice Bowl",
        note: "Medium spice",
        emoji: "🍽️",
        image: IMG("1567620905732-2d1ec7ab7445"),
      },
      {
        qty: 2,
        name: "Calamansi Juice",
        note: "Less sugar",
        emoji: "🍋",
        image: IMG("1621506289937-a8e4df240d0b"),
      },
    ],
    aiInstructions: ["Extra spicy as requested — regular customer"],
  },
  {
    id: "R-4825",
    table: "Counter 2",
    startedAt: now - 10 * 60 * 1000,
    status: "preparing",
    items: [
      {
        qty: 1,
        name: "Chicken Inasal Platter",
        note: "Extra chicken, java rice",
        emoji: "🍗",
        image: IMG("1598515214211-89d3c73ae83b"),
      },
      {
        qty: 1,
        name: "Sinigang na Baboy",
        note: "Extra rice",
        emoji: "🍲",
        image: IMG("1547592166-23ac45744acd"),
      },
    ],
  },
  {
    id: "R-4826",
    table: "Counter 3",
    startedAt: now - 4.5 * 60 * 1000,
    status: "pending",
    items: [
      {
        qty: 2,
        name: "Halo-Halo",
        note: "Extra ice cream",
        emoji: "🍧",
        image: IMG("1488900128323-21503983a07e"),
      },
      {
        qty: 3,
        name: "Turon",
        note: "With langka",
        emoji: "🍌",
        image: IMG("1571771894821-ce9b6c11b08e"),
      },
    ],
    aiInstructions: ["Less ice on Halo-Halo — customer preference"],
  },
];

interface SectionConfig {
  status: OrderStatus;
  label: string;
  dotClass: string;
  badgeClass: string;
  accentColor: string;
  gif: string;
  Icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  iconClass: string;
  iconStyle?: React.CSSProperties;
}

const SECTIONS: SectionConfig[] = [
  {
    status: "pending",
    label: "Pending",
    dotClass: "bg-[var(--kds-gold)]",
    badgeClass: "bg-[var(--kds-gold-soft)] text-[var(--kds-gold-deeper)]",
    accentColor: "var(--kds-gold)",
    gif: "/images/Pending.gif",
    Icon: Hourglass,
    iconClass: "text-[var(--kds-gold-mid)] animate-spin",
    iconStyle: { animationDuration: "3s" },
  },
  {
    status: "preparing",
    label: "Preparing",
    dotClass: "bg-[var(--kds-coral)]",
    badgeClass: "bg-[var(--kds-coral-soft)] text-[var(--kds-coral)]",
    accentColor: "var(--kds-coral)",
    gif: "/images/Cooking.gif",
    Icon: Flame,
    iconClass: "text-[var(--kds-coral)] animate-bounce",
  },
  {
    status: "ready",
    label: "Ready",
    dotClass: "bg-[var(--kds-green)]",
    badgeClass: "bg-[var(--kds-green-soft)] text-[var(--kds-green)]",
    accentColor: "var(--kds-green)",
    gif: "/images/Completed.gif",
    Icon: BadgeCheck,
    iconClass: "text-[var(--kds-green)] animate-pulse",
  },
];

function formatClock(d: Date) {
  return d.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export default function KitchenPreparationDashboard(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<OrderStatus>("pending");
  const [clock, setClock] = useState(() => formatClock(new Date()));

  useEffect(() => {
    const id = setInterval(() => setClock(formatClock(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  function advanceOrder(id: string) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const next: OrderStatus =
          o.status === "pending"
            ? "preparing"
            : o.status === "preparing"
              ? "ready"
              : "ready";
        return {
          ...o,
          status: next,
          startedAt: next === "preparing" ? Date.now() : o.startedAt,
        };
      }),
    );
  }

  const counts = {
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
  };

  const activeCount = counts.pending + counts.preparing;

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "var(--kds-cream)" }}
    >
      {/* Header */}
      <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 pt-5 md:pt-7 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--kds-brown-dark)] mb-1">
              Kitchen Display
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-gradient-to-br from-white to-[var(--kds-cream)] rounded-2xl shadow border-2 border-[var(--kds-gold)]/30">
              <span className="text-xs text-[var(--kds-brown-mid)] mr-2">
                Avg. Prep Time
              </span>
              <span className="text-sm font-bold text-[var(--kds-brown-dark)]">
                7:24
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-5 md:mb-6">
          <StatCard
            title="Pending"
            value={counts.pending}
            subtext="Waiting to start"
            variant="yellow"
            className="bg-[#FFC670] border-[#FFC670] hover:shadow-sm"
          />
          <StatCard
            title="In Progress"
            value={counts.preparing}
            subtext="Currently cooking"
            variant="coral"
            className="bg-[#FFC670] border-[#FFC670] hover:shadow-sm"
          />
          <StatCard
            title="Ready"
            value={counts.ready}
            subtext="For pickup"
            variant="green"
            className="bg-[#FFC670] border-[#FFC670] hover:shadow-sm"
          />
          <StatCard
            title="Total Active"
            value={orders.length}
            subtext="All orders"
            variant="pink"
            className="bg-[#FFC670] border-[#FFC670] hover:shadow-sm"
          />
        </div>
      </div>

      {/* Tab Bar */}
      <div
        className="flex items-center gap-1 px-4 md:px-5 pt-0 pb-0 overflow-x-auto scrollbar-none"
        style={{ background: "var(--kds-cream)" }}
      >
        {SECTIONS.map((s) => {
          const isActive = activeTab === s.status;
          return (
            <button
              key={s.status}
              onClick={() => setActiveTab(s.status)}
              className={cn(
                "relative flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-sm font-semibold transition-all duration-200 focus:outline-none",
                isActive
                  ? "bg-white text-[var(--kds-dark)] shadow-sm"
                  : "bg-transparent text-[var(--kds-muted)] hover:text-[var(--kds-dark)] hover:bg-white/60",
              )}
            >
              {s.label}
              <span className="text-xs font-bold tabular-nums">
                {counts[s.status]}
              </span>
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                  style={{ background: s.accentColor }}
                />
              )}
            </button>
          );
        })}
        {/* Tab bar bottom border */}
        <div className="flex-1 border-b border-gray-200" />
      </div>

      {/* Tab Panel */}
      <main className="flex-1 p-4 md:p-5">
        {SECTIONS.map((section) => {
          if (section.status !== activeTab) return null;
          const sectionOrders = orders.filter(
            (o) => o.status === section.status,
          );
          return (
            <div
              key={section.status}
              className="kds-fade-in grid gap-4"
              style={{
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 300px), 340px))",
              }}
            >
              {sectionOrders.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-24 gap-3 text-[var(--kds-muted)] opacity-60">
                  <span className="text-5xl">🍚</span>
                  <span className="text-sm font-medium">No orders here</span>
                </div>
              ) : (
                sectionOrders.map((order, index) => (
                  <PrepCard
                    key={order.id}
                    order={order}
                    onAdvance={advanceOrder}
                    index={index}
                  />
                ))
              )}
            </div>
          );
        })}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mx-5 mb-5" />
    </div>
  );
}
