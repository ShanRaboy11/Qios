"use client";

import React, { useRef, useLayoutEffect } from "react";
import {
  CheckCircle2,
  Sparkles,
  LayoutDashboard,
  QrCode,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cardsData = [
  {
    id: 1,
    title: "Zero Hardware Cost",
    desc: "Use any mobile device as a kiosk. Your customers' phones become your ordering terminals instantly.",
    icon: CheckCircle2,
    bgColor: "bg-brand-accent",
    textColor: "text-white",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    rotate: -6,
  },
  {
    id: 2,
    title: "QR Mobile Ordering",
    desc: "Scan, order, and pay in seconds. Eliminate counter congestion with automated digital ordering.",
    icon: QrCode,
    bgColor: "bg-brand-primary",
    textColor: "text-text-primary",
    iconBg: "bg-white/40",
    iconColor: "text-text-primary",
    rotate: 2,
  },
  {
    id: 3,
    title: "Perfect Accuracy",
    desc: "Let Gemini AI handle the 'Extra Spicy, No Onions' requests. Every modifier captured, zero errors.",
    icon: Sparkles,
    bgColor: "bg-text-primary",
    textColor: "text-white",
    iconBg: "bg-white/10",
    iconColor: "text-brand-primary",
    rotate: -4,
  },
  {
    id: 4,
    title: "Real-Time Inventory",
    desc: "Automated digital ordering system with transaction logging and live inventory deduction.",
    icon: TrendingUp,
    bgColor: "bg-success-primary",
    textColor: "text-white",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    rotate: 4,
  },
  {
    id: 5,
    title: "Total Transparency",
    desc: "Monitor your staff, revenue, and inventory from anywhere—even while you're on Bantayan Island.",
    icon: LayoutDashboard,
    bgColor: "bg-text-primary",
    textColor: "text-white",
    iconBg: "bg-white/10",
    iconColor: "text-brand-accent",
    rotate: -2,
  },
];

export const ProblemSolution = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3500",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          pinSpacing: true,
        },
      });

      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const isLastCard = index === cardsData.length - 1;
        if (isLastCard && isMobile) return;

        tl.to(
          card,
          {
            y: "-130vh",
            x: index % 2 === 0 ? -60 : 60,
            rotate: index % 2 === 0 ? "-=15" : "+=15",
            duration: 1,
            ease: "power2.inOut",
          },
          index * 0.8,
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-bg-primary"
    >
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent z-[5] pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 z-0">
        <div
          style={{
            width: "600px",
            height: "600px",
            borderRadius: "600px",
            background: "#FFE5BE",
            position: "absolute",
            left: "-10%",
            top: "10%",
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            width: "500px",
            height: "500px",
            borderRadius: "500px",
            background: "#FFBDC6",
            position: "absolute",
            right: "-5%",
            bottom: "10%",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="absolute inset-x-0 top-16 md:inset-0 flex flex-col items-center justify-start md:justify-center pointer-events-none z-0">
        <h2 className="text-[20vw] md:text-[18vw] font-figtree font-black text-text-primary/[0.04] leading-[0.85] tracking-tighter uppercase whitespace-nowrap">
          Problems
        </h2>
        <h2 className="text-[20vw] md:text-[18vw] font-figtree font-black text-text-primary/[0.04] leading-[0.85] tracking-tighter uppercase whitespace-nowrap">
          Solved
        </h2>
      </div>

      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {cardsData.map((card, index) => (
          <div
            key={card.id}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            style={{
              transform: `rotate(${card.rotate}deg)`,
              zIndex: cardsData.length - index,
            }}
            className={`absolute w-[85vw] max-w-[380px] aspect-[4/5] rounded-[32px] md:rounded-[40px] p-8 md:p-10 flex flex-col justify-between shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border-2 border-white/10 origin-bottom ${card.bgColor} ${card.textColor}`}
          >
            <div>
              <div
                className={`w-16 h-16 rounded-[20px] flex items-center justify-center mb-8 shadow-inner ${card.iconBg} ${card.iconColor}`}
              >
                <card.icon size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl md:text-4xl font-figtree font-bold mb-4 leading-tight tracking-tight">
                {card.title}
              </h3>
              <p className="font-inter text-base md:text-lg opacity-90 leading-relaxed font-medium">
                {card.desc}
              </p>
            </div>

            <div className="flex justify-end w-full">
              <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center opacity-40 transition-opacity hover:opacity-100 cursor-pointer">
                <ArrowUpRight size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
