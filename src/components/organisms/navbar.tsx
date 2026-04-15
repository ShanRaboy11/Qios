import React from "react";
import { ArrowRight } from "lucide-react";

const Navbar = () => {
  return (
    <nav
      className="flex items-center justify-between mx-auto"
      style={{
        width: "1439px",
        padding: "10px 79px",
        background: "#FFF9EF",
        fontFamily: "Inter, sans-serif", // Standard clean sans-serif matching the UI
      }}
    >
      {/* Logo Section */}
      <div className="flex items-center">
        <span className="text-[36px] font-bold tracking-tight leading-none bg-gradient-to-br from-[#FF5E7B] via-[#FF8C8C] to-[#FFB783] bg-clip-text text-transparent">
          Qios
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-[60px]">
        <a
          href="#home"
          className="text-[#FF5B79] text-[18px] font-medium transition-opacity hover:opacity-80"
        >
          Home
        </a>
        <a
          href="#services"
          className="text-[#2D2D2D] text-[18px] font-medium transition-colors hover:text-[#FF5B79]"
        >
          Services
        </a>
        <a
          href="#contact"
          className="text-[#2D2D2D] text-[18px] font-medium transition-colors hover:text-[#FF5B79]"
        >
          Contact
        </a>
      </div>

      {/* CTA Button */}
      <button className="flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#FF5B79] to-[#FF758C] text-white font-semibold text-[16px] shadow-sm hover:opacity-90 transition-all active:scale-95">
        Get Started
        <ArrowRight size={18} strokeWidth={2.5} />
      </button>
    </nav>
  );
};

export default Navbar;
