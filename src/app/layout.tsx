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
  icons: {
    icon: "/svg/Qios_Icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // `suppressHydrationWarning` on body allows 3rd party browser extensions (like password managers)
  // to inject attributes (like fdprocessedid) onto the body/html without causing React errors.
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${figtree.variable} ${inter.variable} ${ibrand.variable} font-[family-name:var(--font-inter)] antialiased`}
      >
        {/*
          Hydration mismatch fix:
          Certain browser extensions (like password managers) or testing tools
          add random attributes (e.g. fdprocessedid) to inputs before React hydrates.
          Wrapping the app in a div with suppressHydrationWarning prevents the
          warning from cascading down to the children components.
        */}
        <div suppressHydrationWarning>
          {children}
        </div>
      </body>
    </html>
  );
}
