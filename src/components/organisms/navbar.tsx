"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { ArrowRight, Menu, X } from "lucide-react";

interface NavbarProps {
  variant?: "filled" | "transparent";
  className?: string;
}

export const Navbar = ({ variant = "filled", className }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav
      ref={navRef}
      className={cn(
        "relative z-50 flex items-center justify-between w-full overflow-visible",
        "px-[25px] md:px-[79px] py-[10px]",
        "gap-x-8 transition-colors duration-300",
        variant === "filled" || isOpen ? "bg-bg-primary" : "bg-transparent",
        className,
      )}
    >
      <div
        className={cn(
          "absolute top-[-32px] left-0 w-full h-[32px] transition-colors duration-300 md:hidden",
          isOpen ? "bg-bg-primary" : "bg-transparent",
        )}
      />

      <div
        className="font-ibrand shrink-0 relative"
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
          className="text-brand-accent font-inter font-medium text-[18px] shrink-0 transition-colors"
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
            className="text-[18px]"
            rightIcon={<ArrowRight size={18} strokeWidth={2.5} />}
          >
            Get Started
          </Button>
        </div>
      </div>

      <div className="md:hidden flex items-center relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none transition-transform duration-300 active:scale-90"
        >
          <div
            className={cn(
              "transition-all duration-300 transform",
              isOpen ? "rotate-90 scale-110" : "rotate-0 scale-100",
            )}
          >
            {isOpen ? (
              <X className="text-brand-accent" size={32} />
            ) : (
              <Menu className="text-brand-accent" size={32} />
            )}
          </div>
        </button>
      </div>

      <div
        className={cn(
          "absolute top-full left-0 w-full bg-bg-primary border-t border-white/10 flex flex-col p-6 gap-6 md:hidden z-50 shadow-xl transition-all duration-300 ease-in-out origin-top",
          "rounded-b-[24px]",
          isOpen
            ? "opacity-100 scale-y-100 visible"
            : "opacity-0 scale-y-95 invisible pointer-events-none",
        )}
      >
        <a
          href="#home"
          onClick={() => setIsOpen(false)}
          className="text-brand-accent font-inter font-medium text-[18px] transition-colors active:opacity-70"
        >
          Home
        </a>
        <a
          href="#services"
          onClick={() => setIsOpen(false)}
          className="text-text-primary hover:text-brand-accent active:text-brand-accent transition-colors font-inter font-medium text-[18px]"
        >
          Services
        </a>
        <a
          href="#contact"
          onClick={() => setIsOpen(false)}
          className="text-text-primary hover:text-brand-accent active:text-brand-accent transition-colors font-inter font-medium text-[18px]"
        >
          Contact
        </a>
        <div className="pt-2">
          <Button
            variant="accent"
            shape="pill"
            className="w-full justify-center active:scale-[0.98] transition-transform text-[18px]"
            rightIcon={<ArrowRight size={18} strokeWidth={2.5} />}
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};
