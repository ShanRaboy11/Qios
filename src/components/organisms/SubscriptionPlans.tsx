import React, { useState } from "react";
import { Check, ExternalLink, Info, Sparkles } from "lucide-react";
import { Button } from "../atoms/Button";
import { Badge } from "../atoms/Badge";
import { cn } from "@/lib/utils";

interface PlanNote {
  label: string;
}

interface PlanProps {
  name: string;
  description: string;
  price: string;
  billingInfo: string;
  featuresTitle: string;
  features: string[];
  notes: PlanNote[];
  variant: "basic" | "business" | "enterprise";
  badge?: string;
}

const PlanCard = ({
  name,
  description,
  price,
  billingInfo,
  featuresTitle,
  features,
  notes,
  variant,
  badge,
}: PlanProps) => {
  const isBusiness = variant === "business";
  const isEnterprise = variant === "enterprise";
  const isBasic = variant === "basic";

  const cardStyles = {
    basic: "border-brand-primary/30",
    business: "border-brand-accent shadow-2xl scale-105 z-20",
    enterprise: "border-success-primary/30",
  };

  const blushColors = {
    basic: "from-[#ffc670]/20",
    business: "from-[#ff5269]/20",
    enterprise: "from-[#1fad66]/20",
  };

  const checkCircleStyles = {
    basic: "bg-brand-primary/10",
    business: "bg-brand-accent/10",
    enterprise: "bg-success-secondary",
  };

  const checkIconStyles = {
    basic: "text-brand-primary",
    business: "text-brand-accent",
    enterprise: "text-success-primary",
  };

  return (
    <div
      className={cn(
        "relative flex flex-col p-6 md:p-8 rounded-[2.5rem] border bg-white h-full transition-all duration-300",
        cardStyles[variant],
      )}
    >
      {/* contained blushes to prevent cutting the badge */}
      <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
        <div
          className={cn(
            "absolute -top-10 -right-10 w-40 h-40 blur-[40px] rounded-full bg-gradient-to-br to-transparent",
            blushColors[variant],
          )}
        />
        <div
          className={cn(
            "absolute -bottom-10 -left-10 w-40 h-40 blur-[40px] rounded-full bg-gradient-to-tr to-transparent",
            blushColors[variant],
          )}
        />
      </div>

      {isBusiness && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
          <Badge
            color="accent"
            variant="solid"
            className="py-1 px-4 shadow-md font-bold text-[10px] tracking-wider"
          >
            MOST POPULAR
          </Badge>
        </div>
      )}

      <div className="mb-6 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[31px] font-bold leading-[125%] text-text-primary">
            {name}
          </h3>
          {badge && !isBusiness && (
            <Badge
              color={isEnterprise ? "success" : "primary"}
              variant="subtle"
              className="text-[10px]"
              leftIcon={isEnterprise ? <Sparkles size={12} /> : null}
            >
              {badge}
            </Badge>
          )}
        </div>
        <p className="b4 text-text-secondary h-12 md:h-10 leading-tight">
          {description}
        </p>

        <div className="mt-8 flex items-baseline gap-1">
          <span className="h2 text-text-primary">₱ {price}</span>
          <span className="b2 text-text-secondary">/month</span>
        </div>
        <p className="b5 font-medium text-text-secondary mt-1">{billingInfo}</p>
      </div>

      <div className="flex-1 relative z-10">
        <div className="h-[1px] w-full bg-brand-primary/10 mb-6" />

        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary/60 mb-5">
          {featuresTitle}
        </p>

        <ul className="space-y-4 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex gap-3 items-start">
              <div
                className={cn(
                  "mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                  checkCircleStyles[variant],
                )}
              >
                <Check
                  className={cn(
                    "w-3 h-3 stroke-[4px]",
                    checkIconStyles[variant],
                  )}
                />
              </div>
              <span className="b4 text-text-primary leading-tight">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
          {notes.map((note, i) => (
            <div key={i} className="flex items-center gap-1.5 opacity-80">
              <Info size={13} className="text-text-secondary" />
              <span className="text-[11px] font-medium text-text-secondary">
                {note.label}
              </span>
            </div>
          ))}
        </div>

        {isEnterprise ? (
          <Button
            variant="outline"
            shape="rounded"
            size="md"
            className="w-full text-sm md:text-base border-success-primary text-success-primary hover:bg-success-primary hover:text-white hover:border-success-primary"
            rightIcon={<ExternalLink size={16} />}
          >
            Get Started
          </Button>
        ) : (
          <Button
            variant={isBusiness ? "accent" : "outline"}
            shape="rounded"
            size="md"
            className="w-full text-sm md:text-base"
            rightIcon={<ExternalLink size={16} />}
          >
            Get Started
          </Button>
        )}
      </div>
    </div>
  );
};

