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
      <Footer />
    </main>
  );
}
