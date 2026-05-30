"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { updateTenantTutorialStatus } from "@/app/(tenant)/[id]/tutorialActions";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, X, Sparkles } from "lucide-react";
import { Button } from "@/components/atoms/Button";

interface TourStep {
  title: string;
  content: string;
  selector?: string;
  position?: "top" | "bottom" | "left" | "right" | "center";
  page: "dashboard" | "menu" | "inventory" | "staff" | "sales" | "audit_logs";
  nextPath?: string;
}

interface TutorialContextType {
  isActive: boolean;
  currentStepIndex: number;
  steps: TourStep[];
  startTour: () => void;
  stopTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  isCompleted: boolean;
}

const TutorialContext = createContext<TutorialContextType | undefined>(
  undefined,
);

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
};

const TOUR_STEPS: TourStep[] = [
  // ─── DASHBOARD ───
  {
    page: "dashboard",
    title: "Welcome to your Qios Portal!",
    content:
      "Let's take a quick 2-minute tour to get you familiar with your merchant command center.",
    position: "center",
  },
  {
    page: "dashboard",
    title: "Real-time Metrics",
    content:
      "Track active orders, revenue milestones, and low-stock alerts in real-time from this panel.",
    selector: "#tutorial-metrics",
    position: "bottom",
  },
  {
    page: "dashboard",
    title: "Sales & Purchase Charts",
    content:
      "Monitor revenue fluctuations and purchase trends to identify your peak traffic windows.",
    selector: "#tutorial-charts",
    position: "top",
  },
  {
    page: "dashboard",
    title: "Critical Operations",
    content:
      "Keep track of supplier counts, customer visits, and key operational stats at a glance.",
    selector: "#tutorial-overall",
    position: "left",
  },
  {
    page: "dashboard",
    title: "Navigation",
    content:
      "This top navbar connects you to digital menus, inventory, staff, sales, and audit logs.",
    selector: "#tutorial-nav",
    position: "bottom",
    nextPath: "menu",
  },

  // ─── MENU ───
  {
    page: "menu",
    title: "Menu & Category Management",
    content:
      "Set up categories, prices, and item descriptions. Changes appear instantly on customer devices!",
    position: "center",
  },
  {
    page: "menu",
    title: "Configure Menu Items",
    content:
      "Toggle availability, update prices, upload images, and flag dietary info per item.",
    selector: "#tutorial-menu-grid",
    position: "top",
    nextPath: "inventory",
  },

  // ─── INVENTORY ───
  {
    page: "inventory",
    title: "Inventory & Recipe Deductions",
    content:
      "Ingredients automatically deduct when orders are completed in the kitchen queue.",
    position: "center",
  },
  {
    page: "inventory",
    title: "Ingredient Catalog",
    content:
      "Set safety thresholds here — low-stock alerts trigger the moment levels drop below your limits.",
    selector: "#tutorial-inventory-table",
    position: "top",
    nextPath: "staff",
  },

  // ─── STAFF ───
  {
    page: "staff",
    title: "Staff & Shift Management",
    content:
      "Control employee permissions, assign login credentials for shifts, and define custom roles.",
    position: "center",
  },
  {
    page: "staff",
    title: "Employee Directory",
    content:
      "Audit active shift assignments and modify role access controls to keep operations secure.",
    selector: "#tutorial-staff-table",
    position: "top",
    nextPath: "sales",
  },

  // ─── SALES ───
  {
    page: "sales",
    title: "Financial Reporting",
    content:
      "Review itemized transactions, tax breakdowns, and export accounting ledger sheets.",
    selector: "#tutorial-sales-analytics",
    position: "top",
    nextPath: "audit_logs",
  },

  // ─── AUDIT LOGS ───
  {
    page: "audit_logs",
    title: "Compliance Audit Trail",
    content:
      "Full visibility into logins, stock adjustments, pricing changes, and role assignments.",
    selector: "#tutorial-audit-table",
    position: "top",
  },
  {
    page: "audit_logs",
    title: "You're Ready to Go! 🚀",
    content:
      "Setup is complete! Visit Settings anytime to update your brand colors, domains, or preferences.",
    position: "center",
  },
];

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const tenantId = params?.id as string;

  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const [spotlightRadius, setSpotlightRadius] = useState<string>("20px");

  const steps = TOUR_STEPS;
  const currentStep = steps[currentStepIndex];

  // ── Check completion status & start ONLY from explicit query param ──
  // The correct flow is:
  //   register → landing page (wait for approval)
  //   → approval email with branding link
  //   → /setup/branding (tenant sets up brand)
  //   → redirect to /dashboard?startTutorial=true  ← ONLY trigger here
  useEffect(() => {
    if (!tenantId) return;

    const checkStatus = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: tenant } = await supabase
          .from("tenants")
          .select("settings")
          .eq("id", tenantId)
          .maybeSingle();

        const settings =
          tenant?.settings && typeof tenant.settings === "object"
            ? (tenant.settings as Record<string, unknown>)
            : null;

        const completed = settings?.tutorial_completed === true;
        setIsCompleted(completed);

        // Only start if the URL explicitly requests it (coming from branding setup)
        if (typeof window !== "undefined") {
          const searchParams = new URLSearchParams(window.location.search);
          if (searchParams.get("startTutorial") === "true") {
            setIsActive(true);
            setCurrentStepIndex(0);
            // Strip the param from the URL cleanly
            const newUrl = window.location.pathname;
            window.history.replaceState({ path: newUrl }, "", newUrl);
          }
          // Do NOT auto-start for all non-completed tenants — they may just be
          // logging in normally and haven't gone through the branding setup yet.
        }
      } catch (err) {
        console.error(
          "[TutorialProvider] Failed to load tutorial status:",
          err,
        );
      }
    };

    void checkStatus();
  }, [tenantId, pathname]);

  // ── Snap to first step of current page when navigating while tour is active ──
  useEffect(() => {
    if (!isActive) return;

    let targetPage: TourStep["page"] = "dashboard";
    if (pathname.includes("/menu")) targetPage = "menu";
    else if (pathname.includes("/inventory")) targetPage = "inventory";
    else if (pathname.includes("/staff") || pathname.includes("/roles"))
      targetPage = "staff";
    else if (pathname.includes("/sales")) targetPage = "sales";
    else if (pathname.includes("/audit_logs")) targetPage = "audit_logs";

    if (currentStep && currentStep.page !== targetPage) {
      const matchIdx = steps.findIndex((s) => s.page === targetPage);
      if (matchIdx !== -1) {
        setCurrentStepIndex(matchIdx);
      }
    }
  }, [pathname, isActive]);

  // ── Spotlight rect recalculation ──
  useEffect(() => {
    if (!isActive || !currentStep?.selector) {
      setSpotlightRect(null);
      setSpotlightRadius("20px");
      return;
    }

    const update = () => {
      const el = document.querySelector(currentStep.selector!);
      if (el) {
        setSpotlightRect(el.getBoundingClientRect());
        const computed = window.getComputedStyle(el).borderRadius;
        setSpotlightRadius(computed && computed !== "0px" ? computed : "20px");
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        setSpotlightRect(null);
        setSpotlightRadius("20px");
      }
    };

    const timeout = setTimeout(update, 350);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [currentStepIndex, isActive, pathname]);

  const startTour = () => {
    setCurrentStepIndex(0);
    setIsActive(true);
  };

  const stopTour = () => setIsActive(false);

  const completeTour = async () => {
    setIsActive(false);
    setIsCompleted(true);
    if (tenantId) await updateTenantTutorialStatus(tenantId, true);
  };

  const skipTour = async () => {
    setIsActive(false);
    setIsCompleted(true);
    if (tenantId) await updateTenantTutorialStatus(tenantId, true);
  };

  const nextStep = () => {
    if (currentStepIndex >= steps.length - 1) {
      void completeTour();
      return;
    }

    if (currentStep?.nextPath) {
      router.push(`/${tenantId}/${currentStep.nextPath}`);
    }

    setCurrentStepIndex((i) => i + 1);
  };

  const prevStep = () => {
    if (currentStepIndex <= 0) return;
    const prevIdx = currentStepIndex - 1;
    const prevStepPage = steps[prevIdx].page;

    if (currentStep && prevStepPage !== currentStep.page) {
      const path = prevStepPage === "dashboard" ? "dashboard" : prevStepPage;
      router.push(`/${tenantId}/${path}`);
    }

    setCurrentStepIndex(prevIdx);
  };

  // ── Compute tooltip position ──
  const getTooltipStyle = (): React.CSSProperties => {
    if (!spotlightRect || currentStep?.position === "center") return {};

    const TOOLTIP_W = 420;
    const TOOLTIP_H = 260;
    const GAP = 16;
    const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;

    let top: number;
    let left: number;

    switch (currentStep?.position) {
      case "bottom":
        top = Math.min(
          vh - TOOLTIP_H - GAP,
          spotlightRect.bottom + GAP + scrollY,
        );
        break;
      case "top":
        top = Math.max(GAP, spotlightRect.top - TOOLTIP_H - GAP + scrollY);
        break;
      case "left":
      case "right":
      default:
        top = Math.max(
          GAP,
          Math.min(
            vh - TOOLTIP_H - GAP,
            spotlightRect.top +
              spotlightRect.height / 2 -
              TOOLTIP_H / 2 +
              scrollY,
          ),
        );
    }

    left = Math.max(
      GAP,
      Math.min(
        vw - TOOLTIP_W - GAP,
        spotlightRect.left + spotlightRect.width / 2 - TOOLTIP_W / 2,
      ),
    );

    return { position: "absolute", top, left, width: TOOLTIP_W };
  };

  const tooltipStyle = getTooltipStyle();
  const isPositioned = Object.keys(tooltipStyle).length > 0;

  // ── Clip-path mask for spotlight ──
  const clipPath = spotlightRect
    ? `polygon(
        0% 0%, 0% 100%,
        ${spotlightRect.left}px 100%,
        ${spotlightRect.left}px ${spotlightRect.top}px,
        ${spotlightRect.right}px ${spotlightRect.top}px,
        ${spotlightRect.right}px ${spotlightRect.bottom}px,
        ${spotlightRect.left}px ${spotlightRect.bottom}px,
        ${spotlightRect.left}px 100%,
        100% 100%, 100% 0%
      )`
    : undefined;

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStepIndex,
        steps,
        startTour,
        stopTour,
        nextStep,
        prevStep,
        skipTour,
        completeTour,
        isCompleted,
      }}
    >
      {children}

      <AnimatePresence>
        {isActive && currentStep && (
          <div className="fixed inset-0 z-[99999] pointer-events-none">
            {/* Backdrop with dynamic spotlight cutout */}
            {!spotlightRect ? (
              <motion.div
                key="backdrop-solid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 bg-black/55 pointer-events-auto"
                onClick={() => void skipTour()}
              />
            ) : (
              <>
                <motion.div
                  key="backdrop-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-transparent pointer-events-auto"
                  onClick={() => void skipTour()}
                />
                <motion.div
                  key="spotlight-cutout"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute pointer-events-none"
                  style={{
                    top: spotlightRect.top,
                    left: spotlightRect.left,
                    width: spotlightRect.width,
                    height: spotlightRect.height,
                    borderRadius: spotlightRadius,
                    border: "2.5px solid var(--brand-accent, #FF5269)",
                    boxShadow:
                      "0 0 0 9999px rgba(0, 0, 0, 0.55), 0 0 0 4px rgba(255,82,105,0.15), 0 0 24px rgba(255,82,105,0.3)",
                  }}
                />
              </>
            )}

            {/* Tutorial card */}
            <div
              className={
                isPositioned
                  ? "absolute pointer-events-none"
                  : "absolute inset-0 flex items-center justify-center pointer-events-none p-4"
              }
            >
              <motion.div
                key={`step-${currentStepIndex}`}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={isPositioned ? tooltipStyle : undefined}
                className="pointer-events-auto w-full max-w-[420px] bg-white/95 backdrop-blur-md border border-white/60 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col gap-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-accent/10">
                      <Sparkles
                        size={14}
                        className="text-brand-accent animate-pulse"
                      />
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-brand-accent">
                      Onboarding Guide
                    </span>
                  </div>
                  <button
                    onClick={() => void skipTour()}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Skip tour"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-[18px] font-bold text-gray-900 leading-snug">
                    {currentStep.title}
                  </h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed mt-2">
                    {currentStep.content}
                  </p>
                </div>

                {/* Step dots */}
                <div className="flex items-center gap-1.5">
                  {steps.map((_, idx) => (
                    <div
                      key={idx}
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width:
                          idx === currentStepIndex
                            ? 16
                            : steps[idx].page === currentStep.page
                              ? 8
                              : 6,
                        background:
                          idx === currentStepIndex
                            ? "var(--brand-accent, #FF5269)"
                            : steps[idx].page === currentStep.page
                              ? "var(--brand-primary, #FFC670)"
                              : "#E5E7EB",
                      }}
                    />
                  ))}
                  <span className="ml-auto text-[11px] font-semibold text-gray-400">
                    {currentStepIndex + 1} / {steps.length}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <Button
                    variant="ghost"
                    shape="rounded"
                    onClick={() => void skipTour()}
                    className="text-gray-400 hover:text-gray-600 text-xs !shadow-none !px-0"
                  >
                    Skip Tour
                  </Button>

                  <div className="flex items-center gap-2">
                    {currentStepIndex > 0 && (
                      <Button
                        variant="ghost"
                        shape="rounded"
                        size="sm"
                        onClick={prevStep}
                        leftIcon={<ChevronLeft size={15} />}
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      variant="accent"
                      shape="rounded"
                      size="sm"
                      onClick={nextStep}
                      rightIcon={
                        currentStepIndex < steps.length - 1 ? (
                          <ChevronRight size={15} />
                        ) : undefined
                      }
                    >
                      {currentStepIndex === steps.length - 1
                        ? "Get Started!"
                        : "Next"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </TutorialContext.Provider>
  );
}
