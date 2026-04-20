"use client";

import { useState } from "react";
import icons8QrCode801 from "./icons8-qr-code-80-1.png";

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
        <button
          onClick={handleClose}
          aria-label="Close"
          className="all-[unset] box-border relative w-[30px] h-[30px] aspect-[1] bg-[url(/fi-rr-cross-small.svg)] bg-[100%_100%] cursor-pointer"
        />
        <div className="flex flex-col items-center gap-[59px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col w-[258px] items-center gap-[59px] relative flex-[0_0_auto]">
            <h2 className="relative self-stretch mt-[-1.00px] font-headers-h2 font-[number:var(--headers-h2-font-weight)] text-text-primary text-[length:var(--headers-h2-font-size)] text-center tracking-[var(--headers-h2-letter-spacing)] leading-[var(--headers-h2-line-height)] [font-style:var(--headers-h2-font-style)]">
              Scan QR Code
            </h2>
            <img
              className="relative self-stretch w-full h-[250px] object-cover"
              alt="Qr code"
              src={icons8QrCode801.src}
            />
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
                  <button
                    onClick={handleSearchOrder}
                    aria-label="Search"
                    className="all-[unset] box-border relative w-5 h-5 aspect-[1] bg-[url(/fi-rr-search-alt.svg)] bg-[100%_100%] cursor-pointer"
                  />
                </div>
              </div>
              <div className="inline-flex items-center gap-5 relative flex-[0_0_auto]">
                <button
                  onClick={handleScanQR}
                  className="all-[unset] box-border flex w-[221px] h-[59px] p-4 rounded-xl overflow-hidden border-2 border-solid border-primary items-center justify-center relative cursor-pointer"
                >
                  <div className="inline-flex items-start gap-2 px-4 py-0 relative flex-[0_0_auto]">
                    <span className="relative w-fit mt-[-1.00px] font-body-b2 font-[number:var(--body-b2-font-weight)] text-primary text-[length:var(--body-b2-font-size)] tracking-[var(--body-b2-letter-spacing)] leading-[var(--body-b2-line-height)] whitespace-nowrap [font-style:var(--body-b2-font-style)]">
                      Scan QR
                    </span>
                  </div>
                </button>
                <button
                  onClick={handleSearchOrder}
                  className="all-[unset] box-border flex w-[221px] h-[59px] items-center justify-center p-4 relative bg-secondary rounded-xl overflow-hidden cursor-pointer"
                >
                  <div className="inline-flex items-start gap-2 px-4 py-0 relative flex-[0_0_auto]">
                    <span className="relative w-fit mt-[-1.00px] font-body-b2 font-[number:var(--body-b2-font-weight)] text-text-primary text-[length:var(--body-b2-font-size)] tracking-[var(--body-b2-letter-spacing)] leading-[var(--body-b2-line-height)] whitespace-nowrap [font-style:var(--body-b2-font-style)]">
                      Search Order
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
