import React, { useState } from "react";
import {
  Users,
  Lock,
  CheckCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const faqdata = [
  {
    question: "can i switch plans later?",
    answer:
      "yes — upgrade or downgrade anytime from your admin dashboard. upgrades take effect immediately. downgrades apply at the start of your next billing cycle. your data is always preserved.",
  },
  {
    question: "what happens when i hit my order limit?",
    answer:
      "we won't cut you off. you'll receive a notification when you reach 90% and 100% of your limit. if you consistently exceed it, we'll help you transition to a plan that better fits your volume.",
  },
  {
    question: "what is gemini ai concierge?",
    answer:
      "it's our proprietary ai that acts as a digital waiter. it can answer customer questions about the menu, suggest pairings, handle dietary requests, and guide users through the checkout process naturally.",
  },
  {
    question: "is there really no setup fee?",
    answer:
      "correct. we believe in providing value first. you can set up your digital menu, qr codes, and branch settings entirely on your own for free. optional on-site support packages are available if needed.",
  },
  {
    question: "can i cancel anytime?",
    answer:
      "absolutely. there are no long-term contracts for basic and business plans. if you cancel, your service will remain active until the end of your current billing period.",
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
    <div className="border-b border-black/5 last:border-0">
      <button
        onClick={onclick}
        className="w-full py-6 px-8 flex items-center justify-between hover:bg-black/[0.01] transition-colors text-left"
      >
        <span className="b2 text-text-primary font-bold">{question}</span>
        {isopen ? (
          <ChevronUp className="w-5 h-5 text-text-secondary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-text-secondary" />
        )}
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isopen ? "max-h-40 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-8 pb-6 b2 text-text-secondary/80 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default function FAQS() {
  const [openindex, setopenindex] = useState<number | null>(0);

  return (
    <section className="w-full py-24 px-6 bg-bg-primary">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="b2 text-text-primary font-bold mb-6">
            no hidden fees. cancel anytime. all plans include a 14-day free
            trial.
          </p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-2 b4 text-text-secondary">
              <Users size={18} className="text-text-secondary/60" />
              <span>255+ restaurants trust qios</span>
            </div>
            <div className="flex items-center gap-2 b4 text-text-secondary">
              <Lock size={16} className="text-text-secondary/60" />
              <span>soc 2 compliant · data secure</span>
            </div>
            <div className="flex items-center gap-2 b4 text-text-secondary">
              <CheckCircle size={18} className="text-text-secondary/60" />
              <span>setup in under 30 minutes</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] border border-black/5 shadow-sm overflow-hidden">
          <div className="bg-[#ffebc4] px-8 py-5 flex items-center gap-3 border-b border-black/5">
            <div className="w-8 h-8 rounded-lg bg-white/40 flex items-center justify-center">
              <MessageSquare
                className="w-4 h-4 text-[#ff9d00]"
                fill="currentColor"
              />
            </div>
            <h2 className="text-[25px] font-bold text-[#ff9d00] font-figtree">
              frequently ask questions
            </h2>
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
