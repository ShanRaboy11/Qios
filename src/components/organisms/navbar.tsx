"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { ArrowRight, Menu, X, User, LogOut, Settings } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import Link from "next/link";
import { useRouter, useParams, usePathname } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import QRCode from "react-qr-code";
import { QrCode as QrIcon } from "lucide-react";
import {
  clearAuthSessionExpiry,
  getAuthSessionExpiry,
  isAuthSessionExpired,
} from "@/lib/authSession";

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
  const [isQrOpen, setIsQrOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const [tenantDisplayName, setTenantDisplayName] = useState("Tenant");
  const [tenantDisplayEmail, setTenantDisplayEmail] =
    useState("tenant@qios.com");
  const [tenantAvatarInitials, setTenantAvatarInitials] = useState("TU");
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const tenantId = (params?.id as string) || "default-tenant";

  useEffect(() => {
    if (type !== "tenant") return;

    let isMounted = true;

    const loadTenantHeader = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: authData } = await supabase.auth.getUser();
        const user = authData.user;

        if (!user || !isMounted) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle();

        const metadata = user.user_metadata as Record<string, unknown> | null;
        const nameFromMetadata =
          typeof metadata?.full_name === "string" && metadata.full_name.trim()
            ? metadata.full_name.trim()
            : typeof metadata?.display_name === "string" &&
                metadata.display_name.trim()
              ? metadata.display_name.trim()
              : "";

        const displayName =
          nameFromMetadata ||
          profile?.full_name?.trim() ||
          user.email ||
          "Tenant";
        const displayEmail = user.email || "tenant@qios.com";
        const initialsSource = displayName
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2);

        setTenantDisplayName(displayName);
        setTenantDisplayEmail(displayEmail);
        setTenantAvatarInitials(
          initialsSource.length > 1
            ? `${initialsSource[0].charAt(0)}${initialsSource[1].charAt(0)}`.toUpperCase()
            : displayName.charAt(0).toUpperCase() || "TU",
        );
      } catch {
        if (!isMounted) return;
        setTenantDisplayName("Tenant");
        setTenantDisplayEmail("tenant@qios.com");
        setTenantAvatarInitials("TU");
      }
    };

    void loadTenantHeader();

    return () => {
      isMounted = false;
    };
  }, [type]);

  const handleLogout = async () => {
    clearAuthSessionExpiry();
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    router.push("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleSessionExpiry = () => {
      const expiresAt = getAuthSessionExpiry();
      if (!expiresAt) return;

      const remaining = expiresAt - Date.now();
      if (remaining <= 0 || isAuthSessionExpired()) {
        void handleLogout();
        return;
      }

      const timeout = window.setTimeout(() => {
        void handleLogout();
      }, remaining);

      return () => window.clearTimeout(timeout);
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
      if (
        isQrOpen &&
        qrRef.current &&
        !qrRef.current.contains(event.target as Node)
      ) {
        setIsQrOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("pointerdown", handleClickOutside);
    const clearSessionTimer = handleSessionExpiry();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("pointerdown", handleClickOutside);
      clearSessionTimer?.();
    };
  }, [isOpen, isProfileOpen, isQrOpen, type]);

  const defaultLinks = [
    { label: "Home", href: "/", id: "home" },
    { label: "Services", href: "/services", id: "services" },
    { label: "Contact", href: "/contact", id: "contact" },
  ];

  const adminLinks = [
    { label: "Dashboard", href: "/admin/dashboard", id: "dashboard" },
    {
      label: "Tenant Directory",
      href: "/admin/tenant_directory",
      id: "tenant_directory",
    },
    {
      label: "Subscription and Plans",
      href: "/admin/subscription",
      id: "subscription",
    },
    {
      label: "System Activity",
      href: "/admin/system_activity",
      id: "system_activity",
    },
  ];

  const tenantLinks = [
    { label: "Dashboard", href: `/${tenantId}/dashboard`, id: "dashboard" },
    { label: "Menu Management", href: `/${tenantId}/menu`, id: "menu" },
    {
      label: "Inventory Configuration",
      href: `/${tenantId}/inventory`,
      id: "inventory",
    },
    { label: "Staff Management", href: `/${tenantId}/staff`, id: "staff" },
    { label: "Sales", href: `/${tenantId}/sales`, id: "sales" },
    { label: "Audit Logs", href: `/${tenantId}/audit_logs`, id: "audit_logs" },
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
        href={
          type === "admin" || type === "tenant" || type === "employee"
            ? "#"
            : "/"
        }
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
              if (
                type === "admin" ||
                type === "tenant" ||
                type === "employee"
              ) {
                e.preventDefault();
                onNavigate?.(link.id);
              }
            }}
            className={cn(
              "transition-colors font-inter font-medium text-[18px] shrink-0",
              ((type === "admin" || type === "tenant" || type === "employee") &&
                activeView === link.id) ||
                (type === "default" && pathname === link.href)
                ? "text-brand-accent"
                : "text-text-primary hover:text-brand-accent",
            )}
          >
            {link.label}
          </a>
        ))}

        {type !== "admin" && type !== "tenant" && type !== "employee" ? (
          <div className="shrink-0">
            <Link href="/login">
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
          <div className="shrink-0 relative flex items-center gap-4">
            {type === "tenant" && (
              <div className="relative" ref={qrRef}>
                <button
                  onClick={() => setIsQrOpen(!isQrOpen)}
                  className={cn(
                    "p-2 rounded-full border transition-all duration-300 focus:outline-none ring-2 ring-transparent focus:ring-brand-accent/50 hover:bg-brand-accent/10 hover:text-brand-accent",
                    isQrOpen
                      ? "bg-brand-accent text-white border-brand-accent shadow-sm"
                      : "border-brand-accent/20 text-text-secondary bg-white",
                  )}
                  title="Show Store QR"
                >
                  <QrIcon size={20} />
                </button>

                {isQrOpen && (
                  <div className="absolute right-0 top-[calc(100%+12px)] w-64 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-5 flex flex-col items-center">
                    <p className="text-[14px] font-bold text-text-primary text-center mb-3">
                      Store QR Code
                    </p>
                    <div className="bg-white p-2 border border-gray-100 rounded-lg">
                      <QRCode
                        value={`${typeof window !== "undefined" ? window.location.origin : ""}/${tenantId}/home`}
                        size={160}
                        level="H"
                        fgColor="#1A1A1A"
                        bgColor="#FFFFFF"
                      />
                    </div>
                    <p className="text-[12px] text-text-secondary text-center mt-3">
                      Customers can scan this to open your store menu.
                    </p>
                    <Link
                      href={`/${tenantId}/settings?tab=store&section=store-access-qr`}
                      onClick={() => setIsQrOpen(false)}
                      className="mt-4 text-[13px] text-brand-accent font-medium hover:underline"
                    >
                      More QR Options
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="rounded-full border border-brand-accent/20 hover:scale-110 transition-transform duration-300 focus:outline-none ring-2 ring-transparent focus:ring-brand-accent/50 shadow-sm"
              >
                <Avatar
                  initials={type === "admin" ? "AD" : tenantAvatarInitials}
                  size="md"
                  status="online"
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-56 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 py-2">
                  <div className="px-4 py-3 border-b border-gray-50 mb-2">
                    <p className="text-[15px] font-bold text-text-primary truncate">
                      {type === "admin"
                        ? "Admin User"
                        : type === "employee"
                          ? "Employee User"
                          : tenantDisplayName}
                    </p>
                    <p className="text-[13px] text-text-secondary truncate mt-0.5">
                      {type === "admin"
                        ? "admin@qios.com"
                        : type === "employee"
                          ? "employee@qios.com"
                          : tenantDisplayEmail}
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
                      handleLogout();
                    }}
                  >
                    <LogOut className="w-[18px] h-[18px]" />
                    Log out
                  </button>
                </div>
              )}
            </div>
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
              if (
                type === "admin" ||
                type === "tenant" ||
                type === "employee"
              ) {
                e.preventDefault();
                onNavigate?.(link.id);
              }
              setIsOpen(false);
            }}
            className={cn(
              "transition-colors font-inter font-medium text-[18px] active:opacity-70",
              ((type === "admin" || type === "tenant" || type === "employee") &&
                activeView === link.id) ||
                (type === "default" && pathname === link.href)
                ? "text-brand-accent"
                : "text-text-primary hover:text-brand-accent active:text-brand-accent",
            )}
          >
            {link.label}
          </a>
        ))}
        {type !== "admin" && type !== "tenant" ? (
          <div className="pt-2">
            <Link href="/login" onClick={() => setIsOpen(false)}>
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
                handleLogout();
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
