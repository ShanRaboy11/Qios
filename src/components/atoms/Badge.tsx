"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type BadgeColor = "primary" | "accent" | "success" | "error";
export type BadgeVariant = "solid" | "subtle" | "outline";
export type BadgeShape = "pill" | "rounded";

export interface BadgeProps {
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
  },
  accent: {
    solid: "bg-brand-accent text-text-tertiary backdrop-blur-sm",
    subtle: "bg-brand-accent/20 text-brand-accent",
    outline: "bg-brand-accent/20 border border-brand-accent text-brand-accent",
  },
  success: {
    solid: "bg-success-primary text-text-tertiary backdrop-blur-sm",
    subtle: "bg-success-secondary text-success-primary",
    outline:
      "bg-success-secondary border border-success-primary text-success-primary",
  },
  error: {
    solid: "bg-warning-primary text-text-tertiary backdrop-blur-sm",
    subtle: "bg-warning-secondary text-warning-primary",
    outline:
      "bg-warning-secondary border border-warning-primary text-warning-primary",
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
}: BadgeProps) => {
  const styles = badgeStyles[color][variant];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 b4 whitespace-nowrap transition-all",
        shapeStyles[shape],
        styles,
        className,
      )}
    >
      {leftIcon && (
        <span className="flex-shrink-0 flex items-center">{leftIcon}</span>
      )}
      <span className="flex-grow">{children}</span>
      {rightIcon && (
        <span className="flex-shrink-0 flex items-center">{rightIcon}</span>
      )}
    </div>
  );
};

/*example usage
<Badge color="error" variant="outline" leftIcon={badgeIcon} rightIcon={badgeIcon}>Text</Badge>
<Badge color="success" variant="outline" leftIcon={badgeIcon} rightIcon={badgeIcon}>Text</Badge> 
*/
