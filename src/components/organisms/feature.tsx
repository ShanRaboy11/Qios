import React from 'react';
import { QrCode, Timer, Hand, BarChart3, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: <QrCode className="w-6 h-6 text-brand-accent" />,
    title: "Scan. Order. Done.",
    description: "Customers access the full digital menu on their own device — no download, no login, no friction. A unique QR captures their order ID and timestamp for staff to retrieve instantly."
  },
  {
    icon: <Timer className="w-6 h-6 text-brand-accent" />,
    title: "Stock That Watches Itself.",
    description: "Toggle between simple unit-count tracking or a measurement-based recipe matrix that auto-deducts ingredients."
  },
  {
    icon: <Hand className="w-6 h-6 text-brand-accent" />,
    title: "Built for How People Order.",
    description: "Customers browse, pick modifiers, select sizes, and watch their total update live — all from a website."
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-brand-accent" />,
    title: "See Every Shift, Clearly.",
    description: "Track order velocity, prep times, and staff productivity on one real-time dashboard."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-brand-accent" />,
    title: "Validate. Process. Close.",
    description: "Employees scan customer QR orders, confirm payment, and log every transaction in real time."
  }
];

export default function FeatureSection() {
  return (
    <section className="w-full bg-bg-primary py-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold font-figtree text-text-primary tracking-tight">
            Hardware-Free QR Kiosk.
          </h2>
          <p className="text-lg md:text-xl text-text-secondary font-inter leading-relaxed">
            Turn every customer&apos;s smartphone into a powerful ordering terminal.<br className="hidden md:block" />
            No tablets, no stands—just scan, browse, and trigger the kitchen.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="space-y-6">
          {/* Top Row: 2 Cards (3-col / 2-col visual proportion) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 md:col-span-3 hover:shadow-md transition-shadow">
               <div className="mb-6">{features[0].icon}</div>
               <h3 className="text-2xl font-semibold font-figtree text-text-primary mb-3">{features[0].title}</h3>
               <p className="text-text-secondary font-inter leading-relaxed">{features[0].description}</p>
            </div>
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 md:col-span-2 hover:shadow-md transition-shadow">
               <div className="mb-6">{features[1].icon}</div>
               <h3 className="text-2xl font-semibold font-figtree text-text-primary mb-3">{features[1].title}</h3>
               <p className="text-text-secondary font-inter leading-relaxed">{features[1].description}</p>
            </div>
          </div>

          {/* Bottom Row: 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.slice(2).map((feature, idx) => (
              <div key={idx} className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                 <div className="mb-6">{feature.icon}</div>
                 <h3 className="text-2xl font-semibold font-figtree text-text-primary mb-3">{feature.title}</h3>
                 <p className="text-text-secondary font-inter leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Concierge Banner */}
        <div className="mt-20 bg-text-primary rounded-3xl p-8 md:p-14 lg:p-20 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
          
          <div className="flex-1 space-y-6 z-10">
            <div className="inline-flex items-center space-x-2 text-brand-primary font-bold tracking-widest text-xs uppercase">
              <Sparkles className="w-4 h-4" />
              <span>AI CONCIERGE</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-figtree text-white italic tracking-tight">
              &quot;What can I get for ₱300 for two?&quot;
            </h2>
            
            <p className="text-gray-400 text-sm md:text-base max-w-xl font-inter leading-relaxed">
              Your AI concierge understands plain language. It recommends, upsells, modifies, and adds items to the live cart — all through a natural chat interface.
            </p>
            
            <button className="inline-flex items-center space-x-2 px-6 py-3 rounded-full border border-brand-primary text-gray-200 hover:text-white hover:bg-brand-primary/10 transition-colors font-inter text-sm font-medium mt-4">
              <span>See It In Action</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="relative w-56 h-56 md:w-72 md:h-72 lg:w-[28rem] lg:h-[28rem] flex-shrink-0 z-10">
            {/* The root logo parts overlaid logically */}
            <Image 
              src="/svg/Body.svg" 
              alt="AI Message Bubble Body" 
              fill
              className="object-contain"
              priority
            />
             <Image 
              src="/svg/Ellipse1.svg" 
              alt="AI Eyes Mask" 
              fill
              className="object-contain"
              priority
            />
             <Image 
              src="/svg/Ellipse2.svg" 
              alt="AI Chat Dots" 
              fill
              className="object-contain"
              priority
            />
          </div>
          
        </div>

      </div>
    </section>
  );
}
