"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Zap,
  Users,
  Target,
  BarChart,
  ArrowRight,
  CheckCircle2,
  Star,
  Settings,
  Rocket,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Avatar } from "@/components/atoms/Avatar";
import { cn } from "@/lib/utils";
import CardSwap, { Card as SwapCard } from "./CardSwap";

const gradientHeaderStyle = {
  background: "linear-gradient(250deg, #FFD77A 15.53%, #FF5269 84.47%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

// reusable icon box
function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[38px] h-[38px] md:w-[46px] md:h-[46px] min-w-[38px] md:min-w-[46px] rounded-[10px] md:rounded-[13px] flex items-center justify-center relative overflow-hidden bg-brand-accent/10 border border-brand-accent/20">
      <div className="absolute inset-0 rounded-[10px] md:rounded-[13px] bg-gradient-to-br from-white/35 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// reusable card
function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const baseShadow = `
    0 0 0 1px color-mix(in srgb, var(--color-brand-primary) 12%, var(--color-brand-accent) 8%),
    0 4px 20px color-mix(in srgb, var(--color-brand-primary) 6%, transparent),
    0 1px 4px rgba(0,0,0,0.04)
  `;
  const hoverShadow = `
    0 0 0 1px color-mix(in srgb, var(--color-brand-primary) 18%, var(--color-brand-accent) 12%),
    0 8px 30px color-mix(in srgb, var(--color-brand-primary) 22%, transparent),
    0 4px 12px color-mix(in srgb, var(--color-brand-accent) 14%, transparent),
    0 2px 6px rgba(0,0,0,0.06)
  `;

  return (
    <div
      className={cn(
        "bg-white/80 backdrop-blur-sm rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 border relative overflow-hidden transition-all duration-300 group hover:-translate-y-1",
        className
      )}
      style={{
        borderColor:
          "color-mix(in srgb, var(--color-brand-primary) 20%, var(--color-brand-accent) 20%)",
        boxShadow: baseShadow,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = hoverShadow)}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = baseShadow)}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
}

