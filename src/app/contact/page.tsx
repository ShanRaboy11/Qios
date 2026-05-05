"use client";

import React from "react";
import { Navbar } from "@/components/organisms/navbar";
import { Footer } from "@/components/organisms/footer";
import ContactForm from "@/components/organisms/Contacts";

export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-screen bg-bg-primary w-full overflow-x-hidden">
      <Navbar variant="transparent" />
      <div className="flex-grow w-full pt-20">
        <ContactForm />
      </div>
      <div className="relative bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white via-white/50 to-transparent z-[2] pointer-events-none" />
      <Footer />
    </main>
  );
}
