"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { ArrowRight, Menu, X, User, LogOut, Settings } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import Link from "next/link";

interface NavbarProps {
  variant?: "filled" | "transparent";
  type?: "default" | "admin" | "tenant" | "employee";
  activeView?: string;
  onNavigate?: (view: string) => void;
  className?: string;
}

export const Navbar = ({
  variant: initialVariant = "transparent",
  type = "default",
  activeView,
  onNavigate,
  className,
}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      if (
        isProfileOpen &&
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const defaultLinks = [
    { label: "Home", href: "#home", id: "home" },
    { label: "Services", href: "#services", id: "services" },
    { label: "Contact", href: "#contact", id: "contact" },
  ];

  const adminLinks = [
    { label: "Dashboard", href: "#", id: "dashboard" },
    { label: "Tenant Directory", href: "#", id: "tenant" },
    { label: "Subscription and Plans", href: "#", id: "subscription" },
    { label: "System Activity", href: "#", id: "system_activity" },
  ];

  const tenantLinks = [
    { label: "Dashboard", href: "#", id: "dashboard" },
    { label: "Menu Management", href: "#", id: "menu" },
    { label: "Inventory Configuration", href: "#", id: "inventory" },
    { label: "Staff Management", href: "#", id: "staff" },
    { label: "Sales", href: "#", id: "sales" },
    { label: "Audit Logs", href: "#", id: "audit_logs" },
  ];

  const employeeLinks = [
    { label: "Dashboard", href: "#", id: "dashboard" },
    { label: "Order Queue", href: "#", id: "queue" },
    { label: "Scanner", href: "#", id: "scanner" },
    { label: "Inventory Audit", href: "#", id: "inventory_audit" },
    { label: "Transactions", href: "#", id: "transactions" },
  ];

  const links =
    type === "admin"
      ? adminLinks
      : type === "tenant"
        ? tenantLinks
        : type === "employee"
          ? employeeLinks
          : defaultLinks;

  return (
    <nav
      ref={navRef}
      className={cn(
        "fixed left-0 right-0 z-[100] flex items-center justify-between w-full overflow-visible",
        "px-[25px] md:px-[79px] transition-all duration-300 py-[10px]",
        isScrolled || initialVariant === "filled" ? "top-0" : "top-8",
        isScrolled || initialVariant === "filled" || isOpen
          ? "bg-bg-primary shadow-sm"
          : "bg-transparent",
        className,
      )}
    >
      <div
        className={cn(
          "absolute top-[-32px] left-0 w-full h-[32px] transition-colors duration-300 md:hidden",
          isOpen ? "bg-bg-primary" : "bg-transparent",
        )}
      />

      <Link
        href={type === "admin" || type === "tenant" || type === "employee" ? "#" : "/"}
        onClick={(e) => {
          if (type === "admin" || type === "tenant" || type === "employee") {
            e.preventDefault();
            onNavigate?.("dashboard");
          }
        }}
        className="font-ibrand shrink-0 relative cursor-pointer"
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
      </Link>

      <div
        className={cn(
          "hidden md:flex items-center shrink-0",
          "gap-x-6 lg:gap-x-12",
        )}
      >
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            onClick={(e) => {
              if (type === "admin" || type === "tenant" || type === "employee") {
                e.preventDefault();
                onNavigate?.(link.id);
              }
            }}
            className={cn(
              "transition-colors font-inter font-medium text-[18px] shrink-0",
              ((type === "admin" || type === "tenant") &&
                activeView === link.id) ||
                (type === "default" && link.id === "home")
                ? "text-brand-accent"
                : "text-text-primary hover:text-brand-accent",
            )}
          >
            {link.label}
          </a>
        ))}

        {type !== "admin" && type !== "tenant" && type !== "employee" ? (
          <div className="shrink-0">
            <Link href="/onboarding">
              <Button
                variant="accent"
                shape="rounded"
                className="text-[18px]"
                rightIcon={<ArrowRight size={18} strokeWidth={2.5} />}
              >
                Get Started
              </Button>
            </Link>
          </div>
        ) : (
          <div className="shrink-0 relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="rounded-full border border-brand-accent/20 hover:scale-110 transition-transform duration-300 focus:outline-none ring-2 ring-transparent focus:ring-brand-accent/50 shadow-sm"
            >
              <Avatar 
                initials={type === "admin" ? "AD" : "TU"} 
                size="md" 
                status="online"
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-[calc(100%+12px)] w-56 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 py-2">
                <div className="px-4 py-3 border-b border-gray-50 mb-2">
                  <p className="text-[15px] font-bold text-text-primary truncate">
                    {type === "admin" ? "Admin User" : type === "employee" ? "Employee User" : "Tenant User"}
                  </p>
                  <p className="text-[13px] text-text-secondary truncate mt-0.5">
                    {type === "admin" ? "admin@qios.com" : type === "employee" ? "employee@qios.com" : "tenant@qios.com"}
                  </p>
                </div>
                <button
                  className="w-full text-left px-4 py-2.5 text-[14px] text-text-primary hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onNavigate?.("settings");
                  }}
                >
                  <Settings className="w-[18px] h-[18px]" />
                  Account Settings
                </button>
                <div className="h-px bg-gray-50 my-2" />
                <button
                  className="w-full text-left px-4 py-2.5 text-[14px] text-[#EF4444] hover:bg-red-50 flex items-center gap-3 transition-colors font-bold"
                  onClick={() => {
                    setIsProfileOpen(false);
                    window.location.href = "/";
                  }}
                >
                  <LogOut className="w-[18px] h-[18px]" />
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
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
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            onClick={(e) => {
              if (type === "admin" || type === "tenant" || type === "employee") {
                e.preventDefault();
                onNavigate?.(link.id);
              }
              setIsOpen(false);
            }}
            className={cn(
              "transition-colors font-inter font-medium text-[18px] active:opacity-70",
              ((type === "admin" || type === "tenant" || type === "employee") &&
                activeView === link.id) ||

                (type === "default" && link.id === "home")
                ? "text-brand-accent"
                : "text-text-primary hover:text-brand-accent active:text-brand-accent",
            )}
          >
            {link.label}
          </a>
        ))}
        {type !== "admin" && type !== "tenant" ? (
          <div className="pt-2">
            <Link href="/onboarding" onClick={() => setIsOpen(false)}>
              <Button
                variant="accent"
                shape="rounded"
                className="w-full justify-center active:scale-[0.98] transition-transform text-[18px]"
                rightIcon={<ArrowRight size={18} strokeWidth={2.5} />}
              >
                Get Started
              </Button>
            </Link>
          </div>
        ) : (
          <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-2">
            <button
              className="w-full text-left py-3 px-2 text-[18px] text-text-primary hover:text-brand-accent active:text-brand-accent flex items-center gap-3 transition-colors font-medium rounded-xl hover:bg-gray-50"
              onClick={() => {
                setIsOpen(false);
                onNavigate?.("settings");
              }}
            >
              <Settings className="w-5 h-5" />
              Account Settings
            </button>
            <button
              className="w-full text-left py-3 px-2 text-[18px] text-[#EF4444] hover:text-[#EF4444] active:text-[#EF4444] flex items-center gap-3 transition-colors font-bold rounded-xl hover:bg-red-50"
              onClick={() => {
                setIsOpen(false);
                window.location.href = "/";
              }}
            >
              <LogOut className="w-5 h-5" />
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
