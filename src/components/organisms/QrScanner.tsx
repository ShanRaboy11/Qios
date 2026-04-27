"use client";

import { useState, useRef, useCallback, useEffect, KeyboardEvent } from "react";
import {
  XCircle,
  Flashlight,
  X,
  ScanLine,
  RotateCcw,
  ArrowRight,
  Loader2,
} from "lucide-react";
import jsQR from "jsqr";
import { Button } from "@/components/atoms/Button";

type ScanState = "idle" | "requesting" | "scanning" | "success" | "error";

// ── Corner brackets ────────────────────────────────────────────────────────────
const ScanBrackets = ({ active }: { active: boolean }) => {
  const color = active ? "var(--color-brand-primary)" : "rgba(255,198,112,0.35)";
  const glow = active ? "drop-shadow(0 0 5px rgba(255,198,112,0.75))" : "none";
  const base: React.CSSProperties = {
    position: "absolute",
    width: 30,
    height: 30,
    transition: "border-color 0.3s, filter 0.3s",
    filter: glow,
  };
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <span style={{ ...base, top: 16, left: 16, borderTop: `2.5px solid ${color}`, borderLeft: `2.5px solid ${color}`, borderRadius: "4px 0 0 0" }} />
      <span style={{ ...base, top: 16, right: 16, borderTop: `2.5px solid ${color}`, borderRight: `2.5px solid ${color}`, borderRadius: "0 4px 0 0" }} />
      <span style={{ ...base, bottom: 16, left: 16, borderBottom: `2.5px solid ${color}`, borderLeft: `2.5px solid ${color}`, borderRadius: "0 0 0 4px" }} />
      <span style={{ ...base, bottom: 16, right: 16, borderBottom: `2.5px solid ${color}`, borderRight: `2.5px solid ${color}`, borderRadius: "0 0 4px 0" }} />
    </div>
  );
};

