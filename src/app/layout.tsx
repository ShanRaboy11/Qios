import type { Metadata } from "next";
import { Figtree, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibrand = localFont({
  src: "../../public/fonts/ibrand.otf",
  variable: "--font-ibrand",
});

export const metadata: Metadata = {
  title: "Qios",
  description: "Multi-tenant F&B kiosk platform for Cebu establishments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${figtree.variable} ${inter.variable} ${ibrand.variable} font-[family-name:var(--font-inter)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
