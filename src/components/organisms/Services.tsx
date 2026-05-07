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
  Quote,
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
function IconBox({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-16 h-16 rounded-[20px] flex items-center justify-center relative overflow-hidden shadow-inner",
        className,
      )}
    >
      <div className="absolute inset-0 bg-white/10" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// reusable card for general sections
function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white/80 backdrop-blur-md rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-black/5 relative overflow-hidden transition-all duration-300 shadow-xl",
        className,
      )}
    >
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
}

export default function Services() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-brand-accent" />,
      title: "Enterprise Security",
      description:
        "Bank-level encryption keeping your data strictly confidential and compliant with global standards.",
      bgColor: "bg-brand-accent",
      textColor: "text-white",
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
    {
      icon: <Zap className="w-6 h-6 md:w-8 md:h-8 text-brand-accent" />,
      title: "Fast Performance",
      description:
        "Sub-second load times for menus and instant updates across all your restaurant devices.",
      bgColor: "bg-brand-primary",
      textColor: "text-text-primary",
      iconBg: "bg-white/40",
      iconColor: "text-text-primary",
    },
    {
      icon: <Users className="w-6 h-6 md:w-8 md:h-8 text-brand-accent" />,
      title: "Multi-Tenant",
      description:
        "Seamlessly manage multiple store locations, menus, and staff from a single unified dashboard.",
      bgColor: "bg-text-primary",
      textColor: "text-white",
      iconBg: "bg-white/10",
      iconColor: "text-brand-primary",
    },
    {
      icon: <BarChart className="w-6 h-6 md:w-8 md:h-8 text-brand-accent" />,
      title: "Advanced Analytics",
      description:
        "Deep insights into peak hours, top-selling items, and customer behavior to drive more revenue.",
      bgColor: "bg-success-primary",
      textColor: "text-white",
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
  ];

  const testimonials = [
    {
      quote:
        "Qios completely transformed our restaurant operations. We cut ordering times by 40% and our staff can finally focus on hospitality rather than logistics.",
      author: "Maria Santos",
      role: "Operations Manager, The Daily Grind",
      initials: "MS",
    },
    {
      quote:
        "The inventory sync alone is worth the investment. No more manual stock counts or surprising out-of-stock items during peak dinner rushes.",
      author: "David Chen",
      role: "Owner, Spice & Wok",
      initials: "DC",
    },
    {
      quote:
        "Setting up our digital menu took less than an hour. The interface is incredibly intuitive, even for our staff who aren't tech-savvy.",
      author: "Sarah Johnson",
      role: "Franchise Director",
      initials: "SJ",
    },
  ];

  const differentiators = [
    {
      title: "Zero Hardware Costs",
      desc: "Run entirely on the devices you already own. No expensive proprietary POS systems required.",
    },
    {
      title: "Native AI Integration",
      desc: "Smart order suggestions and dynamic pricing capabilities powered by our internal AI engine.",
    },
    {
      title: "White-Label Ready",
      desc: "Make the platform entirely your own with custom branding, fonts, and brand colors.",
    },
  ];

  const processSteps = [
    {
      step: "01",
      icon: <Target className="w-8 h-8 text-brand-primary" />,
      title: "Discovery & Setup",
      desc: "We analyze your menu, current workflows, and business needs to tailor the platform for you.",
    },
    {
      step: "02",
      icon: <Settings className="w-8 h-8 text-brand-primary" />,
      title: "Menu Digitization",
      desc: "Upload items, configure modifiers, and set up your automated inventory thresholds.",
    },
    {
      step: "03",
      icon: <Users className="w-8 h-8 text-brand-primary" />,
      title: "Staff Onboarding",
      desc: "Interactive training sessions for your team on order management and customer handling.",
    },
    {
      step: "04",
      icon: <Rocket className="w-8 h-8 text-brand-primary" />,
      title: "Go Live",
      desc: "Deploy your custom QR codes to tables and start receiving high-speed digital orders.",
    },
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const CTAContent = (
    <div className="flex flex-col items-center justify-center text-center bg-brand-primary rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-2xl h-full border border-white/20">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/30 blur-3xl rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-brand-accent/20 blur-3xl rounded-full" />
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl [transform:translateZ(60px)]">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Ready to upgrade your restaurant?
        </h2>
        <p className="text-white/90 text-lg md:text-xl">
          Start your free 14-day trial today. No credit card required.
        </p>
        <Button
          variant="accent"
          size="lg"
          shape="rounded"
          rightIcon={<ArrowRight size={20} />}
          className="mt-6 bg-white text-brand-primary hover:bg-brand-primary hover:text-white border-none px-10 py-5 text-lg font-bold shadow-xl transition-all"
        >
          Get Started Now
        </Button>
      </div>
    </div>
  );

  return (
    <section className="relative w-full py-32 bg-bg-primary overflow-hidden font-inter">
      {/* ambient background elements */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-bg-primary via-bg-primary/50 to-transparent pointer-events-none z-10" />
      <div
        className="absolute -top-[5%] -left-[5%] w-[50%] h-[50%] rounded-full opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, #FFD77A 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[60%] h-[60%] rounded-full opacity-25 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, #FF5269 0%, transparent 70%)",
          filter: "blur(150px)",
        }}
      />

      <div className="flex flex-col gap-20 md:gap-48 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* page hero section - lengthened wrap for bigger screens */}
        <div className="max-w-4xl mx-auto relative z-10 w-full">
          <div className="text-center mb-10 space-y-3">
            <p className="b3 text-brand-primary uppercase tracking-widest">
              OUR SERVICES
            </p>
            <h1 className="h1 text-text-primary tracking-tight leading-tight max-md:text-[34px]">
              Powerful Solutions for <br className="hidden md:block" />
              <span style={gradientHeaderStyle}>Modern Restaurants</span>
            </h1>
            <p className="h4 text-text-secondary max-w-[520px] lg:max-w-3xl mx-auto leading-relaxed max-md:text-base">
              Everything you need to digitize your operations with smart menus,
              automated inventory, and detailed analytics.
            </p>
          </div>
        </div>

        {/* features section - lowered cards more for mobile small screens */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="flex flex-col text-left space-y-3">
            <span className="b3 text-brand-primary tracking-widest uppercase">
              Features
            </span>
            <h1 className="h1 text-text-primary tracking-tight leading-tight max-md:text-[34px]">
              You Are In <span style={gradientHeaderStyle}>Good Hands</span>
            </h1>
            <p className="h4 text-text-secondary max-w-lg leading-relaxed max-md:text-base">
              Our platform is built on modern, secure infrastructure designed to
              handle peak volumes without breaking a sweat. Manage everything
              with ease.
            </p>
            <div className="pt-7 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-black/5 shadow-sm">
                <CheckCircle2 size={16} className="text-brand-primary" />
                <span className="text-sm font-semibold">99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-black/5 shadow-sm">
                <CheckCircle2 size={16} className="text-brand-primary" />
                <span className="text-sm font-semibold">24/7 Support</span>
              </div>
            </div>
          </div>

          <div className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center lg:justify-end pr-0 lg:pr-12 mt-24 md:mt-0">
            <CardSwap
              cardDistance={45}
              verticalDistance={45}
              delay={4500}
              pauseOnHover={true}
              width="100%"
              height="380px"
            >
              {features.map((feature, idx) => (
                <SwapCard
                  key={idx}
                  customClass={cn(
                    "p-8 md:p-10 !border-white/10 shadow-2xl text-left w-full max-w-[540px] rounded-[2rem] flex flex-col justify-between",
                    feature.bgColor,
                    feature.textColor,
                  )}
                >
                  <div className="flex flex-col">
                    <IconBox className={feature.iconBg}>
                      {React.cloneElement(feature.icon as React.ReactElement, {
                        className: cn(
                          (feature.icon as React.ReactElement).props.className,
                          feature.iconColor,
                        ),
                      })}
                    </IconBox>
                    <div className="flex flex-col gap-3 mt-8">
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-base md:text-lg leading-relaxed opacity-90 font-medium">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </SwapCard>
              ))}
            </CardSwap>
          </div>
        </section>

        {/* what makes us different */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-tr from-brand-secondary/20 to-brand-primary/40 aspect-square flex items-center justify-center border border-black/5 p-8">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay" />
              <div className="relative z-10 bg-white rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] p-8 w-full max-w-sm flex flex-col gap-6 transform rotate-[-3deg] hover:rotate-0 transition-all duration-700">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Dashboard v2.0
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded-md w-full animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded-md w-5/6 animate-pulse" />
                </div>
                <div className="h-32 bg-brand-primary/5 border-2 border-dashed border-brand-primary/20 rounded-2xl flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                    <Zap size={20} className="text-brand-primary" />
                  </div>
                  <span className="text-brand-primary font-bold text-sm tracking-tight">
                    Real-time Sync Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col space-y-3">
            <span className="b3 text-brand-primary tracking-widest uppercase">
              Our Edge
            </span>
            <h1 className="h1 text-text-primary tracking-tight leading-tight max-md:text-[34px]">
              What Makes Us Different
            </h1>
            <p className="h4 text-text-secondary max-w-xl leading-relaxed max-md:text-base">
              Unlike legacy POS systems that lock you into expensive hardware
              contracts, Qios is a software-first solution that puts the power
              back in your hands.
            </p>
            <div className="flex flex-col gap-6 pt-5">
              {differentiators.map((diff, idx) => (
                <div
                  key={idx}
                  className="group flex items-start gap-5 p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-black/5"
                >
                  <div className="mt-1 bg-brand-primary/10 rounded-xl p-2 text-brand-primary group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-text-primary">
                      {diff.title}
                    </h4>
                    <p className="text-base text-text-secondary leading-relaxed mt-1">
                      {diff.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* onboarding */}
        <section className="flex flex-col items-center">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20 space-y-3">
            <span className="b3 text-brand-primary tracking-widest uppercase">
              Onboarding
            </span>
            <h1 className="h1 text-text-primary tracking-tight leading-tight max-md:text-[34px]">
              The Process
            </h1>
            <p className="h4 text-text-secondary max-w-2xl leading-relaxed max-md:text-base">
              Getting started is fast and painless. Hover over each step to see
              how we help you transition to digital seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {processSteps.map((step, idx) => (
              <div key={idx} className="group h-[320px] [perspective:1000px]">
                <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* front face */}
                  <div className="absolute inset-0 bg-white rounded-[2rem] border border-black/5 p-8 flex flex-col items-center text-center justify-center shadow-lg [backface-visibility:hidden]">
                    <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 mb-6">
                      {step.icon}
                    </div>
                    <span className="text-brand-accent font-bold text-xs mb-3 tracking-[0.2em]">
                      STEP {step.step}
                    </span>
                    <h3 className="text-xl font-bold text-text-primary">
                      {step.title}
                    </h3>
                  </div>
                  {/* back face */}
                  <div className="absolute inset-0 h-full w-full rounded-[2rem] bg-brand-primary p-8 flex flex-col items-center text-center justify-center text-white [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-2xl">
                    <p className="text-lg leading-relaxed font-medium">
                      {step.desc}
                    </p>
                    <div className="mt-6 w-10 h-1 bg-white/30 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* testimonials */}
        <section className="flex flex-col">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 space-y-3">
            <span className="b3 text-brand-primary tracking-widest uppercase">
              Testimonials
            </span>
            <h1 className="h1 text-text-primary tracking-tight leading-tight max-md:text-[34px]">
              Don&apos;t Take Our Words For It
            </h1>
          </div>

          <div className="relative w-full max-w-4xl mx-auto">
            <Quote className="absolute -top-12 -left-12 w-24 h-24 text-brand-primary/10 -z-10" />

            <Card className="flex flex-col gap-10 justify-between min-h-[380px] shadow-2xl shadow-brand-primary/5 border-brand-primary/10">
              <div className="flex flex-col gap-8">
                <div className="flex gap-1 text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={22}
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <p className="text-2xl md:text-3xl italic text-text-primary leading-snug font-medium">
                  &quot;{testimonials[activeTestimonial].quote}&quot;
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-8 border-t border-gray-100">
                <div className="flex items-center gap-5">
                  <Avatar
                    initials={testimonials[activeTestimonial].initials}
                    size="lg"
                    className="ring-4 ring-brand-primary/10"
                  />
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-text-primary">
                      {testimonials[activeTestimonial].author}
                    </span>
                    <span className="text-sm font-medium text-text-secondary tracking-wide uppercase">
                      {testimonials[activeTestimonial].role}
                    </span>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-3">
                  <button
                    onClick={prevTestimonial}
                    className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-text-secondary hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all active:scale-95"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-text-secondary hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all active:scale-95"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </Card>

            <div className="flex md:hidden items-center justify-center gap-6 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-2 text-brand-primary font-bold"
              >
                PREV
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      activeTestimonial === idx
                        ? "w-6 bg-brand-primary"
                        : "w-2 bg-black/10",
                    )}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="p-2 text-brand-primary font-bold"
              >
                NEXT
              </button>
            </div>

            <div className="hidden md:flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-500",
                    activeTestimonial === idx
                      ? "w-10 bg-brand-primary"
                      : "w-2.5 bg-black/10 hover:bg-black/20",
                  )}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 3d cta card section */}
        <section className="flex justify-center mb-16 px-4">
          <div className="group [perspective:2000px] w-full max-w-5xl h-[450px]">
            <div className="relative w-full h-full transition-all duration-[1200ms] cubic-bezier(0.175, 0.885, 0.32, 1.275) [transform-style:preserve-3d] group-hover:[transform:rotateX(180deg)] cursor-pointer">
              {/* front side */}
              <div className="absolute inset-0 [backface-visibility:hidden]">
                {CTAContent}
              </div>

              {/* back side (3d depth) */}
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)]">
                <div className="flex flex-col items-center justify-center text-center bg-brand-accent rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-2xl h-full border border-white/20">
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
                  <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl [transform:translateZ(80px)]">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                      Special Offer: Get 20% Off Your First Year
                    </h2>
                    <p className="text-white/90 text-lg md:text-xl">
                      Book a demo call today and our specialists will help you
                      set up everything in 24 hours.
                    </p>
                    <Button
                      variant="primary"
                      size="lg"
                      className="mt-6 bg-white text-brand-accent border-none px-10 py-5 text-lg font-bold shadow-xl"
                    >
                      Book a Demo
                    </Button>
                  </div>
                </div>
              </div>

              {/* side thickness for 3d effect */}
              <div className="absolute inset-0 bg-black/10 rounded-[2.5rem] [transform:translateZ(-10px)]" />
            </div>
          </div>
        </section>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent pointer-events-none z-0" />
    </section>
  );
}
