import React, { useState } from "react";
import { Check, ExternalLink, Users, ShieldCheck, Timer } from "lucide-react";
import { Button } from "../atoms/Button";

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
  isPopular?: boolean;
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
  const styles = {
    basic: {
      border: "border-brand-primary",
      limitBg: "bg-[#FFF4E0]",
      badge: "border-brand-primary text-brand-primary bg-transparent",
      check: "text-success-primary",
    },
    business: {
      border: "border-brand-accent",
      limitBg: "bg-[#FFDFE5]",
      badge: "border-brand-accent text-brand-accent bg-transparent",
      check: "text-success-primary",
    },
    enterprise: {
      border: "border-success-primary",
      limitBg: "bg-[#FFF4E0]",
      badge: "border-success-primary text-success-primary bg-transparent",
      check: "text-success-primary",
    },
  };

  const currentStyle = styles[variant];

  return (
    <div
      className={`relative flex flex-col p-8 rounded-[2.5rem] border-2 bg-white h-full ${currentStyle.border}`}
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="h2 text-text-primary">{name}</h2>
          {badge && (
            <span
              className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                variant === "business"
                  ? "bg-brand-accent text-white"
                  : variant === "enterprise"
                    ? "bg-success-primary text-white"
                    : ""
              }`}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="b4 text-text-secondary mb-6">{description}</p>

        <div className="flex items-baseline gap-1 mb-1">
          <span className="h3 text-text-primary">₱ {price}</span>
          <span className="b1 text-text-secondary">/month</span>
        </div>
        <p className="b5 text-text-secondary mb-4">{billingInfo}</p>

        <div
          className={`inline-block px-4 py-1 rounded-full border b5 ${currentStyle.badge}`}
        >
          {subscriberLabel}
        </div>
      </div>

      <div className="flex-1">
        <p className="b3 text-[11px] uppercase tracking-widest text-text-secondary mb-4">
          {featuresTitle}
        </p>
        <ul className="space-y-3 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex gap-3 items-start">
              <div
                className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border border-success-primary/30 flex items-center justify-center ${currentStyle.check}`}
              >
                <Check className="w-3 h-3" />
              </div>
              <span className="b4 text-text-primary leading-tight">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <div className={`p-5 rounded-2xl mb-8 ${currentStyle.limitBg}`}>
          <p className="b3 text-[11px] uppercase tracking-widest text-text-secondary mb-3">
            Limits
          </p>
          <div className="space-y-1">
            {limits.map((limit, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="b5 text-text-primary">{limit.label}</span>
                <span className="b5 font-bold text-text-primary">
                  {limit.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {variant === "enterprise" && (
          <Button className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white rounded-xl py-6 border-none">
            {buttonText} <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
        )}
        <Button
          variant="outline"
          className={`w-full rounded-xl py-6 border-text-primary text-text-primary hover:bg-gray-50 ${variant === "enterprise" ? "border-text-primary" : ""}`}
        >
          {variant === "enterprise" ? "Talk to Sales" : buttonText}
          {!secondaryButton && variant !== "enterprise" && (
            <ExternalLink className="ml-2 w-4 h-4" />
          )}
        </Button>
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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="h1 text-text-primary mb-2">
            From startup to enterprise, we have you covered.
          </h1>
          <p className="h4 text-text-secondary">
            Pick the plan that's right for you.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-16">
          <div className="bg-white p-1 rounded-2xl border border-brand-primary/30 inline-flex items-center">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-8 py-3 rounded-xl b2 transition-all ${
                billingCycle === "monthly"
                  ? "bg-brand-secondary text-text-primary shadow-sm"
                  : "text-text-secondary"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annually")}
              className={`px-8 py-3 rounded-xl b2 transition-all flex items-center gap-2 ${
                billingCycle === "annually"
                  ? "bg-brand-secondary text-text-primary shadow-sm"
                  : "text-text-secondary"
              }`}
            >
              Annually{" "}
              <span className="text-[10px] font-bold text-success-primary">
                (Save 20%)
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <PlanCard
            variant="basic"
            name="Basic"
            description="Small F&B operators"
            price="499"
            billingInfo="Billed monthly • cancel anytime"
            subscriberLabel="100 subscribers"
            featuresTitle="What's Included"
            features={[
              "QR code digital menu & ordering",
              "Daily sales reports & revenue log",
              "Order management & kitchen display",
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
            description="Growing multi-branch operators"
            price="1,299"
            billingInfo="Billed monthly • cancel anytime"
            subscriberLabel="75 subscribers"
            featuresTitle="Everything in Basic, Plus"
            features={[
              "Unit-based inventory tracking",
              "Daily sales reports & revenue log",
              "QR code digital menu & ordering",
              "Daily sales reports & revenue log",
              "Order management & kitchen display",
            ]}
            limits={[
              { label: "Max. orders/month", value: 500 },
              { label: "Menu items", value: 50 },
              { label: "Staff accounts", value: 3 },
              { label: "Branch", value: 1 },
            ]}
            buttonText="Get started free"
          />

          <PlanCard
            variant="enterprise"
            name="Enterprise"
            badge="Gemini AI"
            description="Chains and large franchises"
            price="3,999"
            billingInfo="Annual billing saves ₱9,600 • cancel anytime"
            subscriberLabel="25 subscribers"
            featuresTitle="Everything in Business, Plus"
            features={[
              "Gemini AI concierge (AI-powered)",
              "Measurement-based inventory (g, mL, pcs)",
              "Priority 24/7 support with dedicated manager",
              "Unit-based inventory tracking",
              "Daily sales reports & revenue log",
              "QR code digital menu & ordering",
            ]}
            limits={[
              { label: "Max. orders/month", value: 500 },
              { label: "Menu items", value: 50 },
              { label: "Staff accounts", value: 3 },
              { label: "Branch", value: 1 },
            ]}
            buttonText="Start with Enterprise"
          />
        </div>

        {/* Footer info */}
        <div className="text-center space-y-6">
          <p className="b2 text-text-primary">
            No hidden fees. Cancel anytime. All plans include a{" "}
            <span className="font-bold">14-day free trial.</span>
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-text-secondary">
            <div className="flex items-center gap-2 b4">
              <Users className="w-4 h-4" /> 255 restaurants trust Qios
            </div>
            <div className="flex items-center gap-2 b4">
              <ShieldCheck className="w-4 h-4" /> SOC 2 compliant · data secure
            </div>
            <div className="flex items-center gap-2 b4">
              <Timer className="w-4 h-4" /> Setup in under 30 minutes
            </div>
          </div>
        </div>
      </div>

      {/* Blend Layer to Footer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-0"
        style={{
          background: "linear-gradient(to bottom, transparent, #FFFFFF)",
        }}
      />
    </section>
  );
}
