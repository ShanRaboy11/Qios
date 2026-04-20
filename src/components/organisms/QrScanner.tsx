"use client";

import { useState } from "react";
import { QrCode } from "lucide-react";
import { Button } from "@/components/atoms/Button";

export const QrScanner = (): JSX.Element => {
  const [orderId, setOrderId] = useState<string>("");

  const handleScanQR = () => {
    // Handle QR scan action
  };

  const handleSearchOrder = () => {
    // Handle search order action
  };

  const handleClose = () => {
    // Handle close action
  };

  return (
    <div className="inline-flex gap-2.5 px-10 py-[55px] bg-background rounded-[30px] items-center justify-center relative">
      <div className="flex flex-col w-[578px] items-end relative">
        <Button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          variant="ghost"
          size="icon"
          className="w-[30px] h-[30px] p-0 bg-[url(/fi-rr-cross-small.svg)] bg-[100%_100%]"
        />
        <div className="flex flex-col items-center gap-[59px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col w-[258px] items-center gap-[59px] relative flex-[0_0_auto]">
            <h2 className="relative self-stretch mt-[-1.00px] font-headers-h2 font-[number:var(--headers-h2-font-weight)] text-text-primary text-[length:var(--headers-h2-font-size)] text-center tracking-[var(--headers-h2-letter-spacing)] leading-[var(--headers-h2-line-height)] [font-style:var(--headers-h2-font-style)]">
              Scan QR Code
            </h2>
            <div className="flex items-center justify-center relative self-stretch w-full h-[250px] bg-slate-50 rounded-2xl border-2 border-dashed border-[#e5e5e5]">
              <QrCode size={120} className="text-text-secondary opacity-50" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-[42px] relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
              <hr className="relative w-[126px] h-0.5 border-0 bg-[#70707033]" />
              <p className="relative w-fit mt-[-1.00px] font-headers-h4 font-[number:var(--headers-h4-font-weight)] text-text-primary text-[length:var(--headers-h4-font-size)] text-center tracking-[var(--headers-h4-letter-spacing)] leading-[var(--headers-h4-line-height)] whitespace-nowrap [font-style:var(--headers-h4-font-style)]">
                or enter Order ID Manually
              </p>
              <hr className="relative w-[126px] h-0.5 border-0 bg-[#70707033]" />
            </div>
            <div className="flex flex-col w-[555px] items-center justify-center gap-16 relative flex-[0_0_auto]">
              <div className="flex flex-col items-start gap-[5px] relative self-stretch w-full flex-[0_0_auto]">
                <label htmlFor="order-id-input" className="sr-only">
                  Order ID
                </label>
                <div className="flex items-center justify-between px-5 py-[18px] relative self-stretch w-full flex-[0_0_auto] rounded-[20px] border-2 border-solid border-[#7070704c]">
                  <div className="flex w-[143px] items-end gap-3.5 relative">
                    <input
                      id="order-id-input"
                      type="text"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="00A0 - 11B1 - 22C2"
                      className="relative w-fit mt-[-1.00px] mr-[-6.00px] font-body-b2 font-[number:var(--body-b2-font-weight)] text-[#707070cc] text-[length:var(--body-b2-font-size)] tracking-[var(--body-b2-letter-spacing)] leading-[var(--body-b2-line-height)] whitespace-nowrap [font-style:var(--body-b2-font-style)] bg-transparent border-0 outline-none appearance-none placeholder:text-[#707070cc]"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSearchOrder}
                    aria-label="Search"
                    variant="ghost"
                    size="icon"
                    className="w-5 h-5 bg-[url(/fi-rr-search-alt.svg)] bg-[100%_100%]"
                  />
                </div>
              </div>
              <div className="inline-flex items-center gap-5 relative flex-[0_0_auto]">
                <Button
                  type="button"
                  onClick={handleScanQR}
                  variant="outline"
                  shape="rounded"
                  size="lg"
                  className="w-[221px] h-[59px]"
                >
                  Scan QR
                </Button>
                <Button
                  type="button"
                  onClick={handleSearchOrder}
                  variant="primary"
                  shape="rounded"
                  size="lg"
                  className="w-[221px] h-[59px]"
                >
                  Search Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
