"use client";

import React, { useState, useRef, useEffect } from "react";
import { Clock, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { Required } from "./BusinessInformation";

interface ContactInformationProps {
  onNext: () => void;
}

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
    <div className="relative h-full flex items-center" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 px-4 h-full cursor-pointer border-r-2 transition-all duration-300 rounded-l-[18px]",
          isOpen ? "border-[var(--color-brand-primary)] bg-white" : "border-neutral-100 hover:bg-neutral-50"
        )}
      >
        <img src={`https://flagcdn.com/w40/${selected.code}.png`} alt="" className="w-7 h-3 rounded-sm object-cover" />
        <ChevronDown size={20} className={cn("text-neutral-400 transition-transform duration-300", isOpen && "rotate-180")} />
        <span className="b2 text-neutral-600 font-medium whitespace-nowrap">({selected.dial})</span>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+12px)] left-0 w-[240px] bg-white border-2 border-[#E5E5E5] rounded-2xl shadow-xl z-[999] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="p-2 border-b border-neutral-100 bg-neutral-50/50">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                className="w-full h-9 pl-9 pr-3 bg-white border border-neutral-200 rounded-xl text-sm outline-none focus:border-[var(--color-brand-primary)]"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <ul className="max-h-[220px] overflow-y-auto">
            {filtered.map((c) => (
              <li
                key={c.code}
                onClick={() => { setSelected(c); onSelect(c.dial); setIsOpen(false); }}
                className={cn(
                  "px-5 py-3.5 b2 cursor-pointer flex items-center justify-between hover:bg-slate-50",
                  selected.code === c.code ? "text-[var(--color-brand-primary)] bg-orange-50/30 font-bold" : "text-text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <img src={`https://flagcdn.com/w40/${c.code}.png`} alt="" className="w-10 h-5" />
                  <span>{c.name}</span>
                </div>
                <span className="text-xs opacity-40">{c.dial}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const countries = [
  { name: "Philippines", code: "ph", dial: "+63" },
  { name: "United States", code: "us", dial: "+1" },
  { name: "Singapore", code: "sg", dial: "+65" },
];

export function ContactInformation({ onNext }: ContactInformationProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) setIsTimerRunning(false);
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const isPhoneValid = phoneNumber.length >= 10;
  const isOtpComplete = otp.every(digit => digit !== "");

  return (
    // ROOT FIX: Added flex flex-col items-center to center both sections
    <div className="flex flex-col items-center w-full space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
      
      {/* 1. TOP PART: Phone Input Box */}
      <div className="w-full max-w-[550px] space-y-2">
        <label className="b4 ml-1 font-medium text-text-secondary text-left block">
          Contact Number <Required />
        </label>
        
        <div className={cn(
          "relative flex items-center border-2 rounded-[20px] bg-white h-[60px] w-full transition-all duration-300",
          isFocused 
            ? "border-[var(--color-brand-primary)] shadow-[0_0_0_2px_rgba(255,198,112,0.15)]" 
            : "border-neutral-200"
        )}>
          <CountryCodeSelect onSelect={() => {}} />
          
          <input
            type="text"
            placeholder="963 469 4776"
            value={phoneNumber}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
            className="flex-1 px-5 outline-none b2 text-text-primary bg-transparent font-medium"
          />

          <button
            onClick={() => { if(isPhoneValid) { setTimeLeft(45); setIsTimerRunning(true); }}}
            disabled={!isPhoneValid}
            className={cn(
              "px-10 h-full flex flex-col items-center justify-center text-center b2 font-bold transition-all text-white rounded-r-[18px] leading-tight min-w-[50px]",
              isPhoneValid 
                ? "bg-[var(--color-brand-primary)] hover:brightness-95" 
                : "bg-neutral-200 cursor-not-allowed"
            )}
          >
            Send<br/>Code
          </button>
        </div>
      </div>

      {/* 2. BOTTOM PART: Timer, OTP, and Button (Now centered within the container) */}
      <div className="flex flex-col items-center w-full max-w-[550px] space-y-12 pt-4">
        {/* Timer UI */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 b2 font-bold text-text-primary text-xl">
            <Clock size={20} className={timeLeft > 0 ? "text-[var(--color-brand-primary)]" : "text-neutral-400"} />
            <span>00 : {timeLeft.toString().padStart(2, '0')}</span>
          </div>
          <button
            onClick={() => { if (timeLeft === 0) { setTimeLeft(45); setIsTimerRunning(true); }}}
            className={cn(
              "b2 border-b-2 font-bold transition-all",
              timeLeft === 0 
                ? "text-[var(--color-brand-primary)] border-[var(--color-brand-primary)] cursor-pointer" 
                : "text-neutral-300 border-transparent cursor-not-allowed"
            )}
          >
            Resend Code
          </button>
        </div>

        {/* OTP Inputs */}
        <div className="flex gap-8 justify-center">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { otpInputs.current[i] = el; }}
              type="text" maxLength={1} value={digit}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                const newOtp = [...otp]; newOtp[i] = val; setOtp(newOtp);
                if (val && i < 3) otpInputs.current[i+1]?.focus();
              }}
              className={cn(
                "w-10 h-10 bg-transparent border-b-2 text-center text-2xl outline-none transition-all duration-300",
                digit !== "" || (i === 0 && otp[0] === "") ? "border-[var(--color-brand-primary)]" : "border-slate-200"
              )}
            />
          ))}
        </div>

        <Button
          variant="primary"
          size="lg"
          className={cn(
            "w-[400px] h-[60px] text-l font-bold transition-all duration-500 shadow-none border-none max-w-[480px]",
            isOtpComplete ? "bg-[var(--color-brand-primary)] text-text-tertiary scale-[1.02]" : "bg-neutral-50 text-white cursor-not-allowed"
          )}
          onClick={() => isOtpComplete && onNext()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}