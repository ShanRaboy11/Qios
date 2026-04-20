import React from "react";
import { CheckCircle2, Sparkles, LayoutDashboard } from "lucide-react";

const problems = [
  "Long Customer Queues at the Counter",
  "Order Mistake due to Verbal Miscommunication",
  "Slow Order-Taking and Manual Encoding",
  "Staff Fraud, Unrecorded Sales or Transactions",
  "No Visibility of Sales and Business Performance",
  "Manual Inventory Taking",
];

const solutions = [
  "QR-Based Mobile Ordering",
  "AI-Assisted Order Input (Gemini)",
  "Automated Digital Ordering System",
  "Transaction Logging and Audit Trail System",
  "Real-Time Sales Dashboard and Analytics",
  "Real-Time Automated Inventory Deduction",
];

export const ProblemSolution = () => {
  return (
    <section className="w-full max-w-7xl mx-auto py-20 px-4 md:px-10 flex flex-col gap-16 relative cursor-default">
      {/* Background Rotating Glows */}
      <div className="absolute left-[-100px] top-[-20%] pointer-events-none z-10 animate-[float-y_15s_ease-in-out_infinite]">
        <div style={{ width: 425, height: 425, position: "relative" }}>
          <div
            style={{
              width: 425,
              height: 425,
              left: 0,
              top: 0,
              position: "absolute",
              background: "#FFE6BF",
              borderRadius: 9999,
              filter: "blur(100px)",
              opacity: 0.6,
            }}
          />
          <div
            style={{
              width: 189,
              height: 189,
              left: 71,
              top: 149,
              position: "absolute",
              background: "#FFBEC7",
              borderRadius: 9999,
              filter: "blur(100px)",
              opacity: 0.8,
            }}
          />
        </div>
      </div>

      <div className="absolute right-[50px] bottom-[5%] pointer-events-none z-10 animate-[float-y1_15s_ease-in-out_infinite]">
        <div style={{ width: 425, height: 425, position: "relative" }}>
          <div
            style={{
              width: 800,
              height: 800,
              left: 0,
              top: 0,
              position: "absolute",
              background: "#FFE6BF",
              borderRadius: 9999,
              filter: "blur(100px)",
              opacity: 0.6,
            }}
          />
          <div
            style={{
              width: 440,
              height: 440,
              left: 71,
              top: 149,
              position: "absolute",
              background: "#FFBEC7",
              borderRadius: 9999,
              filter: "blur(100px)",
              opacity: 0.8,
            }}
          />
        </div>
      </div>

      <div className="flex justify-end mb-8 w-full z-10">
        <h2 className="text-4xl md:text-5xl font-figtree font-light text-text-primary text-right max-w-4xl leading-tight">
          Your counter is costing you money.
          <br />
          Every single day.
        </h2>
      </div>

      <div className="flex flex-col gap-8 w-full z-20">
        {/* Problems Row */}
        <div className="flex flex-col lg:flex-row items-center gap-6 w-full lg:h-[180px]">
          <div className="bg-[#FFD77A] shrink-0 w-full lg:w-[320px] h-[160px] lg:h-full rounded-[24px] p-8 flex flex-col justify-center shadow-md z-10 relative overflow-hidden group border border-white/20">
            {/* Spice: Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50" />
            <div className="absolute -right-4 -top-4 text-black/5 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
              <Sparkles size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-4xl font-figtree text-text-primary tracking-wide font-light">
                  PROBLEMS
                </h3>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <div className="h-[2px] w-12 bg-text-primary/20 mb-4" />
              <p className="font-figtree text-lg text-text-primary/80 leading-relaxed font-medium">
                challenges that shaped our approach
              </p>
            </div>
          </div>

          <div
            className="w-full flex-none lg:flex-1 overflow-hidden overflow-y-visible relative h-[140px] lg:h-full flex items-center"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          >
            <div className="flex animate-marquee gap-6 absolute left-0 w-[max-content]">
              {[...problems, ...problems].map((prob, idx) => (
                <div
                  key={`prob-${idx}`}
                  className="shrink-0 w-[240px] md:w-[280px] h-[120px] lg:h-[140px] bg-gradient-to-br from-red-50 to-[#FF7B8E] hover:to-[#ff6177] flex items-start rounded-[24px] p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:brightness-105 relative overflow-hidden"
                >
                  {/* Glowing White Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4),transparent_70%)] pointer-events-none" />
                  <p className="font-figtree text-xl font-regular leading-snug break-words relative z-10">
                    {prob}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Solutions Row */}
        <div className="flex flex-col lg:flex-row items-center gap-6 w-full lg:h-[180px]">
          <div className="bg-[#FFD77A] shrink-0 w-full lg:w-[320px] h-[160px] lg:h-full rounded-[24px] p-8 flex flex-col justify-center shadow-md z-10 relative overflow-hidden group border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50" />
            <div className="absolute -right-4 -top-4 text-black/5 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
              <CheckCircle2 size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-4xl font-figtree text-text-primary tracking-wide font-light">
                  SOLUTIONS
                </h3>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              </div>
              <div className="h-[2px] w-12 bg-text-primary/20 mb-4" />
              <p className="font-figtree text-lg text-text-primary/80 leading-relaxed font-medium">
                how we turned challenges into results
              </p>
            </div>
          </div>

          <div
            className="w-full flex-none lg:flex-1 overflow-hidden overflow-y-visible relative h-[140px] lg:h-full flex items-center "
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          >
            <div className="flex animate-marquee gap-6 absolute left-0 w-[max-content]">
              {[...solutions, ...solutions].map((sol, idx) => (
                <div
                  key={`sol-${idx}`}
                  className="shrink-0 w-[240px] md:w-[280px] h-[120px] lg:h-[140px] bg-gradient-to-br from-white to-[#FFE5A3] hover:to-[#ffd978] border border-yellow-100 flex items-start rounded-[24px] p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:brightness-105 relative overflow-hidden"
                >
                  {/* Glowing White Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.6),transparent_80%)] pointer-events-none" />
                  <p className="font-figtree text-xl font-regular leading-snug break-words relative z-10">
                    {sol}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-15 z-20">
        {/* Card 1 */}
        <div className="border border-[#FDECA6] bg-[#FFF9EF] rounded-[24px] p-8 flex flex-col shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#F5A524]/50 group">
          <div className="w-12 h-12 rounded-[16px] bg-[#FFE5A3]/50 text-[#F5A524] flex items-center justify-center mb-6 transition-colors group-hover:bg-[#FFE5A3]">
            <CheckCircle2 size={24} strokeWidth={2.5} />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-4">
            Zero Hardware Cost
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            Use any mobile device as a kiosk. Your customers' phones become your
            ordering terminals.
          </p>
        </div>

        {/* Card 2 */}
        <div className="border border-[#FDECA6] bg-[#FFF9EF] rounded-[24px] p-8 flex flex-col shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#FF7B8E]/50 group">
          <div className="w-12 h-12 rounded-[16px] bg-[#FF7B8E]/20 text-[#FF7B8E] flex items-center justify-center mb-6 transition-colors group-hover:bg-[#FF7B8E]/30">
            <Sparkles size={24} strokeWidth={2.5} />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-4">
            Perfect Accuracy
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            Let Gemini AI handle the "Extra Spicy, No Onions" requests. Every
            modifier captured, zero errors.
          </p>
        </div>

        {/* Card 3 */}
        <div className="border border-[#FDECA6] bg-[#FFF9EF] rounded-[24px] p-8 flex flex-col shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#F5A524]/50 group">
          <div className="w-12 h-12 rounded-[16px] bg-[#FFE5A3]/50 text-[#F5A524] flex items-center justify-center mb-6 transition-colors group-hover:bg-[#FFE5A3]">
            <LayoutDashboard size={24} strokeWidth={2.5} />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-4">
            Total Transparency
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            Monitor your staff, revenue, and inventory from anywhere — even
            while you're on Bantayan Island.
          </p>
        </div>
      </div>
    </section>
  );
};
