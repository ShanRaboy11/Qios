"use client";

import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  initialValue?: number;
  minValue?: number;
  maxValue?: number;
  onChange?: (value: number) => void;
  className?: string;
  variant?: "primary" | "accent" | "outline";
}

export const QuantityStepper = ({
  initialValue = 1,
  minValue = 0,
  maxValue = 99,
  onChange,
  className,
  variant = "accent",
}: QuantityStepperProps) => {
  const [value, setValue] = useState(initialValue);

  const handleIncrement = () => {
    if (value < maxValue) {
      const newValue = value + 1;
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleDecrement = () => {
    if (value > minValue) {
      const newValue = value - 1;
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Button
        variant={variant === "accent" ? "outline" : "primary"}
        size="icon"
        shape="rounded"
        onClick={handleDecrement}
        disabled={value <= minValue}
        type="button"
      >
        <Minus className="w-2 h-2 stroke-[3px]" />
      </Button>

      <span className="b1 min-w-[20px] text-center font-bold text-text-primary select-none">
        {value}
      </span>
      <Button
        variant={variant}
        size="icon"
        shape="rounded"
        onClick={handleIncrement}
        disabled={value >= maxValue}
        type="button"
      >
        <Plus className="w-2 h-2 stroke-[3px]" />
      </Button>
    </div>
  );
};
