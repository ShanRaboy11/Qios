"use client";
import { useEffect, useState } from "react";
import { Timer, ChefHat, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export type OrderStatus = "pending" | "preparing" | "ready";

export interface OrderItem {
  qty: number;
  name: string;
  note?: string;
  emoji?: string;
  image?: string;
}

export interface Order {
  id: string;
  table: string;
  startedAt: number;
  status: OrderStatus;
  items: OrderItem[];
  aiInstructions?: string[];
}

function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Urgency = "calm" | "warm" | "urgent";
function getUrgency(ms: number, status: OrderStatus): Urgency {
  if (status === "ready") return "calm";
  const minutes = ms / 60000;
  if (minutes > 12) return "urgent";
  if (minutes > 6) return "warm";
  return "calm";
}

interface PrepCardProps {
  order: Order;
  onAdvance: (id: string) => void;
  index?: number;
}

export function PrepCard({ order, onAdvance, index = 0 }: PrepCardProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const elapsed = now - order.startedAt;
  const urgency = getUrgency(elapsed, order.status);

  /* ── accent bar colour ── */
  const accentBar =
    order.status === "ready"
      ? "before:bg-[var(--kds-green)]"
      : order.status === "preparing"
        ? "before:bg-[var(--kds-coral)]"
        : "before:bg-[var(--kds-gold)]";

  /* ── timer badge colours ── */
  const timerBg =
    urgency === "urgent"
      ? "bg-[var(--kds-coral-soft)] text-[var(--kds-coral)]"
      : urgency === "warm"
        ? "bg-[var(--kds-gold-soft)] text-[var(--kds-gold-mid)]"
        : "bg-gray-100 text-[var(--kds-muted)]";

  /* ── progress bar ── */
  const progressWidth =
    order.status === "pending"
      ? "w-[8%]"
      : order.status === "preparing"
        ? "w-1/2"
        : "w-full";
  const progressColor =
    order.status === "ready"
      ? "bg-[var(--kds-green)]"
      : urgency === "urgent"
        ? "bg-[var(--kds-coral)]"
        : "bg-[var(--kds-gold)]";

  /* ── CTA ── */
  const cta =
    order.status === "pending"
      ? { label: "Start Preparing", Icon: ChefHat }
      : order.status === "preparing"
        ? { label: "Mark as Ready", Icon: CheckCircle2 }
        : { label: "Served ✓", Icon: CheckCircle2 };

  const ctaClass =
    order.status === "ready"
      ? "bg-[var(--kds-green-soft)] text-[var(--kds-green)] hover:bg-[var(--kds-green-soft)] border-0 shadow-none"
      : "bg-[var(--kds-coral)] text-white hover:bg-[var(--kds-coral)]/90 border-0";

  return (
    <article
      className={cn(
        "kds-slide-up group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white",
        "before:absolute before:left-0 before:top-0 before:h-full before:w-[5px] before:rounded-l-2xl",
        accentBar,
        urgency === "urgent" && "kds-pulse-ring",
      )}
      style={{
        boxShadow: "var(--kds-shadow-card)",
        animationDelay: `${index * 70}ms`,
      }}
    >
      {/* Decorative blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, var(--kds-gold) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-1 flex-col p-5">
        <div className="flex flex-col gap-4 flex-1">
          {/* ── Header row ── */}
          <div className="flex items-start justify-between gap-3">
            {/* Order ID + table */}
            <div className="flex flex-col gap-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--kds-muted)]">
                Order
              </p>
              <h3 className="font-figtree text-[22px] font-bold leading-none tabular-nums text-[var(--kds-dark)]">
                {order.id}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-[var(--kds-muted)]">
                {order.table}
              </p>
            </div>

            {/* Timer badge */}
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold tabular-nums",
                timerBg,
                order.status === "preparing" &&
                  urgency === "urgent" &&
                  "kds-pulse-ring",
              )}
            >
              <Timer className="h-3.5 w-3.5 shrink-0" />
              {formatElapsed(elapsed)}
            </div>
          </div>

          {/* ── Progress bar ── */}
          <div>
            <div className="mb-1.5 flex justify-between text-[9px] font-bold uppercase tracking-widest">
              <span
                className={cn(
                  order.status === "pending"
                    ? "text-[var(--kds-dark)]"
                    : "text-gray-300",
                )}
              >
                Pending
              </span>
              <span
                className={cn(
                  order.status === "preparing"
                    ? "text-[var(--kds-dark)]"
                    : "text-gray-300",
                )}
              >
                Preparing
              </span>
              <span
                className={cn(
                  order.status === "ready"
                    ? "text-[var(--kds-green)]"
                    : "text-gray-300",
                )}
              >
                Ready
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700 ease-out",
                  progressWidth,
                  progressColor,
                )}
              />
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="border-t border-dashed border-gray-200" />

          {/* ── Item list ── */}
          <ul className="flex flex-col gap-2">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-center gap-2.5">
                {/* Dish image with emoji fallback */}
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[var(--kds-gold-soft)]">
                  <span className="absolute inset-0 flex items-center justify-center text-xl leading-none select-none">
                    {item.emoji ?? "🍽️"}
                  </span>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.opacity = "0";
                      }}
                    />
                  )}
                </div>
                <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md bg-[var(--kds-gold-soft)] text-[10px] font-bold text-[var(--kds-gold-dark)]">
                  {item.qty}×
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--kds-dark)] leading-tight">
                    {item.name}
                  </p>
                  {item.note && (
                    <p className="mt-0.5 text-[11px] text-[var(--kds-muted)]">
                      {item.note}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* ── CTA Button ── always anchored to bottom */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <Button
            onClick={() => onAdvance(order.id)}
            disabled={order.status === "ready"}
            variant="ghost"
            shape="rounded"
            size="md"
            className={cn(
              "w-full h-11 rounded-xl text-sm font-bold transition-all active:scale-[0.97]",
              ctaClass,
            )}
            leftIcon={<cta.Icon className="h-4 w-4" />}
          >
            {cta.label}
          </Button>
        </div>
      </div>
    </article>
  );
}
