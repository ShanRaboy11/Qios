"use client";

import React from "react";
import { Navbar } from "@/components/organisms/navbar";
import { Footer } from "@/components/organisms/footer";
import Services from "@/components/organisms/Services";
import { motion } from "framer-motion";

export default function ServicesPage() {
  return (
    <motion.main 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col min-h-screen bg-white w-full overflow-x-hidden"
    >
      <Navbar variant="transparent" activeView="services" />
      <div className="flex-grow w-full pt-20">
        <Services />
      </div>
      <Footer />
    </motion.main>
  );
}
