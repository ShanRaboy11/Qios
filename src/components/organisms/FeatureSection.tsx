import React from 'react';
import { QrCode, ArrowRight } from 'lucide-react';
import { ChatbotLogo } from '../molecules/ChatbotLogo';
import { Button } from '../atoms/Button';

const features = [
  {
    icon: (
      <div className="relative flex items-center justify-center w-[24px] h-[24px]">
        <QrCode className="w-[24px] h-[24px]" style={{ color: 'var(--color-brand-accent)' }} />
      </div>
    ),
    title: "Scan. Order. Done.",
    description: "Customers access the full digital menu on their own device — no download, no login, no friction. A unique QR captures their order ID and timestamp for staff to retrieve instantly.",
  },
  {
    icon: <img src="/svg/Stock.svg" alt="Stock" className="w-[24px] h-[24px]" />,
    title: "Stock That Watches Itself.",
    description: "Toggle between simple unit-count tracking or a measurement-based recipe matrix that auto-deducts ingredients.",
  },
  {
    icon: <img src="/svg/Hand.svg" alt="Hand" className="w-[24px] h-[24px]" />,
    title: "Built for How People Order.",
    description: "Customers browse, pick modifiers, select sizes, and watch their total update live — all from a website.",
  },
  {
    icon: (
      <div className="flex items-end justify-center gap-[3px] w-[24px] h-[22px]">
        {[45, 88, 65].map((h, i) => (
          <div key={i} className="w-[5px] rounded-t" style={{
            height: `${h}%`,
            background: `linear-gradient(to top, var(--color-brand-accent), var(--color-brand-primary))`
          }} />
        ))}
      </div>
    ),
    title: "See Every Shift, Clearly.",
    description: "Track order velocity, prep times, and staff productivity on one real-time dashboard.",
  },
  {
    icon: <img src="/svg/Shield.svg" alt="Shield" className="w-[24px] h-[24px]" />,
    title: "Validate. Process. Close.",
    description: "Employees scan customer QR orders, confirm payment, and log every transaction in real time.",
  },
];

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[46px] h-[46px] min-w-[46px] rounded-[13px] flex items-center justify-center relative overflow-hidden bg-brand-accent/10">
      <div className="absolute inset-0 rounded-[13px] bg-gradient-to-br from-white/35 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function Card({ children, wide }: { children: React.ReactNode; wide?: string }) {
  return (
    <div className={`bg-white rounded-2xl p-6 border relative overflow-hidden
      hover:-translate-y-1 transition-all duration-300 group ${wide || ''}`}
      style={{
        borderColor: 'color-mix(in srgb, var(--color-brand-primary) 20%, var(--color-brand-accent) 20%)',
        boxShadow: `
          0 0 0 1px color-mix(in srgb, var(--color-brand-primary) 12%, var(--color-brand-accent) 8%),
          0 4px 20px color-mix(in srgb, var(--color-brand-primary) 6%, transparent),
          0 1px 4px rgba(0,0,0,0.04)
        `
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `
          0 0 0 1px color-mix(in srgb, var(--color-brand-primary) 18%, var(--color-brand-accent) 12%),
          0 8px 30px color-mix(in srgb, var(--color-brand-primary) 22%, transparent),
          0 4px 12px color-mix(in srgb, var(--color-brand-accent) 14%, transparent),
          0 2px 6px rgba(0,0,0,0.06)
        `;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `
          0 0 0 1px color-mix(in srgb, var(--color-brand-primary) 12%, var(--color-brand-accent) 8%),
          0 4px 20px color-mix(in srgb, var(--color-brand-primary) 6%, transparent),
          0 1px 4px rgba(0,0,0,0.04)
        `;
      }}>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-brand-primary/5 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function FeatureSection() {
  return (
    <section className="w-full py-20 px-4 md:px-8 lg:px-12 bg-bg-primary relative overflow-hidden">
      {/* Background gradients using CSS variables */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 80% 50% at 10% 0%, color-mix(in srgb, var(--color-brand-primary) 15%, transparent) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 90% 100%, color-mix(in srgb, var(--color-brand-accent) 10%, transparent) 0%, transparent 60%)
        `
      }} />
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">

        {/* Header */}
        <div className=" space-y-3 max-w-[90%]">
          <h2 className="h1 text-text-primary leading-tight tracking-tight w-full">
            Hardware-Free QR Kiosk.
          </h2>
          <p className="b1 text-text-secondary leading-relaxed">
            Turn every customer's smartphone into an ordering terminal.
            No tablets, no stands — just scan, browse, and trigger the kitchen.
          </p>
        </div>

        {/* Features Container */}
        <div className="flex flex-col gap-4">
          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[features[0], features[1]].map((f, i) => (
              <Card key={i} wide={i === 0 ? 'md:col-span-3' : 'md:col-span-2'}>
                <div className="flex items-center gap-3 mb-4 ">
                  <IconBox>{f.icon}</IconBox>
                  <h3 className="b3 text-text-primary">{f.title}</h3>
                </div>
                <p className="b4 text-text-secondary">{f.description}</p>
              </Card>
            ))}
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.slice(2).map((f, i) => (
              <Card key={i}>
                <div className="flex items-center gap-3 mb-4">
                  <IconBox>{f.icon}</IconBox>
                  <h3 className="b3 text-text-primary">{f.title}</h3>
                </div>
                <p className="b4 text-text-secondary">{f.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Banner */}
        <div className="relative rounded-3xl p-10 md:p-[52px_56px] flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1c1917 0%, #27201c 60%, #1c1917 100%)' }}>

          {/* Dot grid */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          {/* Glows */}
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--color-brand-accent) 22%, transparent) 0%, color-mix(in srgb, var(--color-brand-primary) 10%, transparent) 40%, transparent 65%)' }} />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--color-brand-primary) 10%, transparent) 0%, transparent 65%)' }} />

          <div className="flex-1 relative z-10 space-y-4 max-w-[620px]">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-brand-primary" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary" />
              </span>
              <span className="text-[0.68rem] font-bold tracking-[0.13em] uppercase text-brand-primary">
                AI Concierge
              </span>
            </div>

            <h2 className="h2 italic text-text-tertiary">
              "What can I get for ₱300 for two?"
            </h2>

            <p className="b2 text-text-secondary max-w-[600px]">
              Your AI concierge understands plain language. It recommends, upsells, modifies, and adds items to the live cart — all through a natural chat interface.
            </p>

            <div className="pt-4">
              <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                See It In Action
              </Button>
            </div>
          </div>

          {/* Robot cute */}
          <div className="flex-shrink-0 relative z-10 flex flex-col items-center">
            <ChatbotLogo size={190} />
          </div>
        </div>

      </div>
    </section>
  );
}