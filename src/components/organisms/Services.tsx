"use client";

import React from "react";
import {
  ShieldCheck,
  Zap,
  Users,
  Target,
  BarChart,
  ArrowRight,
  CheckCircle2,
  Quote,
  Star,
  Settings,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Avatar } from "@/components/atoms/Avatar";
import { cn } from "@/lib/utils";

// reusable icon box following featuresection
function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[38px] h-[38px] md:w-[46px] md:h-[46px] min-w-[38px] md:min-w-[46px] rounded-[10px] md:rounded-[13px] flex items-center justify-center relative overflow-hidden bg-brand-accent/10 border border-brand-accent/20">
      <div className="absolute inset-0 rounded-[10px] md:rounded-[13px] bg-gradient-to-br from-white/35 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// reusable card following featuresection
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
        "bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 border relative overflow-hidden transition-all duration-300 group hover:-translate-y-1",
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
  const features = [
    {
      icon: <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-brand-accent" />,
      title: "Enterprise Grade Security",
      description: "Bank-level encryption keeping your customer and operational data strictly confidential and secure.",
    },
    {
      icon: <Zap className="w-5 h-5 md:w-6 md:h-6 text-brand-accent" />,
      title: "Lightning Fast Performance",
      description: "Optimized architecture ensures sub-second load times for menus and checkout processes.",
    },
    {
      icon: <Users className="w-5 h-5 md:w-6 md:h-6 text-brand-accent" />,
      title: "Multi-Tenant Architecture",
      description: "Seamlessly manage multiple store locations, franchises, or branches from a single unified dashboard.",
    },
    {
      icon: <BarChart className="w-5 h-5 md:w-6 md:h-6 text-brand-accent" />,
      title: "Advanced Analytics",
      description: "Deep insights into consumer behavior, peak hours, and top-selling items to drive revenue.",
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
      desc: "Run entirely on the devices you already own. No expensive proprietary POS terminals required.",
    },
    {
      title: "Native AI Integration",
      desc: "Smart order suggestions and dynamic pricing capabilities out-of-the-box.",
    },
    {
      title: "White-Label Ready",
      desc: "Make the platform entirely your own with custom branding, domains, and color schemes.",
    },
  ];

  const processSteps = [
    {
      step: "01",
      icon: <Target className="w-6 h-6 text-white" />,
      title: "Discovery & Setup",
      desc: "We analyze your menu, current workflows, and business needs to configure your initial environment.",
    },
    {
      step: "02",
      icon: <Settings className="w-6 h-6 text-white" />,
      title: "Menu Digitization",
      desc: "Upload your items, configure modifiers, set up inventory thresholds, and map your kitchen stations.",
    },
    {
      step: "03",
      icon: <Users className="w-6 h-6 text-white" />,
      title: "Staff Onboarding",
      desc: "Brief training sessions for your team on order management, voiding, and shift operations.",
    },
    {
      step: "04",
      icon: <Rocket className="w-6 h-6 text-white" />,
      title: "Go Live",
      desc: "Deploy your QR codes to tables, switch on the digital menu, and start receiving frictionless orders.",
    },
  ];

  return (
    <div className="flex flex-col gap-24 md:gap-32 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-20 font-inter">
      
      {/* hero section */}
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight leading-tight mb-6">
          Powerful Solutions for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-primary">
            Modern Restaurants
          </span>
        </h1>
        <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 max-w-2xl">
          Everything you need to digitize your operations, from smart menus to automated inventory and detailed analytics.
        </p>
      </div>

      {/* you are in good hands (features) */}
      <section className="flex flex-col gap-12">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <span className="b4 font-bold text-brand-accent tracking-widest uppercase mb-3">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
            You Are In Good Hands
          </h2>
          <p className="b2 text-text-secondary mt-4">
            Our platform is built on modern, secure infrastructure designed to handle peak volumes without breaking a sweat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, idx) => (
            <Card key={idx} className="flex gap-6 items-start">
              <IconBox>{feature.icon}</IconBox>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* what makes us different */}
      <section className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
        <div className="flex-1 flex flex-col gap-6">
          <span className="b4 font-bold text-brand-accent tracking-widest uppercase">
            Our Edge
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
            What Makes Us Different
          </h2>
          <p className="b2 text-text-secondary leading-relaxed">
            Unlike legacy POS systems that lock you into expensive hardware contracts, Qios is a pure software layer that empowers you to run your business with maximum flexibility and minimum overhead.
          </p>
          <div className="flex flex-col gap-4 mt-4">
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
      <section className="flex flex-col gap-12 bg-gray-50 -mx-6 md:-mx-12 lg:-mx-24 px-6 md:px-12 lg:px-24 py-20 border-y border-black/5">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <span className="b4 font-bold text-brand-accent tracking-widest uppercase mb-3">
            Onboarding
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
            The Process
          </h2>
          <p className="b2 text-text-secondary mt-4">
            Getting started is fast and painless. We guide you through every step to ensure your transition to digital is seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative">
          <div className="hidden xl:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-brand-accent/20 via-brand-primary/20 to-brand-accent/20" />
          
          {processSteps.map((step, idx) => (
            <div key={idx} className="flex flex-col gap-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg shadow-brand-primary/20 mx-auto xl:mx-0">
                {step.icon}
              </div>
              <div className="flex flex-col text-center xl:text-left">
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
      </section>

      {/* dont take our words for it (testimonials) */}
      <section className="flex flex-col gap-12">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <span className="b4 font-bold text-brand-accent tracking-widest uppercase mb-3">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
            Don&apos;t Take Our Words For It
          </h2>
          <p className="b2 text-text-secondary mt-4">
            Join hundreds of forward-thinking restaurants who have already modernized their operations with Qios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="flex flex-col gap-6 justify-between h-full bg-white">
              <div className="flex flex-col gap-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-[15px] italic text-text-secondary leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="flex items-center gap-4 mt-4 pt-6 border-t border-gray-100">
                <Avatar initials={testimonial.initials} size="sm" />
                <div className="flex flex-col">
                  <span className="font-bold text-text-primary text-sm">{testimonial.author}</span>
                  <span className="text-xs text-text-secondary">{testimonial.role}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* cta */}
      <div className="flex flex-col items-center justify-center text-center bg-brand-primary rounded-[2rem] p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-brand-primary/20">
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
    </div>
  );
}