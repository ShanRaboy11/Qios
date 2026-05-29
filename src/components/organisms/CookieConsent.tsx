"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import { X, Cookie } from "lucide-react";

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem("qios_cookie_consent");
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("qios_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("qios_cookie_consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto md:w-[420px] z-[999] animate-in slide-in-from-bottom-5 duration-500 fade-in">
      <div className="bg-white/90 backdrop-blur-xl border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-t-3xl md:rounded-3xl p-6 relative overflow-hidden">
        {/* Soft decorative background element */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5 text-brand-primary" />
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-text-secondary hover:text-text-primary transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>
          
          <div>
            <h3 className="font-figtree font-bold text-lg text-text-primary mb-1">
              We value your privacy
            </h3>
            <p className="b2 text-text-secondary leading-relaxed text-[14px]">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <Button 
              variant="outline" 
              className="w-full sm:flex-1 h-11"
              onClick={handleDecline}
            >
              Reject All
            </Button>
            <Button 
              variant="primary" 
              className="w-full sm:flex-1 h-11 bg-brand-primary text-white hover:bg-brand-primary/90"
              onClick={handleAccept}
            >
              Accept All
            </Button>
          </div>
          
          <div className="text-center mt-1">
            <Link 
              href="/legal/cookie-policy" 
              className="text-[12px] font-medium text-text-secondary hover:text-brand-accent transition-colors underline underline-offset-2"
            >
              Read our Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
