"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  title: string;
}

interface LegalDocumentProps {
  title: string;
  lastUpdated: string;
  sections: Section[];
  children: React.ReactNode;
}

const gradientHeaderStyle = {
  background: "linear-gradient(250deg, #FFD77A 15.53%, #FF5269 84.47%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

export const LegalDocument = ({
  title,
  lastUpdated,
  sections,
  children,
}: LegalDocumentProps) => {
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id || "",
  );

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((s) =>
        document.getElementById(s.id),
      );

      // Calculate scroll position trigger line
      const scrollPosition = window.scrollY + 160;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element) {
          const elementTop =
            element.getBoundingClientRect().top + window.scrollY;

          if (elementTop <= scrollPosition) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const elementTop = element.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementTop - 130,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
      {/* Back Link */}
      <div className="mb-8 md:mb-12">
        <Link
          href="/legal"
          className="inline-flex items-center text-text-secondary hover:text-brand-accent transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Legal Center
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-28 relative">
        {/* Sidebar Table of Contents */}
        <div
          className="hidden lg:block w-72 shrink-0"
          style={{ position: "sticky", top: "8rem", alignSelf: "flex-start" }}
        >
          <div className="flex flex-col gap-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4 ml-4">
              Contents
            </h4>
            <nav className="flex flex-col gap-1 border-l-2 border-black/5">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => scrollToSection(e, section.id)}
                  className={cn(
                    "px-4 py-2 text-[15px] transition-all duration-200 border-l-[3px] -ml-[2px]",
                    activeSection === section.id
                      ? "border-brand-accent text-brand-accent font-bold bg-brand-accent/5"
                      : "border-transparent text-text-secondary hover:text-text-primary hover:border-black/10",
                  )}
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-3xl lg:pl-8">
          <div className="mb-10 md:mb-14">
            <h1 className="h2 text-text-primary tracking-tight leading-tight mb-4">
              <span style={gradientHeaderStyle}>{title}</span>
            </h1>
            <p className="b3 text-text-secondary">
              Last Updated: {lastUpdated}
            </p>
          </div>

          <div
            className="prose prose-lg prose-slate max-w-none 
            prose-headings:font-figtree prose-headings:font-bold prose-headings:text-text-primary prose-h2:text-[1.15rem] md:prose-h2:text-[1.35rem] prose-headings:leading-tight prose-headings:mt-10 prose-headings:mb-4
            prose-p:text-text-secondary prose-p:leading-[1.8] prose-p:mb-7
            prose-a:text-brand-accent prose-a:no-underline hover:prose-a:underline
            prose-strong:text-text-primary
            prose-ul:text-text-secondary prose-li:marker:text-brand-accent prose-li:mb-2"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
