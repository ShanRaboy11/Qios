"use client";

import React, { useState, useRef, useEffect } from "react";
import { Clock, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { Required } from "./BusinessInformation";

const countries = [
  { name: "Philippines", code: "ph", dial: "+63" },
  { name: "United States", code: "us", dial: "+1" },
  { name: "United Kingdom", code: "gb", dial: "+44" },
  { name: "Singapore", code: "sg", dial: "+65" },
  { name: "Australia", code: "au", dial: "+61" },
];

// --- Sub-component: Country Selector ---
function CountryCodeSelect({ onSelect }: { onSelect: (dial: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(countries[0]);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const filtered = countries.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search)
  );

  return (
    <div className="relative h-full" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 h-full cursor-pointer border-r border-neutral-200 hover:bg-neutral-50 transition-colors"
      >
        <img 
          src={`https://flagcdn.com/w40/${selected.code}.png`} 
          alt={selected.name} 
          className="w-6 h-4 rounded-sm object-cover" 
        />
        <ChevronDown size={14} className={cn("text-neutral-500 transition-transform", isOpen && "rotate-180")} />
        <span className="b2 text-neutral-500 font-medium">({selected.dial})</span>
      </div>

      {isOpen && (
        <div className="absolute top-[55px] left-0 w-[240px] bg-white border-2 border-neutral-100 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-neutral-50 bg-neutral-50">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                className="w-full h-8 pl-8 pr-2 bg-white rounded-lg text-xs outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {filtered.map((c) => (
              <div 
                key={c.code} 
                onClick={() => { setSelected(c); onSelect(c.dial); setIsOpen(false); }} 
                className="px-4 py-2.5 hover:bg-orange-50 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img src={`https://flagcdn.com/w40/${c.code}.png`} alt="" className="w-5 h-3 shadow-sm" />
                  <span className="text-sm font-medium text-neutral-700">{c.name}</span>
                </div>
                <span className="text-xs font-bold text-neutral-400">{c.dial}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main Component ---
export function ContactInformation({ onNext }: { onNext: () => void }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer Countdown Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const startVerification = () => {
    if (isPhoneValid) {
      setTimeLeft(45);
      setIsTimerRunning(true);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const val = value.replace(/\D/g, "");
    if (!val && value !== "") return;
    
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 3) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const isPhoneValid = phoneNumber.length >= 10;
  const isOtpComplete = otp.every(digit => digit !== "");

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Phone Number Input Section */}
      <div className="space-y-2">
        <label className="b4 ml-1 font-medium text-text-secondary">
          Contact Number <Required />
        </label>
        <div className="flex items-center border-2 border-neutral-200 rounded-[15px] bg-white overflow-hidden focus-within:border-[var(--color-brand-primary)] transition-all h-[52px]">
          <CountryCodeSelect onSelect={() => {}} />
          <input
            type="text"
            placeholder="963 469 4776"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
            className="flex-1 px-4 outline-none b2 text-text-primary bg-transparent"
          />
          <button
            onClick={startVerification}
            disabled={!isPhoneValid}
            className={cn(
              "px-6 h-full b2 font-bold transition-all text-white",
              isPhoneValid ? "bg-[#A68966] hover:brightness-95" : "bg-[#D2C1B0] cursor-not-allowed"
            )}
          >
            Send Code
          </button>
        </div>
      </div>

      {/* Verification / OTP Section */}
      <div className="flex flex-col items-center space-y-10 pt-4">
        {/* Timer and Resend Link */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 b2 font-bold text-text-primary">
            <Clock size={18} />
            <span>00 : {timeLeft.toString().padStart(2, '0')}</span>
          </div>
          <button
            onClick={startVerification}
            className="b2 text-[#D2C1B0] border-b border-[#D2C1B0] font-semibold hover:text-[#A68966] transition-colors"
          >
            Resend Code
          </button>
        </div>

        {/* 4 Digit OTP Inputs */}
        <div className="flex gap-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { otpInputs.current[i] = el; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              className={cn(
                "w-16 h-12 bg-transparent border-b-2 text-center text-2xl outline-none transition-all duration-300 font-inter",
                digit !== "" || (i === 0 && otp[0] === "") ? "border-[#A68966]" : "border-slate-300"
              )}
            />
          ))}
        </div>

        {/* Confirm Button using the Button Atom */}
        <Button
          variant="primary"
          shape="pill"
          size="lg"
          className={cn(
            "w-full h-16 shadow-none transition-all duration-500",
            isOtpComplete ? "bg-[#A68966] text-white opacity-100" : "bg-[#D2C1B0] text-white/80 opacity-90 cursor-not-allowed hover:scale-100"
          )}
          onClick={() => isOtpComplete && onNext()}
          disabled={!isOtpComplete}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}