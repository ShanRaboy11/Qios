"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  LayoutDashboard,
  QrCode,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

const cardsData = [
  {
    id: 5,
    title: "Total Transparency",
    desc: "Monitor your staff, revenue, and inventory from anywhere — even while you're on Bantayan Island.",
    icon: LayoutDashboard,
    bgColor: "bg-bg-primary",
    textColor: "text-text-primary",
    iconBg: "bg-brand-secondary/40",
    iconColor: "text-brand-accent",
    rotate: -2,
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
];

export const ProblemSolution = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress across the container's 500vh height
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[500vh] bg-bg-primary"
    >
      {/* Sticky container that locks to the screen while scrolling */}
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Massive Background Typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
          <h2 className="text-[20vw] md:text-[18vw] font-figtree font-black text-text-primary/[0.04] leading-[0.85] tracking-tighter uppercase whitespace-nowrap">
            Problems
          </h2>
          <h2 className="text-[20vw] md:text-[18vw] font-figtree font-black text-text-primary/[0.04] leading-[0.85] tracking-tighter uppercase whitespace-nowrap">
            Solved
          </h2>
        </div>

        {/* Stacked Cards */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          {cardsData.map((card, index) => (
            <StackedCard
              key={card.id}
              card={card}
              index={index}
              progress={scrollYProgress}
              totalCards={cardsData.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const StackedCard = ({ card, index, progress, totalCards }: any) => {
  const isLastCard = index === 0;

  // Highest index (top of visual stack) peels off first
  const reverseIndex = totalCards - 1 - index;
  const step = totalCards > 1 ? 1 / (totalCards - 1) : 1;

  // Securely clamp math so offsets NEVER exceed 1.0 (prevents Framer API crashes)
  let start = isLastCard ? 0 : Math.min(reverseIndex * step, 0.99);
  let end = isLastCard ? 1 : Math.min(start + step, 1);

  // Fallback to ensure 'end' is strictly greater than 'start'
  if (start >= end) {
    start = end - 0.01;
  }

  // Use "vh" instead of "px" so it fully flies off-screen on any device height
  const flyOutY = useTransform(
    progress,
    [start, end],
    ["0vh", isLastCard ? "0vh" : "-120vh"],
  );

  const flyOutX = useTransform(
    progress,
    [start, end],
    [0, isLastCard ? 0 : index % 2 === 0 ? -50 : 50],
  );

  const flyOutRotate = useTransform(
    progress,
    [start, end],
    [
      card.rotate,
      isLastCard ? card.rotate : card.rotate + (index % 2 === 0 ? -20 : 20),
    ],
  );

  let opStart = end - 0.05;
  if (opStart <= start) {
    opStart = start + 0.01;
  }

  const opacity = useTransform(
    progress,
    [opStart, end],
    [1, isLastCard ? 1 : 0],
  );

  return (
    <motion.div
      style={{
        y: flyOutY,
        x: flyOutX,
        rotate: flyOutRotate,
        opacity,
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
    </motion.div>
  );
};
