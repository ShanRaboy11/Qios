import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
  align?: "left" | "center";
}

/*example usage

<Input placeholder="Email Address" />
<Input defaultValue="Email Address" isError />
<Input placeholder="Email Address" align="center" />
*/
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, isError, align = "left", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full bg-white font-inter text-sm md:text-[16px] px-6 py-3.5 transition-all duration-300 outline-none rounded-2xl border-2",
          "placeholder:text-text-secondary text-text-primary",
          align === "center" ? "text-center" : "text-left",
          isError
            ? "border-warning-primary bg-warning-secondary focus:border-warning-primary focus:shadow-[0_0_0_2px_rgba(236,19,19,0.1)]"
            : "border-[#E5E5E5] focus:border-brand-primary focus:shadow-[0_0_0_2px_rgba(255,198,112,0.15)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
