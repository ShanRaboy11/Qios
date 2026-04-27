import React, { useState } from "react";
import {
  Users,
  Lock,
  CheckCircle,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const faqdata = [
  {
    question: "Can I switch plans later?",
    answer:
      "Yes, you can upgrade or downgrade anytime from your admin dashboard. Upgrades take effect immediately, while downgrades apply at the start of your next billing cycle. Your data is always preserved.",
  },
  {
    question: "What happens when I hit my order limit?",
    answer:
      "We won’t cut you off. You’ll receive notifications at 90% and 100% of your limit. If you consistently exceed it, we’ll help you move to a plan that better fits your volume.",
  },
  {
    question: "What is Gemini AI Concierge?",
    answer:
      "It’s our AI-powered assistant that acts like a digital waiter. It can answer menu questions, suggest items, handle dietary requests, and guide customers through checkout.",
  },
  {
    question: "Is there really no setup fee?",
    answer:
      "Yes. You can set up your digital menu, QR codes, and branch settings on your own at no cost. Optional on-site support is available if needed.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. There are no long-term contracts for Basic and Business plans. If you cancel, your service stays active until the end of your current billing period.",
  },
];

const AccordionItem = ({
  question,
  answer,
  isopen,
  onclick,
}: {
  question: string;
  answer: string;
  isopen: boolean;
  onclick: () => void;
}) => {
  return (
    <div
      className={cn(
        "group border-b border-black/5 last:border-0 transition-colors duration-500",
        isopen ? "bg-black/[0.02]" : "hover:bg-black/[0.01]",
      )}
    >
      <button
        onClick={onclick}
        className="w-full py-6 px-8 flex items-center justify-between text-left"
      >
        <span
          className={cn(
            "b3 transition-colors duration-300",
            isopen ? "text-brand-primary" : "text-text-primary",
          )}
        >
          {question}
        </span>
        <div
          className={cn(
            "p-1.5 rounded-full transition-all duration-500",
            isopen ? "bg-brand-primary/20 rotate-180" : "bg-black/5",
          )}
        >
          <ChevronDown
            className={cn(
              "w-4 h-4",
              isopen ? "text-brand-primary" : "text-text-secondary",
            )}
          />
        </div>
      </button>
      <div
        className={cn(
          "grid transition-all duration-500 ease-in-out",
          isopen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="px-8 pb-6 b1 text-text-secondary leading-relaxed max-w-3xl">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FAQs() {
  const [openindex, setopenindex] = useState<number | null>(0);

  return (
    <section className="relative w-full py-24 px-6 bg-bg-primary overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-bg-primary via-bg-primary/50 to-transparent pointer-events-none z-0" />
      <div
        className="absolute top-[10%] -right-[5%] w-[40%] h-[40%] rounded-full opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, #ffc670 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute bottom-[5%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, #ff5269 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 border border-brand-primary/20 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div>
              <p className="text-[25px] leading-[125%] font-bold font-figtree text-text-primary mb-1">
                Still have questions?
              </p>
              <p className="b2 text-text-secondary">
                No hidden fees. All plans include a{" "}
                <span className="text-brand-primary font-bold">
                  14-day free trial
                </span>
                .
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 b4 text-text-secondary">
                <Users className="w-5 h-5 text-brand-primary" /> 255+
                restaurants
              </div>
              <div className="flex items-center gap-2 b4 text-text-secondary">
                <Lock className="w-5 h-5 text-success-primary" /> SOC 2 Secure
              </div>
              <div className="flex items-center gap-2 b4 text-text-secondary">
                <CheckCircle className="w-5 h-5 text-brand-accent" /> 30m setup
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-black/5 shadow-xl shadow-black/[0.02] overflow-hidden">
          <div className="bg-brand-primary/30 px-8 py-8 flex items-center gap-5 border-b border-black/5">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <MessageSquare
                className="w-6 h-6 text-text-tertiary"
                fill="currentColor"
              />
            </div>
            <div>
              <h2 className="text-[25px] leading-[125%] font-bold font-figtree text-text-primary">
                Frequently Asked Questions
              </h2>
              <p className="b4 text-text-secondary">
                Everything you need to know about Qios
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            {faqdata.map((item, index) => (
              <AccordionItem
                key={index}
                question={item.question}
                answer={item.answer}
                isopen={openindex === index}
                onclick={() => setopenindex(openindex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
