"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { ArrowRight, Menu } from "lucide-react";

interface NavbarProps {
  variant?: "filled" | "transparent";
  className?: string;
}

export const Navbar = ({ variant = "filled", className }: NavbarProps) => {
  return (
    <nav
      className={cn(
        "flex items-center justify-between w-full overflow-hidden",
        "px-[25px] md:px-[79px] py-[10px]",
        "gap-x-8",
        variant === "filled" ? "bg-bg-primary" : "bg-transparent",
        className,
      )}
    >
      <div
        className="font-ibrand shrink-0"
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

      <div
        className={cn(
          "hidden md:flex items-center shrink-0",
          "gap-x-6 lg:gap-x-12",
        )}
      >
        <a
          href="#home"
          className="text-brand-accent font-inter font-medium text-[18px] shrink-0"
        >
          Home
        </a>
        <a
          href="#services"
          className="text-text-primary hover:text-brand-accent transition-colors font-inter font-medium text-[18px] shrink-0"
        >
          Services
        </a>
        <a
          href="#contact"
          className="text-text-primary hover:text-brand-accent transition-colors font-inter font-medium text-[18px] shrink-0"
        >
          Contact
        </a>

        <div className="shrink-0">
          <Button
            variant="accent"
            shape="pill"
            rightIcon={<ArrowRight size={18} strokeWidth={2.5} />}
          >
            Get Started
          </Button>
        </div>
      </div>

      <div className="md:hidden flex items-center">
        <Menu className="text-brand-accent cursor-pointer" size={32} />
      </div>
    </nav>
  );
};
