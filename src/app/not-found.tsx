import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-extrabold text-neutral-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-neutral-500 mb-8 text-sm">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-brand-primary,#FF5269)] text-white font-medium hover:opacity-90 transition-opacity"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
