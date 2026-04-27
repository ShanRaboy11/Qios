"use client";
import React from "react";
import { 
  Check, 
  Pizza, 
  Coffee, 
  Utensils, 
  ChefHat, 
  IceCream, 
  Sandwich, 
  Grape,
  UtensilsCrossed,
  Soup,
  Cake
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  steps: any[];
  currentStep: number;
}

export function OnboardingSidebar({ steps, currentStep }: SidebarProps) {
  const rainItems = [
    { Icon: Pizza, left: "8%", size: 44, dur: "10s", delay: "0s" },
    { Icon: Coffee, left: "22%", size: 32, dur: "15s", delay: "2s" },
    { Icon: Utensils, left: "38%", size: 28, dur: "13s", delay: "5s" },
    { Icon: ChefHat, left: "58%", size: 50, dur: "18s", delay: "1s" },
    { Icon: UtensilsCrossed, left: "72%", size: 38, dur: "12s", delay: "7s" },
    { Icon: IceCream, left: "88%", size: 34, dur: "20s", delay: "3s" },
    { Icon: Sandwich, left: "18%", size: 42, dur: "14s", delay: "10s" },
    { Icon: Grape, left: "48%", size: 26, dur: "22s", delay: "4s" },
    { Icon: Soup, left: "82%", size: 36, dur: "16s", delay: "8s" },
    { Icon: Cake, left: "30%", size: 34, dur: "19s", delay: "6s" },
  ];

  return (
    <div className={cn(
      "w-full lg:w-[45%] xl:w-[55%] h-auto lg:h-screen sticky lg:fixed top-0 left-0 z-40 overflow-hidden",
      "flex flex-row lg:flex-col justify-center items-center lg:items-start px-6 py-8 lg:px-24",
      "bg-gradient-to-br from-[#FFF5E9] via-[#FFD8B1] to-[#FFCC99] border-b lg:border-b-0 lg:border-r border-orange-200"
    )}>
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        
        <div 
          className="absolute -top-[5%] -left-[5%] w-[80%] h-[80%] rounded-full opacity-40 blur-[120px] animate-pulse"
          style={{ backgroundColor: 'var(--color-brand-primary)', animationDuration: '10s' }}
        />
        
        {rainItems.map((item, idx) => (
          <div
            key={idx}
            className="absolute animate-food-rain"
            style={{
              left: item.left,
              top: "-100px",
              animationDuration: item.dur,
              animationDelay: item.delay,
              color: '#E85D04', 
              opacity: 0.5, 
              filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' 
            }}
          >
            <item.Icon size={item.size} strokeWidth={2} />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/40" />
      </div>

      <style jsx>{`
        @keyframes food-rain {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .animate-food-rain { animation: food-rain linear infinite; }
      `}</style>

      {/* CONTENT LOGIC */}
      <div className="flex flex-row lg:flex-col gap-4 md:gap-12 lg:gap-12 relative w-full justify-center lg:justify-start z-10">
        {steps.map((step, index) => {
          const isDone = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="relative flex flex-col lg:flex-row items-center gap-2 lg:gap-10 flex-1 lg:flex-none">
              
              {/* CONNECTOR LINES */}
              {index !== steps.length - 1 && (
                <>
                  <div className={cn(
                    "hidden lg:block absolute left-[39px] top-[80px] h-[48px] border-l-2 border-dashed transition-colors duration-500",
                    isDone ? "border-[var(--color-success-primary)]" : "border-[var(--color-brand-accent)]/20"
                  )} />

                  <div className={cn(
                    "lg:hidden absolute left-[50%] top-[20px] w-full border-t-2 border-dashed -z-10 transition-colors duration-500",
                    isDone ? "border-[var(--color-success-primary)]" : "border-[var(--color-brand-accent)]/20"
                  )} />
                </>
              )}
              
              {/* ICON CIRCLE */}
              <div className={cn(
                "w-10 h-10 lg:w-20 lg:h-20 rounded-full flex items-center justify-center z-10 transition-all duration-500 border-2 lg:border-4",
                isDone ? "bg-[var(--color-success-secondary)] text-[var(--color-success-primary)] border-[var(--color-success-secondary)]" : 
                isActive ? "bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-secondary)] shadow-xl shadow-orange-200/50" : 
                "bg-white/80 border-white/40 text-neutral-400" 
              )}>
                {isDone ? (
                  <Check className="w-5 h-5 lg:w-8 lg:h-8" strokeWidth={3} />
                ) : (
                  <step.icon className="w-5 h-5 lg:w-8 lg:h-8" />
                )}
              </div>

              {/* STEP TITLE */}
              <span className={cn(
                "hidden sm:block whitespace-nowrap transition-colors text-[10px] lg:text-xl font-figtree",
                isActive || isDone ? "text-[var(--color-text-primary)] font-bold" : "text-[var(--color-text-secondary)]/60"
              )}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}