export default function SubscriptionPlans() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "monthly",
  );

  const gradientHeaderStyle = {
    background: "linear-gradient(250deg, #FFD77A 15.53%, #FF5269 84.47%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  return (
    <section
      className="relative w-full py-24 px-6 bg-bg-primary overflow-hidden"
      id="subscription"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h1 className="h1 text-text-primary tracking-tight max-w-2xl mx-auto">
            From startup to enterprise, <br />
            <span style={gradientHeaderStyle}>we have you covered.</span>
          </h1>
          <p className="h4 text-text-secondary whitespace-nowrap px-4">
            Transparent pricing for every stage of your growth.
          </p>
        </div>

        <div className="flex justify-center mb-20">
          <div className="bg-white p-1.5 rounded-full border border-brand-primary/20 shadow-lg shadow-brand-primary/5 inline-flex items-center">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "px-8 py-2.5 rounded-full b2 transition-all",
                billingCycle === "monthly"
                  ? "bg-brand-secondary text-text-tertiary shadow-md"
                  : "text-text-secondary hover:bg-gray-50",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annually")}
              className={cn(
                "px-8 py-2.5 rounded-full b2 transition-all flex items-center gap-2",
                billingCycle === "annually"
                  ? "bg-brand-secondary text-text-tertiary shadow-md"
                  : "text-text-secondary hover:bg-gray-50",
              )}
            >
              Annually
              <Badge
                color="success"
                variant="solid"
                className="text-[10px] px-2.5 py-0.5 border border-white/20"
              >
                SAVE 15%
              </Badge>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-x-6 lg:gap-x-8 mb-20 items-stretch">
          <PlanCard
            variant="basic"
            name="Basic"
            description="Perfect for small F&B operators starting digital."
            price={billingCycle === "monthly" ? "1,499" : "1,274"}
            billingInfo={
              billingCycle === "monthly"
                ? "Billed monthly"
                : "₱15,290 billed annually"
            }
            featuresTitle="What's Included"
            features={[
              "QR mobile ordering (no app needed)",
              "Simple digital menu + cart",
              "Order status tracking",
              "Basic sales summary",
              "1 store only",
            ]}
            notes={[{ label: "Cancel anytime" }, { label: "7-day guarantee" }]}
          />

          <PlanCard
            variant="business"
            name="Business"
            badge="Popular"
            description="Advanced tools for growing multi-branch operators."
            price={billingCycle === "monthly" ? "3,499" : "2,974"}
            billingInfo={
              billingCycle === "monthly"
                ? "Billed monthly"
                : "₱35,690 billed annually"
            }
            featuresTitle="Everything in Basic, plus"
            features={[
              "AI chat ordering functionality",
              "Customizable menu options",
              "Staff accounts with login",
              "Live sales dashboard",
              "Inventory & performance tracking",
              "Detailed analytical reports",
              "Multi-device support",
            ]}
            notes={[{ label: "Cancel anytime" }, { label: "14-day guarantee" }]}
          />

          <PlanCard
            variant="enterprise"
            name="Enterprise"
            badge="Premium Suite"
            description="Custom solutions for chains and large franchises."
            price={billingCycle === "monthly" ? "7,999" : "6,799"}
            billingInfo={
              billingCycle === "monthly"
                ? "Billed monthly"
                : "₱81,590 billed annually"
            }
            featuresTitle="Everything in Business, plus"
            features={[
              "Multi-branch management",
              "Advanced stock tracking",
              "Deep efficiency analytics",
              "Full activity audit logs",
              "Custom settings per branch",
              "External API integration",
            ]}
            notes={[
              { label: "30-day cancellation notice" },
              { label: "Onboarding support" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