// ── Decorative QR placeholder icon — uniform single color ─────────────────────
const QrPlaceholder = () => (
  <svg width="68" height="68" viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <rect x="8" y="8" width="20" height="20" rx="3" stroke="var(--color-text-secondary)" strokeWidth="2" strokeOpacity="0.4" />
    <rect x="13" y="13" width="10" height="10" rx="1.5" fill="var(--color-text-secondary)" fillOpacity="0.25" />
    <rect x="36" y="8" width="20" height="20" rx="3" stroke="var(--color-text-secondary)" strokeWidth="2" strokeOpacity="0.4" />
    <rect x="41" y="13" width="10" height="10" rx="1.5" fill="var(--color-text-secondary)" fillOpacity="0.25" />
    <rect x="8" y="36" width="20" height="20" rx="3" stroke="var(--color-text-secondary)" strokeWidth="2" strokeOpacity="0.4" />
    <rect x="13" y="41" width="10" height="10" rx="1.5" fill="var(--color-text-secondary)" fillOpacity="0.25" />
    <rect x="36" y="36" width="8" height="8" rx="1.5" fill="var(--color-text-secondary)" fillOpacity="0.25" />
    <rect x="48" y="36" width="8" height="8" rx="1.5" fill="var(--color-text-secondary)" fillOpacity="0.25" />
    <rect x="36" y="48" width="8" height="8" rx="1.5" fill="var(--color-text-secondary)" fillOpacity="0.25" />
    <rect x="48" y="48" width="8" height="8" rx="1.5" fill="var(--color-text-secondary)" fillOpacity="0.25" />
  </svg>
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
  const scanSessionRef = useRef<number>(0);

  const stopCamera = useCallback(() => {
    scanSessionRef.current += 1;
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
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) { animFrameRef.current = requestAnimationFrame(scanFrame); return; }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      stopCamera();
      setErrorMessage("Unable to access camera preview.");
      setScanState("error");
      return;
    }
    if (canvas.width !== vw || canvas.height !== vh) { canvas.width = vw; canvas.height = vh; }
    ctx.drawImage(video, 0, 0, vw, vh);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
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
    scanSessionRef.current += 1;
    const sessionId = scanSessionRef.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (sessionId !== scanSessionRef.current) { stream.getTracks().forEach((t) => t.stop()); return; }
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      if (sessionId !== scanSessionRef.current) return;
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.() as Record<string, unknown> | undefined;
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
      await track.applyConstraints({ advanced: [{ torch: next } as MediaTrackConstraintSet] });
      setTorchOn(next);
    } catch {}
  };

  const handleStopScan = () => { stopCamera(); setScanState("idle"); setErrorMessage(""); };
  const handleScanAgain = () => { setOrderId(""); setScanState("idle"); };
  const handleSearchOrder = () => { /* Connect to routing / order lookup */ };
  const handleClose = () => { stopCamera(); setScanState("idle"); setOrderId(""); setErrorMessage(""); };
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && orderId.trim()) handleSearchOrder();
  };

  const isScanning = scanState === "scanning" || scanState === "requesting";

  return (
    <>
      <style>{`
        .qrs-wrap {
          background: linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(255,249,239,0.5) 100%);
          border-radius: 32px;
          padding: 40px 36px 44px;
          max-width: 580px;
          width: 100%;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.4);
          /* Added outer glow behind the card */
          box-shadow:
            0 24px 64px -12px rgba(0, 0, 0, 0.08),
            0 0 0 1px rgba(255, 198, 112, 0.3),
            0 0 80px rgba(255, 198, 112, 0.25),
            inset 0 2px 0 rgba(255, 255, 255, 1);
        }
        
        /* Inner container that contains hiding overflow so the outer glow remains visible */
        .qrs-wrap-inner {
          position: absolute; inset: 0;
          border-radius: 32px;
          overflow: hidden;
          pointer-events: none;
        }

        /* Techy animated dot texture on the outer card */
        .qrs-dots {
          position: absolute; inset: 0; pointer-events: none; border-radius: 32px;
          background-image: 
            radial-gradient(circle, rgba(112,112,112,0.06) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,198,112,0.1) 1.5px, transparent 1.5px);
          background-size: 22px 22px, 66px 66px;
          background-position: 0 0, 11px 11px;
          opacity: 0.8;
        }

        /* Ambient floating glow behind the card content */
        .qrs-ambient-glow {
          position: absolute;
          top: -30%; left: -20%;
          width: 70%; height: 60%;
          background: radial-gradient(ellipse at center, rgba(255,198,112,0.15) 0%, transparent 70%);
          filter: blur(40px);
          pointer-events: none;
        }

        /* ── Badge ── */
        .qrs-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: linear-gradient(90deg, rgba(255, 82, 105, 0.12), rgba(255, 82, 105, 0.04));
          border: 1px solid rgba(255, 82, 105, 0.2);
          border-radius: 100px;
          padding: 6px 14px 6px 10px;
          margin-bottom: 12px;
          backdrop-filter: blur(8px);
        }
        .qrs-badge-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--color-brand-accent);
          box-shadow: 0 0 8px var(--color-brand-accent);
          animation: qrsDotPulse 2s ease-in-out infinite;
        }
        .qrs-badge-label {
          font-family: var(--font-inter), sans-serif;
          font-size: 10.2px; font-weight: 400; line-height: 125%;
          letter-spacing: 0.07em; text-transform: uppercase;
          color: var(--color-brand-accent);
        }
        @keyframes qrsDotPulse {
          0%,100% { opacity:1; box-shadow: 0 0 6px rgba(255,82,105,0.5); }
          50%      { opacity: 0.45; box-shadow: none; }
        }

        /* ── Title — modernized ── */
        .qrs-title {
          font-family: var(--font-figtree), sans-serif;
          font-size: 42px; font-weight: 700; line-height: 1.1;
          background: linear-gradient(135deg, var(--color-text-primary) 0%, rgba(45,45,45,0.75) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          margin: 0; letter-spacing: -0.015em;
        }

        /* Close button — modernized */
        .qrs-close {
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(112,112,112,0.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--color-text-secondary);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); flex-shrink: 0;
          border-radius: 50%;
        }
        .qrs-close:hover { 
          color: var(--color-text-primary); 
          background: #fff; 
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.08); 
        }

        /* ── Viewport card — enhanced glass/tech effect ── */
        .qrs-viewport {
          position: relative; border-radius: 20px; overflow: hidden;
          aspect-ratio: 4 / 3;
          background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,249,239,0.2) 100%);
          backdrop-filter: blur(12px);
          border: 1.5px solid rgba(255, 198, 112, 0.4);
          margin-bottom: 28px;
          box-shadow: 
            inset 0 0 40px rgba(255,198,112,0.15),
            0 12px 32px -12px rgba(255,198,112,0.2);
        }

        /* Ambient floating shapes inside viewport */
        .qrs-vp-blob-amber {
          position: absolute; pointer-events: none; border-radius: 50%;
          top: -20%; right: -20%;
          width: 60%; height: 60%;
          background: radial-gradient(circle, rgba(255,198,112,0.6) 0%, transparent 70%);
          filter: blur(25px);
          animation: floatBlob 10s ease-in-out infinite alternate;
        }
        .qrs-vp-blob-accent {
          position: absolute; pointer-events: none; border-radius: 50%;
          bottom: -30%; left: -10%;
          width: 50%; height: 50%;
          background: radial-gradient(circle, rgba(255,82,105,0.3) 0%, transparent 70%);
          filter: blur(30px);
          animation: floatBlob 12s ease-in-out infinite alternate-reverse;
        }
        .qrs-vp-blob-mid {
          position: absolute; pointer-events: none; border-radius: 50%;
          top: 40%; left: 30%;
          width: 40%; height: 40%;
          background: radial-gradient(circle, rgba(255,215,122,0.4) 0%, transparent 70%);
          filter: blur(20px);
          animation: floatBlob 8s ease-in-out infinite alternate;
        }

        @keyframes floatBlob {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(4%, 4%) scale(1.02); }
          100% { transform: translate(-2%, 2%) scale(0.98); }
        }

        /* Techy Grid overlay inside viewport */
        .qrs-vp-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,198,112,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,198,112,0.2) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.7;
          mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
        }

        .qrs-video {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; opacity: 0; transition: opacity 0.5s ease-in;
        }
        .qrs-video.live { opacity: 1; }

        /* Scan line */
        @keyframes qrsScanDown {
          0%   { top: 12px; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { top: calc(100% - 12px); opacity: 0; }
        }
        .qrs-scanline {
          position: absolute; left: 16px; right: 16px; height: 3px;
          background: linear-gradient(90deg, transparent, var(--color-brand-accent), #fff, var(--color-brand-accent), transparent);
          top: 12px;
          animation: qrsScanDown 2.8s cubic-bezier(0.4,0,0.6,1) infinite;
          border-radius: 4px;
          box-shadow: 0 0 16px 4px rgba(255,82,105,0.6), 0 0 32px 8px rgba(255,82,105,0.25);
          pointer-events: none;
        }

        /* Scanning status pill */
        .qrs-pill {
          position: absolute; top: 18px; left: 50%; transform: translateX(-50%);
          background: rgba(255,255,255,0.85);
          border: 1px solid rgba(255,198,112,0.6);
          border-radius: 100px; padding: 6px 16px;
          display: flex; align-items: center; gap: 8px;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          font-family: var(--font-inter), sans-serif;
          font-size: 13px; font-weight: 500;
          color: var(--color-text-primary); white-space: nowrap;
        }
        .qrs-pill-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--color-brand-accent);
          box-shadow: 0 0 6px var(--color-brand-accent);
          animation: qrsDotPulse 1s ease-in-out infinite;
        }

        /* Torch */
        .qrs-torch {
          position: absolute; bottom: 14px; right: 14px;
          width: 38px; height: 38px; border-radius: 50%;
          background: rgba(255,249,239,0.9);
          border: 1px solid rgba(255,198,112,0.38);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
          color: var(--color-text-secondary);
        }
        .qrs-torch.on {
          background: var(--color-brand-primary);
          border-color: var(--color-brand-primary);
          color: var(--color-text-primary);
        }
        .qrs-torch:hover {
          background: var(--color-brand-primary);
          color: var(--color-text-primary);
          border-color: var(--color-brand-primary);
        }

        /* State overlays */
        .qrs-state {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 14px;
        }
        .qrs-state-label {
          font-family: var(--font-inter), sans-serif;
          font-size: 14px; font-weight: 500;
          color: var(--color-text-secondary); opacity: 0.85;
          max-width: 220px; text-align: center;
        }
        .qrs-state-success { background: rgba(240,253,244,0.9); backdrop-filter: blur(8px); }
        .qrs-state-error   { background: rgba(255,245,245,0.9); backdrop-filter: blur(8px); }
        .qrs-success-title {
          font-family: var(--font-figtree), sans-serif;
          font-size: 20px; font-weight: 600;
          color: var(--color-success-primary);
        }
        .qrs-error-msg {
          font-family: var(--font-inter), sans-serif;
          font-size: 14px; font-weight: 500; line-height: 1.5;
          color: var(--color-warning-primary);
          max-width: 240px; text-align: center;
        }
        .qrs-rescan {
          background: rgba(255,255,255,0.9); border: 1px solid rgba(0,0,0,0.05);
          cursor: pointer; padding: 8px 16px; border-radius: 100px;
          font-family: var(--font-inter), sans-serif;
          font-size: 13px; font-weight: 600;
          display: inline-flex; align-items: center; gap: 6px;
          transition: all 0.2s; margin-top: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }
        .qrs-rescan:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,0.08); }

        /* ── Divider ── */
        .qrs-divider {
          display: flex; align-items: center; gap: 16px; margin: 24px 0 20px;
        }
        .qrs-divider-line {
          flex: 1; height: 1px; border: none;
          background: linear-gradient(90deg, transparent, rgba(112,112,112,0.18), transparent);
        }
        .qrs-divider-text {
          font-family: var(--font-inter), sans-serif;
          font-size: 10.2px; font-weight: 400; line-height: 125%;
          letter-spacing: 0.07em; text-transform: uppercase;
          color: var(--color-text-secondary); opacity: 0.55; white-space: nowrap;
        }

        /* ── Input ── */
        .qrs-input-wrap {
          display: flex; align-items: center; gap: 10px;
          background: #ffffff;
          border: 1.5px solid rgba(112,112,112,0.16);
          border-radius: 14px; padding: 13px 17px;
          margin-bottom: 20px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .qrs-input-wrap:focus-within {
          border-color: var(--color-brand-primary);
          box-shadow: 0 0 0 3px rgba(255,198,112,0.16);
        }
        .qrs-input-wrap.has-value { border-color: rgba(255,198,112,0.5); }
        .qrs-input {
          flex: 1; min-width: 0; background: none; border: none; outline: none;
          font-family: var(--font-inter), sans-serif;
          font-size: 16px; font-weight: 500; line-height: 125%;
          color: var(--color-text-primary);
        }
        .qrs-input::placeholder {
          color: var(--color-text-secondary); opacity: 0.4;
          letter-spacing: 0.05em;
        }
        .qrs-input-clear {
          background: none; border: none; cursor: pointer;
          color: var(--color-text-secondary); opacity: 0.4;
          display: flex; align-items: center; transition: opacity 0.18s;
        }
        .qrs-input-clear:hover { opacity: 0.85; }

        /* ── Buttons Container ── */
        .qrs-btns { display: flex; gap: 10px; }

        @keyframes qrsSpin { to { transform: rotate(360deg); } }
        .qrs-spin { animation: qrsSpin 1.1s linear infinite; }

        @media (max-width: 480px) {
          .qrs-wrap  { padding: 28px 20px 34px; border-radius: 22px; }
          .qrs-title { font-size: 28px; }
          .qrs-btns  { flex-direction: column; }
        }
      `}</style>

      <div className="qrs-wrap">
        <div className="qrs-wrap-inner">
          <div className="qrs-ambient-glow" />
          <div className="qrs-dots" />
        </div>

        {/* Hidden decode canvas */}
        <canvas ref={canvasRef} style={{ display: "none" }} aria-hidden="true" />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", zIndex: 10 }}>

          {/* ── Header ── */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              {/* Badge uses accent color */}
              <div className="qrs-badge">
                <div className="qrs-badge-dot" />
                <span className="qrs-badge-label">Order Scanner</span>
              </div>
              {/* Title — "QR" same color as the rest, no accent emphasis */}
              <h2 className="qrs-title">Scan QR Code</h2>
            </div>
            {/* Close — no background blob, plain icon button */}
            <button className="qrs-close" type="button" onClick={handleClose} aria-label="Close scanner">
              <X size={16} />
            </button>
          </div>

          {/* ── Viewport — blobs live inside here ── */}
          <div className="qrs-viewport">
            {/* Blobs inside the viewport card */}
            <div className="qrs-vp-blob-amber" />
            <div className="qrs-vp-blob-accent" />
            <div className="qrs-vp-blob-mid" />

            {/* Grid on top of blobs */}
            <div className="qrs-vp-grid" />

            <video
              ref={videoRef}
              muted
              playsInline
              className={`qrs-video${scanState === "scanning" ? " live" : ""}`}
              aria-label="Camera feed for QR scanning"
            />

            {scanState === "scanning" && <div className="qrs-scanline" aria-hidden="true" />}

            {(scanState === "idle" || scanState === "scanning") && (
              <ScanBrackets active={scanState === "scanning"} />
            )}

            {scanState === "scanning" && torchSupported && (
              <button
                type="button"
                onClick={handleToggleTorch}
                className={`qrs-torch${torchOn ? " on" : ""}`}
                aria-label={torchOn ? "Turn off flashlight" : "Turn on flashlight"}
              >
                <Flashlight size={15} />
              </button>
            )}

            {scanState === "scanning" && (
              <div className="qrs-pill">
                <div className="qrs-pill-dot" />
                <span>Scanning…</span>
              </div>
            )}

            {/* Idle */}
            {scanState === "idle" && (
              <div className="qrs-state">
                <QrPlaceholder />
                <p className="qrs-state-label">Point camera at a QR code</p>
              </div>
            )}

            {/* Requesting */}
            {scanState === "requesting" && (
              <div className="qrs-state">
                <Loader2 size={48} className="qrs-spin" style={{ color: "var(--color-brand-primary)" }} />
                <p className="qrs-state-label">Starting camera…</p>
              </div>
            )}

            {/* Success */}
            {scanState === "success" && (
              <div className="qrs-state qrs-state-success">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
                  <circle cx="28" cy="28" r="26" stroke="var(--color-success-primary)" strokeWidth="1.5" strokeOpacity="0.28" />
                  <circle cx="28" cy="28" r="19" stroke="var(--color-success-primary)" strokeWidth="1" strokeOpacity="0.18" />
                  <path d="M17 28l8 8 14-16" stroke="var(--color-success-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="qrs-success-title">QR Code detected!</p>
                <button
                  type="button"
                  onClick={handleScanAgain}
                  className="qrs-rescan"
                  style={{ color: "var(--color-success-primary)" }}
                >
                  <RotateCcw size={12} /> Scan again
                </button>
              </div>
            )}

            {/* Error */}
            {scanState === "error" && (
              <div className="qrs-state qrs-state-error">
                <XCircle size={48} style={{ color: "var(--color-brand-accent)", opacity: 0.8 }} />
                <p className="qrs-error-msg">{errorMessage}</p>
                <button
                  type="button"
                  onClick={handleScanQR}
                  className="qrs-rescan"
                  style={{ color: "var(--color-warning-primary)" }}
                >
                  <RotateCcw size={12} /> Try again
                </button>
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div className="qrs-divider">
            <hr className="qrs-divider-line" />
            <span className="qrs-divider-text">or enter Order ID manually</span>
            <hr className="qrs-divider-line" />
          </div>

          {/* ── Manual input ── */}
          <div className={`qrs-input-wrap${orderId ? " has-value" : ""}`}>
            <ScanLine size={17} style={{ color: "var(--color-text-secondary)", opacity: 0.45, flexShrink: 0 }} />
            <label htmlFor="order-id-input" className="sr-only">Order ID</label>
            <input
              id="order-id-input"
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="00A0 – 11B1 – 22C2"
              className="qrs-input"
            />
            {orderId && (
              <button
                type="button"
                onClick={() => setOrderId("")}
                className="qrs-input-clear"
                aria-label="Clear input"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* ── Action buttons ── */}
          <div className="qrs-btns mt-3">
            {isScanning ? (
              <Button
                type="button"
                onClick={handleStopScan}
                variant="warning"
                shape="pill"
                className="flex-1 h-[58px] text-base font-semibold font-figtree shadow-sm border border-warning-primary/20 backdrop-blur-md"
              >
                Stop Scanning
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleScanQR}
                variant="primary"
                shape="pill"
                className="flex-1 h-[58px] text-base font-semibold font-figtree shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Scan QR
              </Button>
            )}
            <Button
              type="button"
              onClick={handleSearchOrder}
              variant="outline"
              shape="pill"
              disabled={!orderId.trim()}
              className="flex-1 h-[58px] text-base font-semibold font-figtree bg-white hover:!bg-brand-accent hover:!border-brand-accent hover:!text-white transition-all duration-300"
              rightIcon={<ArrowRight size={18} className="opacity-90" />}
            >
              Search Order
            </Button>
          </div>

        </div>
      </div>
    </>
  );
};