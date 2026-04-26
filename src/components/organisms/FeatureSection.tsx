import React from "react";
import {
  QrCode,
  ArrowRight,
  Package,
  Smartphone,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { ChatbotLogo } from "../molecules/ChatbotLogo";
import { Button } from "../atoms/Button";

const features = [
  {
    icon: <QrCode className="w-6 h-6 text-brand-accent" />,
    title: "Scan & Order",
    description:
      "Frictionless digital menus. No apps or logins required—just scan and eat.",
  },
  {
    icon: <Package className="w-6 h-6 text-brand-accent" />,
    title: "Smart Inventory",
    description:
      "Real-time tracking for ingredients and units. Auto-deducts as you sell.",
  },
  {
    icon: <Smartphone className="w-6 h-6 text-brand-accent" />,
    title: "Native Experience",
    description:
      "Live cart updates and easy modifiers built for the modern mobile web.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-brand-accent" />,
    title: "Shift Insights",
    description:
      "Track order velocity and staff productivity on one real-time dashboard.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-brand-accent" />,
    title: "Instant Checkout",
    description:
      "Scan customer codes to confirm payments and sync with your kitchen.",
  },
];

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[46px] h-[46px] min-w-[46px] rounded-[13px] flex items-center justify-center relative overflow-hidden bg-brand-accent/10 border border-brand-accent/20">
      <div className="absolute inset-0 rounded-[13px] bg-gradient-to-br from-white/35 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

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
      className={`bg-white rounded-[2rem] p-8 border relative overflow-hidden transition-all duration-300 group hover:-translate-y-1 ${className}`}
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

export default function FeatureSection() {
  const gradientHeaderStyle = {
    background: "linear-gradient(250deg, #FFD77A 15.53%, #FF5269 84.47%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  return (
    <section className="w-full py-24 px-4 md:px-8 lg:px-12 bg-bg-primary relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-bg-primary via-bg-primary/80 to-transparent z-[2] pointer-events-none" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-64 opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, var(--color-brand-primary) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white via-white/50 to-transparent z-[2] pointer-events-none" />
      <div
        className="absolute bottom-0 left-1/4 -translate-x-1/2 translate-y-1/2 w-full h-80 opacity-[0.15] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, #FFD77A 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
          radial-gradient(circle at 10% 0%, color-mix(in srgb, var(--color-brand-primary) 12%, transparent) 0%, transparent 50%),
          radial-gradient(circle at 90% 100%, color-mix(in srgb, var(--color-brand-accent) 8%, transparent) 0%, transparent 50%)
        `,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold text-text-primary tracking-tight font-figtree">
            Hardware-Free <span style={gradientHeaderStyle}>QR Kiosk</span>
          </h2>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed font-inter">
            Turn every smartphone into a powerful ordering terminal. No tablets,
            no stands, no friction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          <div className="lg:col-span-8">
            <div
              className="relative rounded-[2.5rem] p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden h-full border border-white/10 shadow-2xl transition-transform duration-500 hover:-translate-y-1"
              style={{
                background:
                  "linear-gradient(135deg, #1c1917 0%, #27201c 60%, #1c1917 100%)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              <div
                className="absolute -top-20 -right-20 w-96 h-96 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in srgb, var(--color-brand-accent) 22%, transparent) 0%, color-mix(in srgb, var(--color-brand-primary) 10%, transparent) 40%, transparent 65%)",
                }}
              />

              <div className="flex-1 relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-brand-primary" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary" />
                  </span>
                  <span className="text-xs font-bold tracking-[0.15em] uppercase text-brand-primary font-inter">
                    AI Concierge
                  </span>
                </div>

                <h2 className="text-3xl md:text-5xl italic font-ibrand text-text-tertiary leading-tight">
                  "Find me a spicy dinner for two under ₱500."
                </h2>

                <p className="text-lg text-white/60 max-w-md leading-relaxed font-inter">
                  A natural chat interface that understands context. It
                  recommends, upsells, and modifies orders in real-time.
                </p>

                <div className="pt-4">
                  <Button
                    variant="outline"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    See It In Action
                  </Button>
                </div>
              </div>

              <div className="flex-shrink-0 relative z-10 lg:scale-110">
                <ChatbotLogo size={240} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="flex-1">
              <IconBox>{features[0].icon}</IconBox>
              <h3 className="text-2xl font-bold text-text-primary mt-6 mb-3 font-figtree">
                {features[0].title}
              </h3>
              <p className="text-text-secondary leading-relaxed font-inter">
                {features[0].description}
              </p>
            </Card>
            <Card className="flex-1">
              <IconBox>{features[1].icon}</IconBox>
              <h3 className="text-2xl font-bold text-text-primary mt-6 mb-3 font-figtree">
                {features[1].title}
              </h3>
              <p className="text-text-secondary leading-relaxed font-inter">
                {features[1].description}
              </p>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card className="h-full">
              <IconBox>{features[2].icon}</IconBox>
              <h3 className="text-2xl font-bold text-text-primary mt-6 mb-3 font-figtree">
                {features[2].title}
              </h3>
              <p className="text-text-secondary leading-relaxed font-inter">
                {features[2].description}
              </p>
            </Card>
          </div>
          <div className="lg:col-span-4">
            <Card className="h-full">
              <IconBox>{features[3].icon}</IconBox>
              <h3 className="text-2xl font-bold text-text-primary mt-6 mb-3 font-figtree">
                {features[3].title}
              </h3>
              <p className="text-text-secondary leading-relaxed font-inter">
                {features[3].description}
              </p>
            </Card>
          </div>
          <div className="lg:col-span-4">
            <Card className="h-full">
              <IconBox>{features[4].icon}</IconBox>
              <h3 className="text-2xl font-bold text-text-primary mt-6 mb-3 font-figtree">
                {features[4].title}
              </h3>
              <p className="text-text-secondary leading-relaxed font-inter">
                {features[4].description}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
