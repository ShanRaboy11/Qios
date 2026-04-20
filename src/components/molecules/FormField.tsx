"use client";

import React, { useState } from "react";
import { Input, InputProps } from "@/components/atoms/Input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface FormFieldProps extends InputProps {
  label: string;
  supportiveText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      supportiveText,
      leftIcon,
      rightIcon,
      isError,
      type = "text",
      className,
      ...props
    },
    ref,
  ) => {
    // State to toggle password visibility
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordType = type === "password";
    // If it's a password and showPassword is true, change type to "text"
    const currentType = isPasswordType && showPassword ? "text" : type;

    return (
      <div className={cn("flex flex-col gap-1.5 w-full max-w-sm", className)}>
        {/* Label - Uses b4 global style */}
        {label && (
          <label
            className={cn(
              "b4 ml-1 transition-colors duration-300 font-medium",
              isError ? "text-warning-primary" : "text-text-secondary",
            )}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center group">
          {/* Left Icon Wrapper */}
          {leftIcon && (
            <div className="absolute left-5 text-text-secondary z-10">
              {leftIcon}
            </div>
          )}

          <Input
            {...props}
            ref={ref}
            type={currentType}
            isError={isError}
            className={cn(
              leftIcon && "pl-14",
              // Add right padding if there is a rightIcon OR if it's a password (for the eye)
              (rightIcon || isPasswordType) && "pr-14",
            )}
          />

          {/* Right Icon / Password Toggle Logic */}
          <div className="absolute right-5 flex items-center z-10">
            {isPasswordType ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-secondary hover:text-brand-primary transition-all active:scale-90 focus:outline-none"
                tabIndex={-1} // Prevent tabbing into the eye icon
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            ) : (
              <div className="text-text-secondary">{rightIcon}</div>
            )}
          </div>
        </div>

        {/* Supportive Text - Uses b5 global style */}
        {supportiveText && (
          <span
            className={cn(
              "b5 ml-1 transition-colors duration-300",
              isError ? "text-warning-primary" : "text-text-tertiary",
            )}
          >
            {supportiveText}
          </span>
        )}
      </div>
    );
  },
);

FormField.displayName = "FormField";
