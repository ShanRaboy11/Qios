import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Register GSAP plugin
gsap.registerPlugin(useGSAP);

export interface PromoItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

const PROMO_DATA: PromoItem[] = [
  {
    id: 1,
    subtitle: "Experience our delicious new dish",
    title: "30% Discount",
    image: "/images/lasagna.png",
  },
  {
    id: 2,
    subtitle: "Rich and Savory",
    title: "Steak Special",
    image: "/images/steak.png",
  },
  {
    id: 3,
    subtitle: "A taste of Japan",
    title: "Sushi Special",
    image: "/images/sushi.png",
  },
];

export const PromoBanner = ({ className }: { className?: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Animation Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === PROMO_DATA.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000); // Changes every 5 seconds

    // Clean up the timer when the component unmounts
    return () => clearInterval(timer);
  }, []);

  // 2. GSAP Animation (remains the same)
  useGSAP(() => {
    gsap.to(sliderRef.current, {
      xPercent: -currentIndex * 100,
      duration: 1, // Smooth slide
      ease: "power2.inOut",
    });
  }, [currentIndex]);

  return (
    <div
      className={cn(
        "w-full flex flex-col items-center overflow-hidden",
        className,
      )}
    >
      {/* Banner Container */}
      <div
        ref={containerRef}
        className="w-full relative bg-brand-accent rounded-[32px] overflow-hidden shadow-sm min-h-[160px] md:min-h-[200px]"
      >
        {/* The "Sliding" Wrapper */}
        <div ref={sliderRef} className="flex h-full w-full">
          {PROMO_DATA.map((item) => (
            <div
              key={item.id}
              className="w-full flex-shrink-0 flex min-h-[160px] md:min-h-[200px]"
            >
              {/* Left Section */}
              <div className="w-1/2 relative p-6 flex flex-col justify-center items-center text-center z-10">
                <div className="absolute -top-10 -left-6 w-24 h-24 rounded-full border-[6px] border-white blur-[5px]" />
                <div className="absolute -bottom-8 right-4 w-20 h-20 rounded-full border-[8px] border-white blur-[5px]" />

                <div className="relative z-20">
                  <p className="b4 md:text-[14px] leading-tight opacity-90 max-w-[120px] mx-auto">
                    {item.subtitle}
                  </p>
                  <h2 className="text-brand font-inter font-black text-[22px] md:text-[28px] tracking-tight mt-1">
                    {item.title}
                  </h2>
                </div>
              </div>

              {/* Right Section */}
              <div className="w-1/2 relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-r-[30px] md:rounded-r-[80px]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Dots (Clickable) */}
      <div className="flex gap-2 mt-6">
        {PROMO_DATA.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              currentIndex === index
                ? "w-6 bg-[#FFDC72]"
                : "w-4 bg-[#FFDC72]/30",
            )}
          />
        ))}
      </div>
    </div>
  );
};
