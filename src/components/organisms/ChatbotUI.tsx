"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, MinusCircle, ChevronDown } from "lucide-react";
import {
  ChatBubble,
  MessageRole,
  Reaction,
} from "@/components/molecules/ChatBubble";

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

const QUICK_TAGS = [
  { label: "View Menu", emoji: "🍽️" },
  { label: "Payments", emoji: "💳" },
  { label: "Hours", emoji: "🕐" },
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [reactions, setReactions] = useState<Record<string, Reaction>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Populate initial greeting client-side to avoid SSR/hydration mismatch
  useEffect(() => {
    setMessages([
      {
        id: uid(),
        role: "system",
        message: MOCK_GREETINGS[0],
        timestamp: getTimestamp(),
      },
    ]);
  }, []);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Show scroll-to-bottom button when user scrolls up
  const handleScroll = () => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 80 && messages.length > 4);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const dispatchMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = {
      id: uid(),
      role: "customer",
      message: text.trim(),
      timestamp: getTimestamp(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const botMsg: Message = {
        id: uid(),
        role: "system",
        message: getMockReply(text.trim()),
        timestamp: getTimestamp(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  };

  const sendMessage = () => {
    dispatchMessage(input);
    setInput("");
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
    <div className="flex items-center justify-center w-full min-h-screen bg-[#FFF8E1] p-4">
      {/* Chat container */}
      <div className="relative flex flex-col w-full max-w-[400px] h-[750px] rounded-[20px] shadow-2xl overflow-hidden bg-white">
        {/* ── Header ── */}
        <div
          className="relative flex items-center justify-between px-6 h-[88px] flex-shrink-0 bg-[#FFC670] rounded-t-[20px]"
          style={{ boxShadow: "0px 24px 34px rgba(174, 10, 10, 0.45)" }}
        >
          <div className="flex items-center gap-[9px]">
            {/* Logo circle */}
            <div
              className="w-12 h-12 rounded-full bg-[#FFC670] flex items-center justify-center flex-shrink-0"
              style={{ filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.25))" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 245 270"
                width={47}
                height={48}
                style={{ display: "block" }}
              >
                <path
                  d="M-10,118 C-10,118 22,36 122.5,36 C223,36 255,118 255,118 C255,118 223,200 122.5,200 C22,200 -10,118 -10,118 Z"
                  fill="white"
                />
                <rect
                  x="65"
                  y="99"
                  width="115"
                  height="38"
                  rx="19"
                  fill="#1a1a1a"
                />
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
            </div>
            {/* Brand name + status */}
            <div className="flex flex-col justify-center items-start">
              <span className="text-white font-bold text-[25px] leading-[30px]">
                Qios
              </span>
              <div className="flex items-center gap-[5px]">
                <span className="w-2 h-2 rounded-full bg-[#43EE7D]" />
                <span className="text-[#43EE7D] text-[10.24px] leading-3">
                  Online
                </span>
              </div>
            </div>
          </div>
          {/* Minimize / reset button */}
          <button
            onClick={resetChat}
            title="Restart conversation"
            className="text-white/80 hover:text-white transition-colors"
          >
            <MinusCircle size={24} />
          </button>
        </div>

        {/* Shadow strip below header */}
        <div
          className="absolute top-[88px] left-0 w-full h-7 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.24) 0%, rgba(217,217,217,0) 100%)",
          }}
        />

        {/* ── Messages area ── */}
        <div
          ref={scrollAreaRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto bg-[#F8F9FA] px-6 py-6 flex flex-col"
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
            <div className="pb-10">
              <div className="bg-[#2D2D2D] rounded-[12px_12px_12px_0px] px-5 py-4 inline-block shadow-[0px_2px_1px_rgba(0,0,0,0.05)]">
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
          <div className="absolute bottom-[140px] left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={scrollToBottom}
              className="bg-[#2D2D2D] text-white rounded-full p-2 shadow-lg hover:bg-[#444] transition-colors"
            >
              <ChevronDown size={18} />
            </button>
          </div>
        )}

        {/* ── Footer ── */}
        <div
          className="flex-shrink-0 bg-white rounded-b-[20px] p-4 flex flex-col gap-1.5 z-10"
          style={{ boxShadow: "0px -4px 16px rgba(0, 0, 0, 0.08)" }}
        >
          {/* Quick-reply tags — only show before user has sent anything */}
          {!messages.some((m) => m.role === "customer") && (
            <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none]">
              {QUICK_TAGS.map(({ label, emoji }) => (
                <button
                  key={label}
                  onClick={() => dispatchMessage(label)}
                  disabled={isTyping}
                  className="flex-shrink-0 flex items-center gap-1.5 bg-[#F3F5F6] rounded-[10px] px-3 py-1.5 text-[12.8px] font-semibold text-[#707070] leading-[15px] opacity-90 disabled:opacity-50 hover:bg-[#E8EBF0] transition-colors"
                  style={{ boxShadow: "0px 1px 0px rgba(0,0,0,0.12)" }}
                >
                  <span>{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
          )}
          {/* Input row */}
          <div className="bg-[#E8EBF0] rounded-[16px] px-[22px] py-5 flex items-center gap-4">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              disabled={isTyping}
              className="flex-1 bg-transparent text-base text-[#2D2D2D] outline-none placeholder:text-[#707070] disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="flex-shrink-0 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={24} className="text-[#FFC670]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
