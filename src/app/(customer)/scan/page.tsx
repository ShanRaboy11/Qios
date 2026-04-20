import React from "react";
import { QrScanner } from "@/components/organisms/QrScanner";

export default function QrScannerPage() {
  return (
    <main className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6">
      <QrScanner />
    </main>
  );
}