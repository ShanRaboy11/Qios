import React from "react";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  device: string;
  location: string;
  status: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onRevoke?: () => void;
}

export const SessionCard = ({
  device,
  location,
  status,
  icon,
  isActive = false,
  onRevoke,
}: SessionCardProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-xl transition-colors",
        isActive
          ? "border border-brand-accent/20 bg-brand-primary/5"
          : "border border-gray-100 bg-white hover:bg-gray-50",
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(isActive ? "text-brand-accent" : "text-text-secondary")}
        >
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-text-primary">{device}</h4>
          <p className="text-xs text-text-secondary mt-0.5">
            {location} • {status}
          </p>
        </div>
      </div>
      {isActive ? (
        <span className="text-xs font-bold text-brand-accent bg-white px-2 py-1 rounded-md border border-brand-accent/10 shadow-sm">
          Active Now
        </span>
      ) : (
        <button
          onClick={onRevoke}
          className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors"
        >
          Revoke
        </button>
      )}
    </div>
  );
};
