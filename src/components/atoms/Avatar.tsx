import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
  status?: "online" | "offline" | "busy" | "away";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
};

const statusColors = {
  online: "bg-success-primary",
  offline: "bg-gray-300",
  busy: "bg-warning-primary",
  away: "bg-brand-primary",
};

export const Avatar = ({ src, initials, size = "md", status, className }: AvatarProps) => {
  return (
    <div className={cn("relative inline-block", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-bold overflow-hidden bg-brand-primary/20 text-brand-accent",
          sizeClasses[size]
        )}
      >
        {src ? (
          <img src={src} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span>{initials?.substring(0, 2).toUpperCase() || "?"}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-white",
            statusColors[status],
            size === "sm" ? "w-2 h-2" : size === "md" ? "w-2.5 h-2.5" : "w-3 h-3"
          )}
        />
      )}
    </div>
  );
};
