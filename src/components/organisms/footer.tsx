"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const Footer = () => {
  return (
    <footer
      className="relative w-full max-w-full overflow-hidden bg-white transition-all duration-300
      xl:h-[376px] 
      lg:h-[570px] 
      h-[570px]"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(0deg, #FFD77A -11.44%, #FFF 100%)",
        }}
      />

      <div
        className="absolute left-1/2 -translate-x-1/2 -top-[900px] z-1 pointer-events-none opacity-60"
        style={{
          width: "1598px",
          height: "1204px",
          background: "var(--color-text-tertiary)",
          filter: "blur(150px)",
          borderRadius: "1598px",
        }}
      />

      <div className="absolute -left-6 md:-left-8 lg:-left-10 -bottom-20 md:-bottom-32 lg:-bottom-36 z-2 pointer-events-none select-none overflow-hidden">
        <h1
          className="font-ibrand text-[min(50vw,500px)] md:text-[min(45vw,500px)]"
          style={{
            fontWeight: 400,
            lineHeight: "1",
            background:
              "linear-gradient(to bottom right, #FFD77A 0%, #FF5269 50%) bottom right / 50% 50% no-repeat, linear-gradient(to bottom left, #FFD77A 0%, #FF5269 50%) bottom left / 50% 50% no-repeat, linear-gradient(to top left, #FFD77A 0%, #FF5269 50%) top left / 50% 50% no-repeat, linear-gradient(to top right, #FFD77A 0%, #FF5269 50%) top right / 50% 50% no-repeat",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
          }}
        >
          Qios
        </h1>
      </div>

      <div
        className={cn(
          "relative z-10 w-full h-full flex flex-col px-[25px] md:px-[79px] py-12 transition-all duration-300",
          "items-center md:items-end justify-start gap-8",
          "xl:justify-between xl:items-end",
        )}
      >
        <div className="flex flex-col items-center md:items-end gap-6 mt-4 shrink-0">
          <h2
            className="text-text-primary font-figtree whitespace-nowrap"
            style={{
              fontSize: "39px",
              fontWeight: 600,
            }}
          >
            Connect with us
          </h2>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="transition-all duration-300 hover:scale-110 active:scale-95 group"
            >
              <svg
                width="22"
                height="28"
                viewBox="0 0 18 28"
                fill="none"
                className="overflow-visible"
              >
                <path
                  d="M17.1504 1.15002H12.7868C10.8579 1.15002 9.00799 1.8085 7.64421 2.98061C6.28025 4.15271 5.51403 5.74242 5.51403 7.40002V11.15H1.15039V16.15H5.51403V26.15H11.3322V16.15H15.6958L17.1504 11.15H11.3322V7.40002C11.3322 7.0685 11.4855 6.75056 11.7582 6.51614C12.031 6.28172 12.401 6.15002 12.7868 6.15002H17.1504V1.15002Z"
                  stroke="#FF5269"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:stroke-brand-primary transition-colors duration-300"
                />
              </svg>
            </a>
            <a
              href="#"
              className="transition-all duration-300 hover:scale-110 active:scale-95 group"
            >
              <svg
                width="34"
                height="28"
                viewBox="35 0 35 28"
                fill="none"
                className="overflow-visible"
              >
                <path
                  d="M67.1504 3.16292C67.1504 3.16292 64.4904 4.69095 63.0113 5.12405C62.2174 4.23643 61.1623 3.6073 59.9887 3.32176C58.8151 3.03623 57.5797 3.10804 56.4495 3.52752C55.3193 3.947 54.3487 4.69388 53.6693 5.66715C52.9898 6.64044 52.6342 7.79315 52.6504 8.9694V10.2512C50.3338 10.3096 48.0384 9.81001 45.9685 8.79693C43.8986 7.78384 42.1185 6.28872 40.7868 4.4447C40.7868 4.4447 35.514 15.9808 47.3777 21.108C44.6629 22.8998 41.4289 23.7983 38.1504 23.6715C50.014 30.0805 64.514 23.6715 64.514 8.93095C64.5128 8.57391 64.4775 8.21775 64.4086 7.86707C65.7539 6.57694 67.1504 3.16292 67.1504 3.16292Z"
                  stroke="#FF5269"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:stroke-brand-primary transition-colors duration-300"
                />
              </svg>
            </a>
            <a
              href="#"
              className="transition-all duration-300 hover:scale-110 active:scale-95 group"
            >
              <svg
                width="30"
                height="28"
                viewBox="85 0 30 28"
                fill="none"
                className="overflow-visible"
              >
                <path
                  d="M100.151 19.7613C103.096 19.7613 105.484 17.4729 105.484 14.6502C105.484 11.8274 103.096 9.53906 100.151 9.53906C97.2052 9.53906 94.8174 11.8274 94.8174 14.6502C94.8174 17.4729 97.2052 19.7613 100.151 19.7613Z"
                  stroke="#FF5269"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:stroke-brand-primary transition-colors duration-300"
                />
                <path
                  d="M88.1504 19.7611V9.53891C88.1504 6.01043 91.1352 3.15002 94.8171 3.15002H105.484C109.166 3.15002 112.15 6.01043 112.15 9.53891V19.7611C112.15 23.2896 109.166 26.15 105.484 26.15H94.8171C91.1352 26.15 88.1504 23.2896 88.1504 19.7611Z"
                  stroke="#FF5269"
                  strokeWidth="2.5"
                  className="group-hover:stroke-brand-primary transition-colors duration-300"
                />
                <path
                  d="M107.484 7.63582L107.499 7.62085"
                  stroke="#FF5269"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:stroke-brand-primary transition-colors duration-300"
                />
              </svg>
            </a>
          </div>
        </div>

        <div
          className="text-text-primary font-inter shrink-0 text-center md:text-right mt-6 md:mt-0"
          style={{
            fontSize: "20px",
            fontWeight: 400,
          }}
        >
          © 2026 Qios. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
