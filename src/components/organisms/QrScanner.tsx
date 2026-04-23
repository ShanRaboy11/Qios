"use client";

import { useState, useRef, useCallback, useEffect, KeyboardEvent } from "react";
import {
  QrCode,
  CheckCircle,
  XCircle,
  Loader2,
  Flashlight,
  X,
  ScanLine,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import jsQR from "jsqr";

type ScanState = "idle" | "requesting" | "scanning" | "success" | "error";

// ── Corner bracket overlay ────────────────────────────────────────────────────
const ScanBrackets = ({ active }: { active: boolean }) => (
  <div
    className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
      active ? "opacity-100" : "opacity-40"
    }`}
    aria-hidden="true"
  >
    {/* top-left */}
    <span
      className={`absolute top-6 left-6 w-8 h-8 border-t-[3px] border-l-[3px] border-brand-primary rounded-tl-md ${active ? "animate-bracket-pulse" : ""}`}
    />
    {/* top-right */}
    <span
      className={`absolute top-6 right-6 w-8 h-8 border-t-[3px] border-r-[3px] border-brand-primary rounded-tr-md ${active ? "animate-bracket-pulse" : ""}`}
    />
    {/* bottom-left */}
    <span
      className={`absolute bottom-6 left-6 w-8 h-8 border-b-[3px] border-l-[3px] border-brand-primary rounded-bl-md ${active ? "animate-bracket-pulse" : ""}`}
    />
    {/* bottom-right */}
    <span
      className={`absolute bottom-6 right-6 w-8 h-8 border-b-[3px] border-r-[3px] border-brand-primary rounded-br-md ${active ? "animate-bracket-pulse" : ""}`}
    />
  </div>
);

export const QrScanner = (): JSX.Element => {
  const [orderId, setOrderId] = useState<string>("");
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const stopCamera = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setTorchOn(false);
    setTorchSupported(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const scanFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animFrameRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code) {
      stopCamera();
      setOrderId(code.data);
      setScanState("success");
    } else {
      animFrameRef.current = requestAnimationFrame(scanFrame);
    }
  }, [stopCamera]);

  const handleScanQR = async () => {
    setScanState("requesting");
    setErrorMessage("");
    setOrderId("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Detect torch support
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.() as
        | Record<string, unknown>
        | undefined;
      if (capabilities && "torch" in capabilities) setTorchSupported(true);

      setScanState("scanning");
      animFrameRef.current = requestAnimationFrame(scanFrame);
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Camera access denied. Please allow camera permissions and try again."
          : err instanceof DOMException && err.name === "NotFoundError"
            ? "No camera detected on this device."
            : "Unable to start the camera. Please try again.";
      setErrorMessage(msg);
      setScanState("error");
    }
  };

  const handleToggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    const next = !torchOn;
    try {
      await track.applyConstraints({
        advanced: [{ torch: next } as MediaTrackConstraintSet],
      });
      setTorchOn(next);
    } catch {
      // torch not supported on this device – silently ignore
    }
  };

  const handleStopScan = () => {
    stopCamera();
    setScanState("idle");
    setErrorMessage("");
  };

  const handleScanAgain = () => {
    setOrderId("");
    setScanState("idle");
  };

  const handleSearchOrder = () => {
    // Connect to routing / order lookup as needed
  };

  const handleClose = () => {
    stopCamera();
    setScanState("idle");
    setOrderId("");
    setErrorMessage("");
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && orderId.trim()) handleSearchOrder();
  };

  const isScanning = scanState === "scanning" || scanState === "requesting";

  return (
    <div className="inline-flex gap-2.5 w-full max-w-[638px] px-4 py-8 sm:px-10 sm:py-[55px] bg-background rounded-[30px] items-center justify-center relative shadow-xl">
      {/* Hidden decode canvas */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <div className="flex flex-col w-full gap-6 sm:gap-8 relative">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between w-full">
          <h2 className="font-headers-h2 font-[number:var(--headers-h2-font-weight)] text-text-primary text-2xl sm:text-[length:var(--headers-h2-font-size)] tracking-[var(--headers-h2-letter-spacing)] leading-[var(--headers-h2-line-height)] [font-style:var(--headers-h2-font-style)]">
            Scan QR Code
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close scanner"
            className="flex items-center justify-center w-8 h-8 rounded-full text-text-secondary hover:bg-black/5 hover:text-text-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Camera viewport ──────────────────────────────────────────────── */}
        <div
          className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden shadow-inner"
          style={{
            background: "linear-gradient(160deg, #FF5269 70%, #ff8a6e 100%)",
          }}
        >
          {/* Live feed */}
          <video
            ref={videoRef}
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              scanState === "scanning" ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Camera feed for QR scanning"
          />

          {/* Gradient base when no feed */}
          {scanState !== "scanning" && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(160deg, #FF5269 70%, #ff8a6e 100%)",
              }}
            />
          )}

          {/* Animated scan line */}
          {scanState === "scanning" && (
            <div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-primary to-transparent animate-scan-line pointer-events-none"
              aria-hidden="true"
            />
          )}

          {/* Corner brackets — shown while scanning or idle */}
          {(scanState === "scanning" || scanState === "idle") && (
            <ScanBrackets active={scanState === "scanning"} />
          )}

          {/* Torch button */}
          {scanState === "scanning" && torchSupported && (
            <button
              type="button"
              onClick={handleToggleTorch}
              aria-label={
                torchOn ? "Turn off flashlight" : "Turn on flashlight"
              }
              className={`absolute bottom-4 right-4 flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                torchOn
                  ? "bg-brand-primary text-text-primary"
                  : "bg-black/40 text-white hover:bg-black/60"
              }`}
            >
              <Flashlight size={16} />
            </button>
          )}

          {/* ── State overlays ── */}

          {/* Idle */}
          {scanState === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-brand-primary">
              <QrCode size={72} className="opacity-60" />
              <p className="text-sm opacity-80">Point camera at a QR code</p>
            </div>
          )}

          {/* Requesting camera */}
          {scanState === "requesting" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 size={48} className="animate-spin opacity-70" />
              <p className="text-sm opacity-70">Starting camera…</p>
            </div>
          )}

          {/* Success */}
          {scanState === "success" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-success-secondary/90">
              <CheckCircle size={64} className="text-success-primary" />
              <p className="text-base font-semibold text-success-primary">
                QR Code detected!
              </p>
              <button
                type="button"
                onClick={handleScanAgain}
                className="flex items-center gap-1.5 mt-1 text-xs text-success-primary underline underline-offset-2 hover:opacity-80"
              >
                <RotateCcw size={12} />
                Scan again
              </button>
            </div>
          )}

          {/* Error */}
          {scanState === "error" && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center"
              style={{
                background:
                  "linear-gradient(160deg, rgba(255,82,105,0.97) 70%, rgba(255,138,110,0.97) 100%)",
              }}
            >
              <XCircle size={52} className="text-warning-primary opacity-80" />
              <p className="text-sm text-slate-300">{errorMessage}</p>
              <button
                type="button"
                onClick={handleScanQR}
                className="flex items-center gap-1.5 mt-1 text-xs text-brand-primary underline underline-offset-2 hover:opacity-80"
              >
                <RotateCcw size={12} />
                Try again
              </button>
            </div>
          )}

          {/* Scanning status pill */}
          {scanState === "scanning" && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              Scanning…
            </div>
          )}
        </div>

        {/* ── Divider ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4 w-full">
          <hr className="flex-1 h-px border-0 bg-[#70707033]" />
          <p className="font-headers-h4 font-[number:var(--headers-h4-font-weight)] text-text-secondary text-xs sm:text-[length:var(--headers-h4-font-size)] text-center tracking-[var(--headers-h4-letter-spacing)] leading-[var(--headers-h4-line-height)] whitespace-nowrap [font-style:var(--headers-h4-font-style)]">
            or enter Order ID Manually
          </p>
          <hr className="flex-1 h-px border-0 bg-[#70707033]" />
        </div>

        {/* ── Manual input + actions ───────────────────────────────────────── */}
        <div className="flex flex-col gap-8">
          {/* Input */}
          <div
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 transition-colors ${
              orderId ? "border-brand-primary/60" : "border-[#7070704c]"
            } focus-within:border-brand-primary`}
          >
            <ScanLine size={18} className="text-text-secondary shrink-0" />
            <label htmlFor="order-id-input" className="sr-only">
              Order ID
            </label>
            <input
              id="order-id-input"
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="00A0 - 11B1 - 22C2"
              className="flex-1 min-w-0 font-body-b2 font-[number:var(--body-b2-font-weight)] text-text-primary text-[length:var(--body-b2-font-size)] tracking-[var(--body-b2-letter-spacing)] leading-[var(--body-b2-line-height)] [font-style:var(--body-b2-font-style)] bg-transparent border-0 outline-none placeholder:text-text-secondary/50"
            />
            {orderId && (
              <button
                type="button"
                onClick={() => setOrderId("")}
                aria-label="Clear input"
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 w-full">
            {isScanning ? (
              <Button
                type="button"
                onClick={handleStopScan}
                variant="outline"
                shape="rounded"
                size="lg"
                className="flex-1 h-[59px]"
              >
                Stop Scanning
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleScanQR}
                variant="outline"
                shape="rounded"
                size="lg"
                className="flex-1 h-[59px]"
              >
                Scan QR
              </Button>
            )}
            <Button
              type="button"
              onClick={handleSearchOrder}
              variant="primary"
              shape="rounded"
              size="lg"
              className="flex-1 h-[59px]"
              disabled={!orderId.trim()}
            >
              Search Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
