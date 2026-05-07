"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type BadgeColor =
  | "primary"
  | "accent"
  | "success"
  | "error"
  | "info"
  | "secondary"
  | "warning";
export type BadgeVariant = "solid" | "subtle" | "outline" | "ghost";
export type BadgeShape = "pill" | "rounded";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  color?: BadgeColor;
  variant?: BadgeVariant;
  shape?: BadgeShape;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

const shapeStyles = {
  pill: "rounded-full",
  rounded: "rounded-[8px]",
};

const badgeStyles = {
  primary: {
    solid: "bg-brand-primary text-text-tertiary backdrop-blur-sm",
    subtle: "bg-brand-primary/20 text-brand-primary",
    outline:
      "bg-brand-primary/20 border border-brand-primary text-brand-primary",
    ghost:
      "bg-white/30 text-brand-primary border border-white/30 backdrop-blur-sm",
  },
  accent: {
    solid: "bg-brand-accent text-text-tertiary backdrop-blur-sm",
    subtle: "bg-brand-accent/20 text-brand-accent",
    outline: "bg-brand-accent/20 border border-brand-accent text-brand-accent",
    ghost:
      "bg-white/40 text-brand-accent border border-white/30 backdrop-blur-sm",
  },
  success: {
    solid: "bg-success-primary text-text-tertiary backdrop-blur-sm",
    subtle: "bg-success-secondary text-success-primary",
    outline:
      "bg-success-secondary border border-success-primary text-success-primary",
    ghost:
      "bg-white/40 text-success-primary border border-white/30 backdrop-blur-sm",
  },
  error: {
    solid: "bg-warning-primary text-text-tertiary backdrop-blur-sm",
    subtle: "bg-warning-secondary text-warning-primary",
    outline:
      "bg-warning-secondary border border-warning-primary text-warning-primary",
    ghost:
      "bg-white/40 text-warning-primary border border-white/30 backdrop-blur-sm",
  },
  info: {
    solid: "bg-[#3B82F6] text-white backdrop-blur-sm",
    subtle: "bg-[#3B82F6]/10 text-[#3B82F6]",
    outline: "bg-[#3B82F6]/10 border border-[#3B82F6] text-[#3B82F6]",
    ghost: "bg-white/40 text-[#3B82F6] border border-white/30 backdrop-blur-sm",
  },
  secondary: {
    solid: "bg-[#8B5CF6] text-white backdrop-blur-sm",
    subtle: "bg-[#8B5CF6]/10 text-[#8B5CF6]",
    outline: "bg-[#8B5CF6]/10 border border-[#8B5CF6] text-[#8B5CF6]",
    ghost: "bg-white/40 text-[#8B5CF6] border border-white/30 backdrop-blur-sm",
  },
  warning: {
    solid: "bg-[#F59E0B] text-white backdrop-blur-sm",
    subtle: "bg-[#F59E0B]/10 text-[#F59E0B]",
    outline: "bg-[#F59E0B]/10 border border-[#F59E0B] text-[#F59E0B]",
    ghost: "bg-white/40 text-[#F59E0B] border border-white/30 backdrop-blur-sm",
  },
};

/*example usage
<Badge color="primary" variant="outline" shape="rounded" leftIcon={badgeIcon} rightIcon={badgeIcon}>Text</Badge>
 */

export const Badge = ({
  children,
  color = "primary",
  variant = "subtle",
  shape = "pill",
  leftIcon,
  rightIcon,
  className,
  ...props
}: BadgeProps) => {
  const styles = badgeStyles[color][variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 b4 whitespace-nowrap transition-all",
        shapeStyles[shape],
        styles,
        className,
      )}
      {...props}
    >
      {leftIcon && (
        <span className="flex-shrink-0 flex items-center">{leftIcon}</span>
      )}
      <span className="flex-grow">{children}</span>
      {rightIcon && (
        <span className="flex-shrink-0 flex items-center">{rightIcon}</span>
      )}
    </span>
  );
};

/*example usage
<Badge color="error" variant="outline" leftIcon={badgeIcon} rightIcon={badgeIcon}>Text</Badge>
<Badge color="success" variant="outline" leftIcon={badgeIcon} rightIcon={badgeIcon}>Text</Badge> 
*/
