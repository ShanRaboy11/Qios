"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { ArrowRight } from "lucide-react";

interface NavbarProps {
  variant?: "filled" | "transparent";
  className?: string;
}

const NavLink = ({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) => (
  <a
    href={href}
    className={cn(
      "font-inter font-medium text-[18px] transition-colors duration-200 hover:text-brand-accent",
      active ? "text-brand-accent" : "text-text-primary",
    )}
  >
    {children}
  </a>
);

export const Navbar = ({ variant = "filled", className }: NavbarProps) => {
  return (
    <nav
      className={cn(
        "flex items-center justify-between w-full max-w-[1439px] mx-auto px-[79px] py-[10px]",
        variant === "filled" ? "bg-bg-primary" : "bg-transparent",
        className,
      )}
    >
      {/* Logo Atom */}
      <div className="flex items-center">
        <span className="text-[36px] font-bold tracking-tight leading-none bg-gradient-to-br from-[#FF5E7B] via-brand-accent to-brand-primary bg-clip-text text-transparent font-inter">
          Qios
        </span>
      </div>

      {/* Nav Links Molecule */}
      <div className="flex items-center gap-[60px]">
        <NavLink href="#home" active>
          Home
        </NavLink>
        <NavLink href="#services">Services</NavLink>
        <NavLink href="#contact">Contact</NavLink>
      </div>

      {/* Button Atom Instance */}
      <Button
        variant="accent"
        shape="pill"
        rightIcon={<ArrowRight size={18} strokeWidth={2.5} />}
        className="px-[28px] py-[12px]" // Fine-tuning to match Figma's specific button scale
      >
        Get Started
      </Button>
    </nav>
  );
};
