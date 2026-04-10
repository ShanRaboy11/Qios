import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type StepStatus = "complete" | "current" | "upcoming";

interface Step {
  id: number;
  label: string;
  icon: React.ReactNode;
}

interface StepperBarProps {
  steps: Step[];
  currentStep: number;
  orientation?: "vertical" | "horizontal";
  className?: string;
}

export const StepperBar = ({
  steps,
  currentStep,
  orientation = "vertical",
  className,
}: StepperBarProps) => {
  return (
    <div
      className={cn(
        "flex",
        orientation === "vertical"
          ? "flex-col gap-0"
          : "flex-row items-start gap-8",
        className,
      )}
    >
      {steps.map((step, index) => {
        const isComplete = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        const isLast = index === steps.length - 1;

        const status: StepStatus = isComplete
          ? "complete"
          : isCurrent
            ? "current"
            : "upcoming";

        return (
          <div
            key={step.id}
            className={cn(
              "flex group",
              orientation === "vertical" ? "flex-col" : "flex-row items-center",
            )}
          >
            <div
              className={cn(
                "flex items-center gap-8",
                orientation === "vertical" && "pb-8  relative",
              )}
            >
              {/* Connector Line (Vertical) */}
              {orientation === "vertical" && !isLast && (
                <div className="absolute left-6 top-12 bottom-0 w-[2px] border-l-2 border-dashed border-brand-accent/50" />
              )}

              {/* Step Icon Atom */}
              <div
                className={cn(
                  "size-12 rounded-full flex items-center justify-center transition-all duration-300 z-10",
                  status === "complete" && "bg-green-100 text-green-600",
                  status === "current" &&
                    "bg-brand-secondary text-text-primary shadow-md scale-110",
                  status === "upcoming" &&
                    "bg-brand-secondary/30 text-text-secondary/80",
                )}
              >
                {status === "complete" ? <Check size={20} /> : step.icon}
              </div>

              {/* Step Label */}
              <span
                className={cn(
                  "b2 font-medium transition-colors duration-300",
                  status === "upcoming"
                    ? "text-text-secondary"
                    : "text-text-primary",
                )}
              >
                {step.label}
              </span>

              {/* Connector Line (Horizontal) */}
              {orientation === "horizontal" && !isLast && (
                <div className="w-16 border-t-2 border-dashed border-brand-accent/30 mx-2" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
