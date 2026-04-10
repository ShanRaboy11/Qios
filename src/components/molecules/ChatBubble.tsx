"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Bot,
  User,
  CheckCheck,
  ThumbsUp,
  ThumbsDown,
  ClipboardList,
} from "lucide-react";

export type MessageRole = "system" | "customer";

interface ChatBubbleProps {
  message: string;
  timestamp: string;
  role: MessageRole;
  isRead?: boolean;
  className?: string;
}

export const ChatBubble = ({
  message,
  timestamp,
  role,
  isRead,
  className,
}: ChatBubbleProps) => {
  const isSystem = role === "system";

  return (
    <div
      className={cn(
        "flex w-full mb-6 gap-3",
        isSystem ? "flex-row" : "flex-row-reverse",
        className,
      )}
    >
      {/* 1. Avatar Circle */}
      <div className="flex flex-col justify-end">
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#FFB84C] flex items-center justify-center border-2 border-white shadow-sm shrink-0">
          {isSystem ? (
            <Bot className="text-white w-6 h-6 sm:w-7 sm:h-7" />
          ) : (
            <User className="text-white w-6 h-6 sm:w-7 sm:h-7" />
          )}
        </div>
      </div>

      {/* 2. Message Container */}
      <div
        className={cn(
          "flex flex-col max-w-[80%] sm:max-w-[70%]",
          isSystem ? "items-start" : "items-end",
        )}
      >
        {/* System Message Icons (Seen in image_5db54a.png) */}
        {isSystem && (
          <div className="flex gap-1 mb-[-10px] mr-2 self-end z-10">
            <div className="p-1.5 bg-brand-primary rounded-lg text-white shadow-sm">
              <ClipboardList size={14} />
            </div>
            <div className="p-1.5 bg-brand-primary rounded-lg text-white shadow-sm">
              <ThumbsUp size={14} />
            </div>
            <div className="p-1.5 bg-brand-primary rounded-lg text-white shadow-sm">
              <ThumbsDown size={14} />
            </div>
          </div>
        )}

        {/* Bubble */}
        <div
          className={cn(
            "p-3 sm:p-4 rounded-2xl text-[14px] sm:b2 leading-relaxed shadow-sm",
            isSystem
              ? "bg-[#2D2D2D] text-white rounded-bl-none"
              : "bg-[#E5E7EB] text-text-primary rounded-br-none",
          )}
        >
          {message}
        </div>

        {/* 3. Footer: Time and Status */}
        <div className="flex items-center gap-1 mt-1 px-1">
          <span className="text-[10px] sm:b5 text-text-secondary">
            {timestamp}
          </span>
          {!isSystem && (
            <CheckCheck
              size={14}
              className={cn(
                isRead ? "text-brand-primary" : "text-text-secondary",
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};
