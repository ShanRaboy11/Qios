"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { ArrowRight } from "lucide-react";

interface NavbarProps {
  variant?: "filled" | "transparent";
  className?: string;
}

export const Navbar = ({ variant = "filled", className }: NavbarProps) => {
  return (
    <nav
      className={cn(
        "flex items-center justify-between w-full px-6 md:px-[79px] py-[10px]",
        variant === "filled" ? "bg-bg-primary" : "bg-transparent",
        className,
      )}
    >
      <div
        className="font-ibrand"
        style={{
          textAlign: "right",
          fontSize: "50px",
          fontWeight: 400,
          fontStyle: "normal",
          lineHeight: "normal",
          background:
            "linear-gradient(to bottom right, #FFD77A 0%, #FF5269 50%) bottom right / 50% 50% no-repeat, linear-gradient(to bottom left, #FFD77A 0%, #FF5269 50%) bottom left / 50% 50% no-repeat, linear-gradient(to top left, #FFD77A 0%, #FF5269 50%) top left / 50% 50% no-repeat, linear-gradient(to top right, #FFD77A 0%, #FF5269 50%) top right / 50% 50% no-repeat",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Qios
      </div>

      <div className="hidden md:flex items-center gap-[60px]">
        <a
          href="#home"
          className="text-brand-accent font-inter font-medium text-[18px]"
        >
          Home
        </a>
        <a
          href="#services"
          className="text-text-primary hover:text-brand-accent transition-colors font-inter font-medium text-[18px]"
        >
          Services
        </a>
        <a
          href="#contact"
          className="text-text-primary hover:text-brand-accent transition-colors font-inter font-medium text-[18px]"
        >
          Contact
        </a>
      </div>

      <Button
        variant="accent"
        shape="pill"
        rightIcon={<ArrowRight size={18} strokeWidth={2.5} />}
      >
        Get Started
      </Button>
    </nav>
  );
};
