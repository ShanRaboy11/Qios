import React, { useState } from "react";
import { Check, ExternalLink, Info, Sparkles, Rocket } from "lucide-react";
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

  const styles = {
    basic: {
      border: "border-[#ffc670]/80",
      bg: "bg-white bg-gradient-to-b from-white to-[#FFF1D6]",
      checkBg: "bg-[#ffc670]/20",
      checkIcon: "text-[#ffc670]",
    },
    business: {
      border: "border-[#ff5269]/80",
      bg: "bg-white bg-gradient-to-b from-white to-[#FFDFE4]",
      checkBg: "bg-[#ff5269]/20",
      checkIcon: "text-[#ff5269]",
    },
    enterprise: {
      border: "border-[#1fad66]/80",
      bg: "bg-white bg-gradient-to-b from-white to-[#DFF2E8]",
      checkBg: "bg-[#1fad66]/20",
      checkIcon: "text-[#1fad66]",
    },
  }[variant];

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-[2.5rem] p-8 h-full border transition-all duration-300",
        styles.bg,
        styles.border,
        isBusiness ? "shadow-2xl z-20" : "shadow-md z-10",
      )}
    >
      {isBusiness && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
          <Badge
            color="accent"
            variant="solid"
            className="py-1 px-4 shadow-md font-bold text-[10px]"
          >
            MOST POPULAR
          </Badge>
        </div>
      )}

      <div className={cn("text-center mb-6", isBusiness ? "mt-6" : "mt-0")}>
        <div className="flex flex-col items-center gap-3 mb-4">
          {badge && !isBusiness && (
            <Badge
              color={isEnterprise ? "success" : "primary"}
              variant="subtle"
              className="text-[10px] py-1 px-4 font-bold"
              leftIcon={
                isEnterprise ? (
                  <Sparkles size={12} />
                ) : isBasic ? (
                  <Rocket size={12} />
                ) : null
              }
            >
              {badge}
            </Badge>
          )}
          <h3 className="text-[31px] font-bold leading-[125%] text-text-primary">
            {name}
          </h3>
        </div>
        <p className="b4 text-text-secondary h-10 leading-tight max-w-[240px] mx-auto">
          {description}
        </p>
      </div>

      <div className="text-center mb-8">
        <div className="flex items-baseline justify-center">
          <span className="h2 text-text-primary">₱{price}</span>
          <span className="b2 text-text-secondary ml-1">/month</span>
        </div>
        <p className="b5 font-medium text-text-secondary mt-1">{billingInfo}</p>
      </div>

      <div className="flex-1">
        <div className="h-[1px] w-full bg-black/10 mb-6" />
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-secondary/60 mb-5 text-center">
          {featuresTitle}
        </p>
        <ul className="space-y-4 mb-8 lg:pl-6">
          {features.map((feature, i) => (
            <li key={i} className="flex gap-3 items-start">
              <div
                className={cn(
                  "mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                  styles.checkBg,
                )}
              >
                <Check
                  className={cn("w-3 h-3 stroke-[4px]", styles.checkIcon)}
                />
              </div>
              <span className="b4 text-text-primary leading-tight">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-2">
          {notes.map((note, i) => (
            <div key={i} className="flex items-center gap-1.5 opacity-80">
              <Info size={13} className="text-text-secondary" />
              <span className="text-[11px] font-medium text-text-secondary">
                {note.label}
              </span>
            </div>
          ))}
        </div>

        <Button
          variant={isBusiness ? "accent" : "outline"}
          shape="rounded"
          size="md"
          className={cn(
            "w-full text-sm md:text-base",
            isEnterprise &&
              "border-success-primary text-success-primary hover:bg-success-primary hover:text-white hover:border-success-primary",
          )}
          rightIcon={<ExternalLink size={16} />}
        >
          Get Started
        </Button>
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
      className="relative w-full py-32 px-6 bg-bg-primary overflow-hidden"
      id="subscription"
    >
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-bg-primary via-bg-primary/50 to-transparent pointer-events-none z-[10]" />
      <div
        className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, #FFD77A 0%, transparent 70%)",
          filter: "blur(110px)",
        }}
      />
      <div
        className="absolute -bottom-[15%] -right-[10%] w-[70%] h-[70%] rounded-full opacity-35 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, #FF5269 0%, transparent 70%)",
          filter: "blur(130px)",
        }}
      />
      <div
        className="absolute top-1/4 right-[5%] w-[40%] h-[50%] rounded-full opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, #ffc670 0%, transparent 60%)",
          filter: "blur(90px)",
        }}
      />
      <div
        className="absolute bottom-1/4 left-[5%] w-[30%] h-[40%] rounded-full opacity-15 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, #FF5269 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h1 className="h1 text-text-primary tracking-tight max-w-2xl mx-auto">
            From startup to enterprise, <br />
            <span style={gradientHeaderStyle}>we have you covered.</span>
          </h1>
          <p className="h4 text-text-secondary whitespace-nowrap overflow-hidden">
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
                className="text-[10px] px-2.5 py-0.5 border border-white/20 font-bold"
              >
                SAVE 15%
              </Badge>
            </button>
          </div>
        </div>

        <div className="w-full">
          <div className="group flex flex-col lg:flex-row justify-center items-center gap-16 lg:gap-0">
            <div className="w-full max-w-md lg:w-1/3 transition-all duration-500 ease-out lg:-mr-2 group-hover:lg:-translate-x-12">
              <PlanCard
                variant="basic"
                name="Basic"
                badge="Starter Ready"
                description="Perfect for small F&B operators starting digital."
                price={billingCycle === "monthly" ? "1,499" : "1,274"}
                billingInfo={
                  billingCycle === "monthly"
                    ? "Billed monthly"
                    : "₱15,290 billed annually"
                }
                featuresTitle="What's Included"
                features={[
                  "QR mobile ordering",
                  "Simple digital menu + cart",
                  "Order status tracking",
                  "Basic sales summary",
                  "1 store only",
                ]}
                notes={[
                  { label: "Cancel anytime" },
                  { label: "7-day guarantee" },
                ]}
              />
            </div>
            <div className="w-full max-w-md lg:w-1/3 z-20 transition-all duration-500 ease-out lg:scale-110 group-hover:lg:scale-105">
              <PlanCard
                variant="business"
                name="Business"
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
                notes={[
                  { label: "Cancel anytime" },
                  { label: "14-day guarantee" },
                ]}
              />
            </div>
            <div className="w-full max-w-md lg:w-1/3 transition-all duration-500 ease-out lg:-ml-2 group-hover:lg:translate-x-12">
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
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent pointer-events-none z-0" />
    </section>
  );
}