export default function Services() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const features = [
    {
      icon: <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-brand-accent" />,
      title: "Enterprise Security",
      description: "Bank-level encryption keeping your data strictly confidential.",
    },
    {
      icon: <Zap className="w-5 h-5 md:w-6 md:h-6 text-brand-accent" />,
      title: "Fast Performance",
      description: "Sub-second load times for menus and checkout processes.",
    },
    {
      icon: <Users className="w-5 h-5 md:w-6 md:h-6 text-brand-accent" />,
      title: "Multi-Tenant",
      description: "Seamlessly manage multiple store locations from one dashboard.",
    },
    {
      icon: <BarChart className="w-5 h-5 md:w-6 md:h-6 text-brand-accent" />,
      title: "Advanced Analytics",
      description: "Deep insights into peak hours and top-selling items.",
    },
  ];

  const testimonials = [
    {
      quote: "Qios completely transformed our restaurant operations. We cut ordering times by 40% and our staff can finally focus on hospitality rather than logistics.",
      author: "Maria Santos",
      role: "Operations Manager, The Daily Grind",
      initials: "MS",
    },
    {
      quote: "The inventory sync alone is worth the investment. No more manual stock counts or surprising out-of-stock items during peak dinner rushes.",
      author: "David Chen",
      role: "Owner, Spice & Wok",
      initials: "DC",
    },
    {
      quote: "Setting up our digital menu took less than an hour. The interface is incredibly intuitive, even for our staff who aren't tech-savvy.",
      author: "Sarah Johnson",
      role: "Franchise Director",
      initials: "SJ",
    },
  ];

  const differentiators = [
    {
      title: "Zero Hardware Costs",
      desc: "Run entirely on the devices you already own. No expensive POS required.",
    },
    {
      title: "Native AI Integration",
      desc: "Smart order suggestions and dynamic pricing capabilities out-of-the-box.",
    },
    {
      title: "White-Label Ready",
      desc: "Make the platform entirely your own with custom branding and colors.",
    },
  ];

  const processSteps = [
    {
      step: "01",
      icon: <Target className="w-6 h-6 text-brand-primary" />,
      title: "Discovery & Setup",
      desc: "We analyze your menu, current workflows, and business needs.",
    },
    {
      step: "02",
      icon: <Settings className="w-6 h-6 text-brand-primary" />,
      title: "Menu Digitization",
      desc: "Upload items, configure modifiers, set up inventory thresholds.",
    },
    {
      step: "03",
      icon: <Users className="w-6 h-6 text-brand-primary" />,
      title: "Staff Onboarding",
      desc: "Brief training sessions for your team on order management.",
    },
    {
      step: "04",
      icon: <Rocket className="w-6 h-6 text-brand-primary" />,
      title: "Go Live",
      desc: "Deploy your QR codes to tables and start receiving orders.",
    },
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const CTAContent = (
    <div className="flex flex-col items-center justify-center text-center bg-brand-primary rounded-[2rem] p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-brand-primary/20 h-full">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/20 blur-3xl rounded-full" />
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Ready to upgrade your restaurant?
        </h2>
        <p className="text-white/80 text-lg">
          Start your free 14-day trial today. No credit card required.
        </p>
        <Button
          variant="accent"
          size="lg"
          shape="rounded"
          rightIcon={<ArrowRight size={20} />}
          className="mt-4 bg-white text-brand-primary hover:bg-white/90 border-none px-8 py-4 text-lg shadow-xl shadow-black/10"
        >
          Get Started Now
        </Button>
      </div>
    </div>
  );

  return (
    <section className="relative w-full py-20 bg-bg-primary overflow-hidden font-inter">
      {/* background blobs matching contacts.tsx */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-bg-primary via-bg-primary/50 to-transparent pointer-events-none z-10" />
      <div
        className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full opacity-40 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, #FFD77A 0%, transparent 70%)",
          filter: "blur(110px)",
        }}
      />
      <div
        className="absolute -bottom-[15%] -right-[10%] w-[70%] h-[70%] rounded-full opacity-35 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, #FF5269 0%, transparent 70%)",
          filter: "blur(130px)",
        }}
      />
      <div
        className="absolute top-1/4 right-[5%] w-[40%] h-[50%] rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, #ffc670 0%, transparent 60%)",
          filter: "blur(90px)",
        }}
      />

      <div className="flex flex-col gap-24 md:gap-32 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        {/* hero section */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto pt-10">
          <p className="b3 text-brand-primary mb-3">OUR SERVICES</p>
          <h1 className="max-md:text-[34px] h1 text-text-primary tracking-tight leading-tight mb-4">
            Powerful Solutions for <br className="hidden md:block" />
            <span style={gradientHeaderStyle}>Modern Restaurants</span>
          </h1>
          <p className="max-md:text-base h4 text-text-secondary max-w-[520px] mx-auto">
            Everything you need to digitize your operations, from smart menus to automated inventory and detailed analytics.
          </p>
        </div>

        {/* you are in good hands (features via cardswap) */}
        <section className="flex flex-col items-center text-center">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
            <span className="b4 font-bold text-brand-accent tracking-widest uppercase mb-3">
              Features
            </span>
            <h2 className="max-md:text-[34px] h2 text-text-primary tracking-tight leading-tight">
              You Are In Good Hands
            </h2>
            <p className="b1 text-text-secondary mt-4">
              Our platform is built on modern, secure infrastructure designed to handle peak volumes without breaking a sweat.
            </p>
          </div>

          <div className="w-full max-w-md h-[450px] relative mx-auto z-20">
            <CardSwap
              cardDistance={40}
              verticalDistance={40}
              delay={4000}
              pauseOnHover={true}
              width="100%"
              height="280px"
            >
              {features.map((feature, idx) => (
                <SwapCard 
                  key={idx} 
                  customClass="!bg-white/90 backdrop-blur-md p-8 !border-brand-primary/20 shadow-xl shadow-brand-primary/10 text-left w-full max-w-sm rounded-3xl"
                >
                  <IconBox>{feature.icon}</IconBox>
                  <div className="flex flex-col gap-2 mt-6">
                    <h3 className="text-xl font-bold text-text-primary">
                      {feature.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-text-secondary">
                      {feature.description}
                    </p>
                  </div>
                </SwapCard>
              ))}
            </CardSwap>
          </div>
        </section>

        {/* what makes us different */}
        <section className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          <div className="flex-1 flex flex-col gap-6">
            <span className="b4 font-bold text-brand-accent tracking-widest uppercase">
              Our Edge
            </span>
            <h2 className="max-md:text-[34px] h2 text-text-primary tracking-tight leading-tight">
              What Makes Us Different
            </h2>
            <p className="b1 text-text-secondary mt-4 leading-relaxed">
              Unlike legacy POS systems that lock you into expensive hardware contracts, Qios is a pure software layer that empowers you to run your business with maximum flexibility and minimum overhead.
            </p>
            <div className="flex flex-col gap-5 mt-4">
              {differentiators.map((diff, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1 bg-brand-primary/10 rounded-full p-1 text-brand-primary">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary">{diff.title}</h4>
                    <p className="text-sm text-text-secondary leading-relaxed mt-1">{diff.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-brand-secondary to-brand-primary/10 aspect-square md:aspect-[4/3] flex items-center justify-center border border-black/5 p-8">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="h-4 bg-gray-100 rounded-md w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded-md w-1/2 animate-pulse" />
                <div className="h-24 bg-brand-primary/5 border border-brand-primary/20 rounded-xl mt-4 flex items-center justify-center">
                  <span className="text-brand-primary font-semibold">Live Preview</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* the process */}
        <section className="flex flex-col items-center">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
            <span className="b4 font-bold text-brand-accent tracking-widest uppercase mb-3">
              Onboarding
            </span>
            <h2 className="max-md:text-[34px] h2 text-text-primary tracking-tight leading-tight">
              The Process
            </h2>
            <p className="b1 text-text-secondary mt-4">
              Getting started is fast and painless. We guide you through every step to ensure your transition to digital is seamless.
            </p>
          </div>

          <Card className="w-full flex flex-col p-8 md:p-12 relative overflow-visible">
            <div className="hidden xl:block absolute top-20 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-brand-accent/20 via-brand-primary/20 to-brand-accent/20" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 xl:gap-6 relative z-10">
              {processSteps.map((step, idx) => (
                <div key={idx} className="flex flex-col gap-6 items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                    {step.icon}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-brand-accent font-bold text-sm mb-2">STEP {step.step}</span>
                    <h3 className="text-xl font-bold text-text-primary mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-text-secondary">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* dont take our words for it (testimonials slider) */}
        <section className="flex flex-col gap-12">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <span className="b4 font-bold text-brand-accent tracking-widest uppercase mb-3">
              Testimonials
            </span>
            <h2 className="max-md:text-[34px] h2 text-text-primary tracking-tight leading-tight">
              Don&apos;t Take Our Words For It
            </h2>
            <p className="b1 text-text-secondary mt-4">
              Join hundreds of forward-thinking restaurants who have already modernized their operations.
            </p>
          </div>

          <div className="relative w-full max-w-3xl mx-auto">
            <Card className="flex flex-col gap-6 justify-between min-h-[280px]">
              <div className="flex flex-col gap-6">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={20} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xl md:text-2xl italic text-text-secondary leading-relaxed font-medium">
                  "{testimonials[activeTestimonial].quote}"
                </p>
              </div>
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100">
                <Avatar initials={testimonials[activeTestimonial].initials} size="md" />
                <div className="flex flex-col">
                  <span className="font-bold text-text-primary">{testimonials[activeTestimonial].author}</span>
                  <span className="text-sm text-text-secondary">{testimonials[activeTestimonial].role}</span>
                </div>
              </div>
            </Card>

            <div className="flex items-center justify-center gap-4 mt-8">
              <button 
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-text-secondary hover:text-brand-primary hover:border-brand-primary transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      activeTestimonial === idx ? "w-6 bg-brand-primary" : "w-2 bg-black/10"
                    )}
                  />
                ))}
              </div>
              <button 
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-text-secondary hover:text-brand-primary hover:border-brand-primary transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </section>

        {/* cta card swap 3d flip effect */}
        <section className="flex justify-center mb-10">
          <div className="group perspective-[1500px] w-full max-w-4xl h-[400px]">
            <div className="relative w-full h-full transition-transform duration-[1200ms] ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotateX(180deg)]">
              {/* Front side */}
              <div className="absolute inset-0 [backface-visibility:hidden]">
                {CTAContent}
              </div>
              
              {/* Back side (flipped) */}
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)]">
                {CTAContent}
              </div>
            </div>
          </div>
        </section>

      </div>
    </section>
  );
}