import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconTextColor?: string;
  status: "Connected" | "Not Configured";
  onAction?: () => void;
}

export const IntegrationCard = ({
  name,
  description,
  icon,
  iconBgColor = "bg-[#F0F5FA]",
  iconTextColor = "text-[#1A82E2]",
  status,
  onAction,
}: IntegrationCardProps) => {
  const isConnected = status === "Connected";

  return (
    <div className="p-5 rounded-2xl border border-gray-100 hover:border-brand-accent/30 transition-colors bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBgColor, iconTextColor)}>
            {icon}
          </div>
          <h3 className="font-bold text-text-primary">{name}</h3>
        </div>
        <span className={cn(
          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
          isConnected ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
        )}>
          {status}
        </span>
      </div>
      <p className="text-sm text-text-secondary mb-4">{description}</p>
      <Button
        variant={isConnected ? "primary" : "accent"}
        className={cn("w-full justify-center h-10 py-0", isConnected && "bg-transparent border border-gray-200 text-text-primary hover:text-brand-accent shadow-none")}
        onClick={onAction}
      >
        {isConnected ? "Configure" : "Connect"}
      </Button>
    </div>
  );
};
