"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  ThumbsUp,
  ThumbsDown,
  ClipboardList,
  CheckCheck,
  User,
} from "lucide-react";

export type MessageRole = "system" | "customer";
export type Reaction = "like" | "dislike" | null;

interface ChatBubbleProps {
  message: string;
  timestamp: string;
  role: MessageRole;
  isRead?: boolean;
  className?: string;
  reaction?: Reaction;
  onLike?: () => void;
  onDislike?: () => void;
}

// ---------------------------------------------------------------------------
// lightweight markdown renderer
// supports: **bold**, *italic*, `code`, bullet lists (- / *), line breaks
// ---------------------------------------------------------------------------
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split(/\r?\n/);
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, li) => {
    const trimmed = line.trimStart();
    const isBullet = /^[-*•]\s+/.test(trimmed);

    if (isBullet) {
      const content = trimmed.replace(/^[-*•]\s+/, "");
      nodes.push(
        <div key={`b-${li}`} className="flex items-start gap-1.5 mb-0.5">
          <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-[#FFC670] flex-shrink-0" />
          <span>{inlineMarkdown(content)}</span>
        </div>,
      );
    } else if (trimmed === "") {
      if (li > 0 && li < lines.length - 1) {
        nodes.push(<div key={`sp-${li}`} className="h-2" />);
      }
    } else {
      nodes.push(
        <p key={`p-${li}`} className="mb-0.5 last:mb-0">
          {inlineMarkdown(line)}
        </p>,
      );
    }
  });

  return nodes;
}

/** Handle inline **bold**, *italic*, `code` */
function inlineMarkdown(text: string): React.ReactNode[] {
  // combined regex: **bold**, *italic*, `code`
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="bg-white/20 rounded px-1 py-0.5 text-[0.85em] font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

// ---------------------------------------------------------------------------
// logo SVG (Qios mascot)
// ---------------------------------------------------------------------------
const LogoSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 245 270"
    width={32}
    height={33}
    style={{ display: "block" }}
  >
    <path
      d="M-10,118 C-10,118 22,36 122.5,36 C223,36 255,118 255,118 C255,118 223,200 122.5,200 C22,200 -10,118 -10,118 Z"
      fill="white"
    />
    <rect x="65" y="99" width="115" height="38" rx="19" fill="#1a1a1a" />
    <ellipse cx="95" cy="118" rx="9" ry="9" fill="#e8405a" />
    <ellipse cx="150" cy="118" rx="9" ry="9" fill="#e8405a" />
    <g transform="translate(12,190) scale(0.898)">
      <path
        d="M49.493 6.01586C44.86 4.17819 40.316 2.17026 35.869 0C21.4169 9.97132 9.19957 22.3902 0 36.5589C15.6369 60.6421 39.9924 79.6696 69.2214 90.2156C83.1494 95.2409 98.184 98.3404 113.909 99.1433H130.296C146.017 98.3406 173.65 113.595 133.525 152.092C162.758 141.546 228.567 60.6448 244.205 36.5589C235.032 22.4305 222.858 10.0421 208.46 0.0852605C204.064 2.22496 199.574 4.20615 194.997 6.02118C175.837 13.6192 155.156 18.3054 133.525 19.5196C129.795 19.729 126.036 19.8352 122.252 19.8352C118.468 19.8352 114.709 19.729 110.979 19.5196C89.3424 18.3051 68.6565 13.617 49.493 6.01586Z"
        fill="white"
      />
    </g>
    <circle cx="94.5" cy="234" r="7.5" fill="#1a1a1a" />
    <circle cx="122.5" cy="234" r="7.5" fill="#1a1a1a" />
    <circle cx="150.5" cy="234" r="7.5" fill="#1a1a1a" />
  </svg>
);

// ---------------------------------------------------------------------------
// chatBubble
// ---------------------------------------------------------------------------
export const ChatBubble = ({
  message,
  timestamp,
  role,
  isRead,
  className,
  reaction = null,
  onLike,
  onDislike,
}: ChatBubbleProps) => {
  const isSystem = role === "system";

  const handleCopy = () => {
    navigator.clipboard.writeText(message).catch(() => {});
  };

  if (isSystem) {
    return (
      <div className={cn("flex flex-col items-start pb-10", className)}>
        <div className="group relative">
          {/* dark bubble */}
          <div className="relative bg-[#2D2D2D] rounded-[12px_12px_12px_0px] pl-5 pr-4 pt-4 pb-8 shadow-[0px_2px_1px_rgba(0,0,0,0.05)] max-w-[312px]">
            <div className="text-white text-sm leading-[1.55] space-y-0.5">
              {renderMarkdown(message)}
            </div>

            {/* copy / Like / Dislike — shown on hover or when reacted */}
            <div
              className={cn(
                "absolute right-4 bottom-2 transition-opacity duration-150",
                reaction !== null
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100",
              )}
            >
              <div className="flex items-center gap-2 bg-[#FFC670] rounded-lg p-1">
                <button
                  onClick={handleCopy}
                  title="Copy"
                  className="text-white hover:opacity-75 transition-opacity active:scale-90"
                >
                  <ClipboardList size={15} />
                </button>
                <button
                  onClick={onLike}
                  title="Like"
                  className={cn(
                    "transition-all active:scale-90 rounded p-0.5",
                    reaction === "like"
                      ? "text-white bg-white/30 scale-110"
                      : "text-white hover:opacity-75",
                  )}
                >
                  <ThumbsUp size={15} />
                </button>
                <button
                  onClick={onDislike}
                  title="Dislike"
                  className={cn(
                    "transition-all active:scale-90 rounded p-0.5",
                    reaction === "dislike"
                      ? "text-white bg-white/30 scale-110"
                      : "text-white hover:opacity-75",
                  )}
                >
                  <ThumbsDown size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* timestamp below bubble */}
          <span
            className="absolute left-14 text-[10px] leading-3 text-[#888888]"
            style={{ bottom: "-18px" }}
          >
            {timestamp}
          </span>

          {/* logo avatar at bottom-left */}
          <div
            className="absolute left-0 w-11 h-11 rounded-full bg-[#FFC670] flex items-center justify-center overflow-hidden"
            style={{
              bottom: "-26px",
              filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.25))",
            }}
          >
            <LogoSVG />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-end pb-8", className)}>
      <div className="group relative">
        {/* light bubble */}
        <div className="relative bg-[#DEE2E6] rounded-[12px_12px_0px_12px] pl-5 pr-4 pt-4 pb-5 shadow-[0px_1px_1px_rgba(0,0,0,0.2)] max-w-[289px]">
          <p className="text-[#2D2D2D] text-sm leading-[1.55]">{message}</p>
        </div>

        {/* timestamp + read status */}
        <div
          className="absolute left-0 flex items-center gap-1"
          style={{ bottom: "-18px" }}
        >
          <span className="text-[10px] leading-3 text-[#888888]">
            {timestamp}
          </span>
          <CheckCheck
            size={13}
            className={cn(isRead ? "text-[#FFC670]" : "text-[#888888]")}
          />
        </div>

        {/* user avatar at bottom-right */}
        <div
          className="absolute right-[-1px] w-11 h-11 rounded-full bg-[#FFC670] flex items-center justify-center"
          style={{ bottom: "-16px", boxShadow: "0px 2px 3px rgba(0,0,0,0.25)" }}
        >
          <User size={22} className="text-[#FFF9EF]" />
        </div>
      </div>
    </div>
  );
};
