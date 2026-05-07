"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, RotateCcw, ChevronDown } from "lucide-react";
import {
  ChatBubble,
  MessageRole,
  Reaction,
} from "@/components/molecules/ChatBubble";
import { ChatbotLogo } from "@/components/molecules/ChatbotLogo";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Message {
  id: string;
  role: MessageRole;
  message: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Mock AI brain (runs 100% client-side, no backend needed)
// ---------------------------------------------------------------------------
const MOCK_GREETINGS = [
  "Hi there! I'm Qios Assistant 👋 How can I help you today?",
];

const MOCK_RESPONSES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
    reply: "Hey! Great to chat with you. What can I help you with?",
  },
  {
    keywords: ["menu", "food", "order", "eat", "dish", "item"],
    reply:
      "Our menu is packed with delicious options! You can browse categories like Mains, Sides, Drinks, and Desserts. Anything specific you're craving?",
  },
  {
    keywords: ["price", "cost", "how much", "expensive", "cheap"],
    reply:
      "Prices vary by item. Most mains range from ₱150–₱350. Would you like me to show you a specific category?",
  },
  {
    keywords: ["hours", "open", "close", "schedule", "time"],
    reply:
      "We're open Monday–Sunday, 9 AM to 10 PM. Is there anything else you'd like to know?",
  },
  {
    keywords: ["location", "address", "where", "find"],
    reply:
      "You can find us at the food court! Once you scan a table QR code, you'll be directed to our ordering page automatically.",
  },
  {
    keywords: ["allergy", "allergic", "gluten", "vegan", "vegetarian", "halal"],
    reply:
      "We take dietary needs seriously! Please let your server know about any allergies when placing your order, and we'll do our best to accommodate you.",
  },
  {
    keywords: ["wait", "long", "how long", "eta", "ready"],
    reply:
      "Typical preparation time is 10–20 minutes depending on order volume. Our kitchen will notify you when your order is ready!",
  },
  {
    keywords: ["cancel", "change", "modify", "update"],
    reply:
      "Orders can be modified within 2 minutes of placement. After that, please speak to a staff member at the counter.",
  },
  {
    keywords: ["payment", "pay", "cash", "card", "gcash", "maya"],
    reply:
      "We accept Cash, GCash, Maya, and major credit/debit cards. Payment is done at the counter upon pickup or delivery to your table.",
  },
  {
    keywords: ["thank", "thanks", "appreciate"],
    reply:
      "You're very welcome! Let me know if there's anything else I can help with. 😊",
  },
  {
    keywords: ["bye", "goodbye", "see you", "later"],
    reply: "Goodbye! Enjoy your meal and have a wonderful day! 🍽️",
  },
  {
    keywords: ["help", "support", "assist"],
    reply:
      "Of course! I can help you with menu questions, pricing, hours, allergies, and order info. What do you need?",
  },
];

const FALLBACK_RESPONSES = [
  "That's a great question! Unfortunately, I'm not sure about that one. A staff member would be happy to help!",
  "I don't have that info right now, but feel free to ask a staff member nearby.",
  "Hmm, I'm still learning! Could you try rephrasing? Or ask one of our staff members.",
];

function getMockReply(input: string): string {
  const lower = input.toLowerCase();
  const match = MOCK_RESPONSES.find((r) =>
    r.keywords.some((kw) => lower.includes(kw)),
  );
  if (match) return match.reply;
  return FALLBACK_RESPONSES[
    Math.floor(Math.random() * FALLBACK_RESPONSES.length)
  ];
}

function getTimestamp(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ---------------------------------------------------------------------------
// Organism
// ---------------------------------------------------------------------------
export function ChatbotUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uid(),
      role: "system",
      message: MOCK_GREETINGS[0],
      timestamp: getTimestamp(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [reactions, setReactions] = useState<Record<string, Reaction>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Show scroll-to-bottom button when user scrolls up
  const handleScroll = () => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 80);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = {
      id: uid(),
      role: "customer",
      message: trimmed,
      timestamp: getTimestamp(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate network / thinking delay
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const botMsg: Message = {
        id: uid(),
        role: "system",
        message: getMockReply(trimmed),
        timestamp: getTimestamp(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: uid(),
        role: "system",
        message: MOCK_GREETINGS[0],
        timestamp: getTimestamp(),
      },
    ]);
    setInput("");
    setIsTyping(false);
    setReactions({});
  };

  const handleReaction = (id: string, type: "like" | "dislike") => {
    setReactions((prev) => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }));
  };

  return (
    /* Outer centering wrapper */
    <div className="flex items-center justify-center w-full min-h-screen bg-[#FFF8E1] p-4">
      {/* Phone-like shell */}
      <div className="flex flex-col w-full max-w-[420px] h-[85vh] max-h-[780px] rounded-3xl shadow-2xl overflow-hidden border border-[#F0E0B0] bg-white">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#2D2D2D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <ChatbotLogo size={36} />
            </div>
            <div>
              <p className="text-white font-semibold text-[15px] leading-tight">
                Qios Assistant
              </p>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-[11px]">Online</span>
              </span>
            </div>
          </div>
          <button
            onClick={resetChat}
            title="Restart conversation"
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* ── Messages area ── */}
        <div
          ref={scrollAreaRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-3 py-4 bg-[#F9F5EB] space-y-1 scroll-smooth"
          style={{ overscrollBehavior: "contain" }}
        >
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              role={msg.role}
              message={msg.message}
              timestamp={msg.timestamp}
              isRead={true}
              reaction={reactions[msg.id] ?? null}
              onLike={() => handleReaction(msg.id, "like")}
              onDislike={() => handleReaction(msg.id, "dislike")}
            />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-end gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-[#FFB84C] flex items-center justify-center border-2 border-white shadow-sm shrink-0">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <div className="bg-[#2D2D2D] rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <span className="flex gap-1 items-center h-4">
                  <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll-to-bottom FAB */}
        {showScrollBtn && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
            <button
              onClick={scrollToBottom}
              className="bg-[#2D2D2D] text-white rounded-full p-2 shadow-lg hover:bg-[#444] transition-colors"
            >
              <ChevronDown size={18} />
            </button>
          </div>
        )}

        {/* ── Input bar ── */}
        <div className="px-3 py-3 bg-white border-t border-gray-100 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything…"
            disabled={isTyping}
            className={cn(
              "flex-1 bg-[#F4F4F4] rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none",
              "placeholder:text-gray-400 transition-all",
              "focus:ring-2 focus:ring-[#FFB84C]/60",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className={cn(
              "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all",
              input.trim() && !isTyping
                ? "bg-[#FFB84C] text-white shadow-md hover:bg-[#FFA726] active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-not-allowed",
            )}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
