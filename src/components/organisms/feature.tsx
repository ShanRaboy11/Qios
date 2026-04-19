import React from 'react';
import { QrCode, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { ChatbotLogo } from '../molecules/ChatbotLogo';

const features = [
  {
    icon: (
      <div className="relative flex items-center justify-center w-[26px] h-[26px]">
        <span className="absolute -inset-1.5 rounded-[10px] border border-rose-400 animate-ping opacity-40" />
        <span className="absolute -inset-3 rounded-[14px] border border-rose-300 animate-ping opacity-20 [animation-delay:0.55s]" />
        <QrCode className="w-[26px] h-[26px] text-rose-500" />
      </div>
    ),
    title: "Scan. Order. Done.",
    description: "Customers access the full digital menu on their own device — no download, no login, no friction. A unique QR captures their order ID and timestamp for staff to retrieve instantly.",
  },
  {
    icon: <img src="/svg/Stock.svg" alt="Stock" className="w-[26px] h-[26px]" />,
    title: "Stock That Watches Itself.",
    description: "Toggle between simple unit-count tracking or a measurement-based recipe matrix that auto-deducts ingredients.",
  },
  {
    icon: <img src="/svg/Hand.svg" alt="Hand" className="w-[26px] h-[26px]" />,
    title: "Built for How People Order.",
    description: "Customers browse, pick modifiers, select sizes, and watch their total update live — all from a website.",
  },
  {
    icon: (
      // Fixed: centered, evenly spaced, fills the icon box properly
      <div className="flex items-end justify-center gap-[3px] w-[26px] h-[22px]">
        <div className="w-[5px] rounded-t bg-rose-200" style={{ height: '45%' }} />
        <div className="w-[5px] rounded-t bg-rose-500" style={{ height: '88%' }} />
        <div className="w-[5px] rounded-t bg-rose-200" style={{ height: '65%' }} />

      </div>
    ),
    title: "See Every Shift, Clearly.",
    description: "Track order velocity, prep times, and staff productivity on one real-time dashboard.",
  },
  {
    icon: <img src="/svg/Shield.svg" alt="Shield" className="w-[26px] h-[26px]" />,
    title: "Validate. Process. Close.",
    description: "Employees scan customer QR orders, confirm payment, and log every transaction in real time.",
  },
];

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-12 h-12 min-w-[48px] bg-rose-50 rounded-[13px] flex items-center justify-center">
      {children}
    </div>
  );
}

export default function FeatureSection() {
  return (
    <section className="w-full bg-[#f5f3ef] py-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="max-w-lg">
          <h2 className="text-4xl md:text-5xl font-extrabold font-figtree text-zinc-900 leading-tight mb-3">
            Hardware-Free QR Kiosk.
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Turn every customer's smartphone into an ordering terminal.
            No tablets, no stands — just scan, browse, and trigger the kitchen.
          </p>
        </div>

        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {[features[0], features[1]].map((f, i) => (
            <div key={i} className={`${i === 0 ? 'md:col-span-3' : 'md:col-span-2'} bg-white rounded-2xl p-[22px] border border-zinc-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}>
              <div className="flex items-center gap-3 mb-2.5">
                <IconBox>{f.icon}</IconBox>
                <h3 className="text-[0.975rem] font-bold font-figtree text-zinc-900 leading-snug">{f.title}</h3>
              </div>
              <p className="text-zinc-500 text-[0.825rem] leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {features.slice(2).map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-[22px] border border-zinc-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center gap-3 mb-2.5">
                <IconBox>{f.icon}</IconBox>
                <h3 className="text-[0.975rem] font-bold font-figtree text-zinc-900 leading-snug">{f.title}</h3>
              </div>
              <p className="text-zinc-500 text-[0.825rem] leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* AI Concierge Banner */}
        <div className="relative bg-zinc-900 rounded-3xl p-10 md:p-[44px_52px] flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(232,64,90,0.22) 0%, transparent 70%)' }} />

          <div className="flex-1 relative z-10 space-y-3.5 max-w-[520px]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span className="text-rose-500 text-[0.68rem] font-bold tracking-widest uppercase">AI Concierge</span>
            </div>
            <h2 className="text-3xl md:text-[2.15rem] font-extrabold font-figtree text-white italic leading-tight">
              "What can I get for ₱300 for two?"
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-[520px]">
              Your AI concierge understands plain language. It recommends, upsells, modifies, and adds items to the live cart — all through a natural chat interface.
            </p>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-rose-500/40 text-zinc-200 hover:text-white hover:bg-rose-500/10 hover:border-rose-500 transition-all text-sm font-medium">
              See It In Action <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Robot: animated logo, floating bubble */}
          <div className="flex-shrink-0 relative z-10 w-[220px] h-[240px] flex items-end justify-center">
            {/* Floating chat bubble */}

            
            {/* Ground glow */}
            <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-[120px] h-[18px] rounded-full animate-[glowPulse_4s_ease-in-out_infinite]"
              style={{ background: 'radial-gradient(ellipse, rgba(232,64,90,0.35) 0%, transparent 70%)' }} />
            {/* Robot image — breathe animation */}
            <ChatbotLogo size={200} />
          </div>
        </div>

      </div>
    </section>
  );
}