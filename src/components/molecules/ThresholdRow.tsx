"use client";

import React, { useMemo } from "react";
import { Input } from "@/components/atoms/Input";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";

export interface ThresholdRowProps {
  ingredientName: string;
  unit: string;
  onHand: number;
  lowValue: string;
  onLowChange: (value: string) => void;
  criticalValue: string;
  onCriticalChange: (value: string) => void;
  className?: string;
}

export const ThresholdRow = ({
  ingredientName,
  unit,
  onHand,
  lowValue,
  onLowChange,
  criticalValue,
  onCriticalChange,
  className,
}: ThresholdRowProps) => {
  const isInvalid = useMemo(() => {
    const low = Number(lowValue);
    const crit = Number(criticalValue);
    if (
      !isNaN(low) &&
      !isNaN(crit) &&
      lowValue !== "" &&
      criticalValue !== ""
    ) {
      return crit >= low;
    }
    return false;
  }, [lowValue, criticalValue]);

  const status = useMemo(() => {
    const low = Number(lowValue);
    const crit = Number(criticalValue);
    if (isNaN(low) || isNaN(crit) || lowValue === "" || criticalValue === "")
      return "Enough";

    if (onHand <= crit) return "Critical";
    if (onHand <= low) return "Low";
    return "Enough";
  }, [onHand, lowValue, criticalValue]);

  const badgeProps = useMemo(() => {
    switch (status) {
      case "Critical":
        return { color: "error" as const, text: "Critical" };
      case "Low":
        return { color: "primary" as const, text: "Low" }; // Yellow/Orange
      case "Enough":
      default:
        return { color: "success" as const, text: "Enough" };
    }
  }, [status]);

  return (
    <div
      className={cn(
        "flex flex-col md:grid md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] items-start md:items-center gap-4 md:gap-6 p-4 md:py-6 md:px-0 border md:border-0 md:border-b border-[#E5E5E5] md:last:border-b-0 rounded-xl md:rounded-none bg-white",
        className,
      )}
    >
      {/* Mobile Header: Name & Status */}
      <div className="flex md:hidden w-full justify-between items-center mb-2">
        <span className="b3 text-text-primary font-bold">{ingredientName}</span>
        <Badge color={badgeProps.color} variant="subtle" shape="rounded">
          {badgeProps.text}
        </Badge>
      </div>

      {/* Ingredient Name (Desktop) */}
      <div className="hidden md:flex items-center">
        <span className="b3 text-text-primary font-medium">
          {ingredientName}
        </span>
      </div>

      {/* Unit & On Hand */}
      <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-2">
        <span className="b5 md:hidden text-text-secondary font-medium">
          On Hand
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-text-primary">{onHand}</span>
          <span className="b5 text-text-secondary">{unit}</span>
        </div>
      </div>

      {/* Low Threshold */}
      <div className="w-full flex flex-col gap-1">
        <span className="b5 md:hidden text-text-secondary font-medium mb-1">
          Low Level
        </span>
        <Input
          align="center"
          type="number"
          value={lowValue}
          onChange={(e) => onLowChange(e.target.value)}
          placeholder="0"
          isError={isInvalid}
          className="rounded-xl border-[#E5E5E5] shadow-sm w-full md:max-w-[120px] mx-auto font-bold text-text-primary"
        />
      </div>

      {/* Critical Threshold */}
      <div className="w-full flex flex-col gap-1">
        <span className="b5 md:hidden text-text-secondary font-medium mb-1">
          Critical Level
        </span>
        <Input
          align="center"
          type="number"
          value={criticalValue}
          onChange={(e) => onCriticalChange(e.target.value)}
          placeholder="0"
          isError={isInvalid}
          className="rounded-xl border-[#E5E5E5] shadow-sm w-full md:max-w-[120px] mx-auto font-bold text-text-primary"
        />
        {isInvalid && (
          <span className="text-[10px] text-warning-primary text-center mt-1">
            Must be &lt; Low
          </span>
        )}
      </div>

      {/* Status (Desktop) */}
      <div className="hidden md:flex justify-end w-full">
        <Badge
          color={badgeProps.color}
          variant="outline"
          shape="rounded"
          className="justify-start"
        >
          {badgeProps.text}
        </Badge>
      </div>
    </div>
  );
};
