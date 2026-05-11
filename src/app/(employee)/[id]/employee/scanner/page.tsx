"use client";

import React from "react";
import { QrScanner } from "@/components/organisms/QrScanner";

export default function ScannerPage() {
  return (
    <>
      <header className="mb-2">
        <h2 className="h2 text-text-primary">Scanner</h2>
        <p className="b1 text-text-secondary mt-2">
          Quickly scan and process customer orders
        </p>
      </header>

      <div className="w-full flex justify-center">
        <QrScanner />
      </div>
    </>
  );
}
