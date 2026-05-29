"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Cookie,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const gradientHeaderStyle = {
  background: "linear-gradient(250deg, #FFD77A 15.53%, #FF5269 84.47%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const legalDocs = [
  {
    title: "Privacy Policy",
    description:
      "Learn how we collect, use, and protect your personal and business data.",
    icon: <ShieldCheck className="w-8 h-8 text-brand-accent" />,
    href: "/legal/privacy-policy",
    bgColor: "bg-white/80",
  },
  {
    title: "Terms of Service",
    description:
      "The rules, guidelines, and agreements for using the Qios platform.",
    icon: <FileText className="w-8 h-8 text-brand-primary" />,
    href: "/legal/terms-of-service",
    bgColor: "bg-white/80",
  },
  {
    title: "Cookie Policy",
    description:
      "Information about how we use cookies and similar tracking technologies.",
    icon: <Cookie className="w-8 h-8 text-brand-accent" />,
    href: "/legal/cookie-policy",
    bgColor: "bg-white/80",
  },
  {
    title: "Acceptable Use Policy",
    description:
      "Guidelines on acceptable content and behavior on our platform.",
    icon: <AlertCircle className="w-8 h-8 text-brand-primary" />,
    href: "/legal/acceptable-use",
    bgColor: "bg-white/80",
  },
];

export default function LegalCenter() {
  return (
    <div className="flex flex-col items-center w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-16 md:mb-24 pt-2 md:pt-4">
        <p className="b3 text-brand-primary uppercase tracking-widest">
          TRUST & COMPLIANCE
        </p>
        <h1 className="h1 text-text-primary tracking-tight leading-tight max-md:text-[34px]">
          Qios <span style={gradientHeaderStyle}>Legal Center</span>
        </h1>
        <p className="h4 text-text-secondary max-w-2xl mx-auto leading-relaxed max-md:text-base">
          We are committed to transparency, security, and protecting your data.
          Review our legal agreements and policies below.
        </p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-5xl">
        {legalDocs.map((doc, idx) => (
          <Link href={doc.href} key={idx} className="group outline-none">
            <div
              className={cn(
                "flex flex-col h-full bg-white/80 backdrop-blur-md rounded-[2rem] p-8 md:p-10 border border-black/5 shadow-xl transition-all duration-300",
                "hover:-translate-y-2 hover:shadow-2xl hover:border-brand-primary/30",
              )}
            >
              <div className="w-16 h-16 rounded-[20px] bg-brand-secondary/20 flex items-center justify-center mb-6 shadow-inner">
                {doc.icon}
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-text-primary mb-3">
                {doc.title}
              </h3>
              <p className="text-text-secondary leading-relaxed mb-8 flex-grow">
                {doc.description}
              </p>
              <div className="flex items-center text-brand-accent font-bold mt-auto group-hover:text-brand-primary transition-colors">
                Read Policy
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Contact Section */}
      <div className="mt-24 text-center max-w-2xl">
        <h3 className="text-xl font-bold text-text-primary mb-2">
          Have questions?
        </h3>
        <p className="text-text-secondary">
          If you have any questions about our legal policies, privacy practices,
          or compliance, please reach out to our team at{" "}
          <a
            href="mailto:legal@qios.com"
            className="text-brand-accent hover:underline"
          >
            legal@qios.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
