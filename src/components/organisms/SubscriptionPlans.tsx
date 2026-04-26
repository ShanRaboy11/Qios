import React, { useState } from "react";
import {
  Check,
  ExternalLink,
  Users,
  ShieldCheck,
  Timer,
  Sparkles,
} from "lucide-react";
import { Button } from "../atoms/Button";
import { Badge } from "../atoms/Badge";
import { cn } from "@/lib/utils";

interface PlanLimit {
  label: string;
  value: string | number;
}

interface PlanProps {
  name: string;
  description: string;
  price: string;
  billingInfo: string;
  subscriberLabel: string;
  featuresTitle: string;
  features: string[];
  limits: PlanLimit[];
  buttonText: string;
  variant: "basic" | "business" | "enterprise";
  badge?: string;
  secondaryButton?: boolean;
}

const PlanCard = ({
  name,
  description,
  price,
  billingInfo,
  subscriberLabel,
  featuresTitle,
  features,
  limits,
  buttonText,
  variant,
  badge,
  secondaryButton,
}: PlanProps) => {
  const isBusiness = variant === "business";
  const isEnterprise = variant === "enterprise";

  const cardStyles = {
    basic: "border-brand-primary/20",
    business: "border-brand-accent shadow-2xl scale-105 z-20",
    enterprise: "border-success-primary/20",
  };

  const limitStyles = {
    basic: "bg-brand-primary/5",
    business: "bg-brand-accent/5",
    enterprise: "bg-success-primary/5",
  };

  return (
    <div
      className={cn(
        "relative flex flex-col p-8 rounded-[2.5rem] border-2 bg-white h-full transition-all duration-300",
        cardStyles[variant],
      )}
    >
      {isBusiness && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge
            color="accent"
            variant="solid"
            className="py-1.5 px-6 shadow-md font-bold text-[11px]"
          >
            MOST POPULAR
          </Badge>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="h2 text-text-primary">{name}</h2>
          {badge && !isBusiness && (
            <Badge
              color={isEnterprise ? "success" : "primary"}
              variant="subtle"
              leftIcon={isEnterprise ? <Sparkles className="w-3 h-3" /> : null}
            >
              {badge}
            </Badge>
          )}
        </div>
        <p className="b4 text-text-secondary mb-6 h-10">{description}</p>

        <div className="flex items-baseline gap-1 mb-1">
          <span className="h3 text-text-primary">₱ {price}</span>
          <span className="b1 text-text-secondary">/month</span>
        </div>
        <p className="b5 text-text-secondary mb-6">{billingInfo}</p>

        <Badge color={isBusiness ? "accent" : "primary"} variant="outline">
          {subscriberLabel}
        </Badge>
      </div>

      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary/60 mb-5">
          {featuresTitle}
        </p>
        <ul className="space-y-4 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex gap-3 items-start">
              <div
                className={cn(
                  "mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                  isBusiness
                    ? "bg-brand-accent/10 text-brand-accent"
                    : "bg-success-primary/10 text-success-primary",
                )}
              >
                <Check className="w-3.5 h-3.5 stroke-[3px]" />
              </div>
              <span className="b4 text-text-primary leading-tight">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <div className={cn("p-5 rounded-2xl mb-8", limitStyles[variant])}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary/60 mb-3">
            Usage Limits
          </p>
          <div className="space-y-2">
            {limits.map((limit, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="b5 text-text-secondary">{limit.label}</span>
                <span className="b5 font-bold text-text-primary">
                  {limit.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <Button
          variant={isBusiness ? "accent" : isEnterprise ? "dark" : "outline"}
          className="w-full py-7"
          rightIcon={
            !secondaryButton && !isEnterprise ? (
              <ExternalLink size={18} />
            ) : isEnterprise ? (
              <ExternalLink size={18} />
            ) : null
          }
        >
          {buttonText}
        </Button>

        {isEnterprise && (
          <Button variant="ghost" className="w-full text-text-secondary">
            Talk to Sales
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

  return (
    <section className="relative w-full py-24 px-4 bg-bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="h1 text-text-primary mb-4 max-w-3xl mx-auto">
            From startup to enterprise, we have you covered.
          </h1>
          <p className="h4 text-text-secondary">
            Transparent pricing for every stage of your growth.
          </p>
        </div>

        <div className="flex justify-center mb-20">
          <div className="bg-white p-1.5 rounded-2xl border border-brand-primary/20 shadow-sm inline-flex items-center">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "px-8 py-3 rounded-xl b2 transition-all",
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
                "px-8 py-3 rounded-xl b2 transition-all flex items-center gap-2",
                billingCycle === "annually"
                  ? "bg-brand-secondary text-text-tertiary shadow-md"
                  : "text-text-secondary hover:bg-gray-50",
              )}
            >
              Annually
              <Badge
                color="success"
                variant="subtle"
                className="ml-1 text-[10px] font-bold"
              >
                SAVE 20%
              </Badge>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-stretch">
          <PlanCard
            variant="basic"
            name="Basic"
            description="Perfect for small F&B operators starting digital."
            price={billingCycle === "monthly" ? "499" : "399"}
            billingInfo={
              billingCycle === "monthly" ? "Billed monthly" : "Billed annually"
            }
            subscriberLabel="Up to 100 subscribers"
            featuresTitle="What's Included"
            features={[
              "QR code digital menu & ordering",
              "Daily sales reports & revenue log",
              "Order management system",
              "Standard customer support",
            ]}
            limits={[
              { label: "Max. orders/month", value: 500 },
              { label: "Menu items", value: 50 },
              { label: "Staff accounts", value: 3 },
              { label: "Branch", value: 1 },
            ]}
            buttonText="Start free trial"
          />

          <PlanCard
            variant="business"
            name="Business"
            badge="Popular"
            description="Advanced tools for growing multi-branch operators."
            price={billingCycle === "monthly" ? "1,299" : "1,039"}
            billingInfo={
              billingCycle === "monthly" ? "Billed monthly" : "Billed annually"
            }
            subscriberLabel="Up to 500 subscribers"
            featuresTitle="Everything in Basic, Plus"
            features={[
              "Unit-based inventory tracking",
              "Advanced analytics dashboard",
              "Multiple branch management",
              "Customer loyalty program",
              "Priority email support",
            ]}
            limits={[
              { label: "Max. orders/month", value: "2,500" },
              { label: "Menu items", value: "Unlimited" },
              { label: "Staff accounts", value: 10 },
              { label: "Branch", value: 3 },
            ]}
            buttonText="Get started free"
          />

          <PlanCard
            variant="enterprise"
            name="Enterprise"
            badge="Gemini AI"
            description="Custom solutions for chains and large franchises."
            price={billingCycle === "monthly" ? "3,999" : "3,199"}
            billingInfo={
              billingCycle === "monthly" ? "Billed monthly" : "Billed annually"
            }
            subscriberLabel="Unlimited subscribers"
            featuresTitle="Everything in Business, Plus"
            features={[
              "Gemini AI concierge (AI-powered)",
              "Measurement-based inventory",
              "Custom API integrations",
              "Dedicated account manager",
              "24/7 Priority phone support",
            ]}
            limits={[
              { label: "Max. orders/month", value: "Unlimited" },
              { label: "Menu items", value: "Unlimited" },
              { label: "Staff accounts", value: "Unlimited" },
              { label: "Branch", value: "Unlimited" },
            ]}
            buttonText="Contact Sales"
          />
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-[2rem] p-10 border border-brand-primary/10 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <p className="h4 text-text-primary mb-2">Still have questions?</p>
              <p className="b2 text-text-secondary">
                All plans include a 14-day free trial. No credit card required.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 b4 text-text-secondary">
                <Users className="w-5 h-5 text-brand-primary" /> 255+
                restaurants
              </div>
              <div className="flex items-center gap-2 b4 text-text-secondary">
                <ShieldCheck className="w-5 h-5 text-success-primary" /> SOC 2
                Secure
              </div>
              <div className="flex items-center gap-2 b4 text-text-secondary">
                <Timer className="w-5 h-5 text-brand-accent" /> 30m setup
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(255,255,255,1))",
        }}
      />
    </section>
  );
}
