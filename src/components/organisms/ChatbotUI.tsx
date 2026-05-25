"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, RotateCcw, ChevronDown, X, MessageCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

interface AiResponse {
  output?: string;
  error?: string;
  details?: string;
}

export interface ChatbotUIProps {
  /**
   * "page"     — full-page centred layout (used on /draft)
   * "floating" — slide-up panel triggered by a FAB overlay
   */
  mode?: "page" | "floating";
  /**
   * For floating mode: whether the chat panel is open.
   * Leave unset to let ChatbotUI manage its own open state.
   */
  isOpen?: boolean;
  onClose?: () => void;
  /**
   * Optional menu snapshot string injected into the Gemini system prompt.
   * e.g. "Burger ₱120, Fries ₱60, Iced Tea ₱45"
   */
  menuContext?: string;
  /**
   * Optional store / tenant name shown in the greeting.
   */
  storeName?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const QUICK_TAGS = [
  { label: "What's on the menu?", emoji: "🍽️" },
  { label: "How do I pay?", emoji: "💳" },
  { label: "Opening hours?", emoji: "🕐" },
  { label: "Allergen info?", emoji: "🌿" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function getGeminiReply(
  messages: Message[],
  menuContext?: string,
  storeName?: string,
): Promise<string> {
  const latestMessage = messages.at(-1)?.message ?? "";
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: latestMessage,
      messages: messages.map(({ role, message }) => ({ role, message })),
      context: menuContext,
      storeName,
    }),
  });

  const payload = (await response.json()) as AiResponse;

  if (!response.ok) {
    throw new Error(payload.details || payload.error || "AI request failed");
  }

  return (
    payload.output?.trim() ||
    "I couldn't generate a response right now. Please try again."
  );
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

function makeGreeting(storeName?: string): string {
  const name = storeName ? ` at ${storeName}` : "";
  return `Hi there! 👋 I'm the Qios AI assistant${name}. I can help you with the menu, payments, allergens, and more. What can I do for you?`;
}

// ---------------------------------------------------------------------------
// Inner chat panel (shared between page and floating modes)
// ---------------------------------------------------------------------------
interface ChatPanelProps {
  storeName?: string;
  menuContext?: string;
  /** Callback fired when the ✕ button is pressed (floating mode only) */
  onClose?: () => void;
  /** Show the close (✕) button in the header */
  showClose?: boolean;
  className?: string;
}

function ChatPanel({
  storeName,
  menuContext,
  onClose,
  showClose,
  className,
}: ChatPanelProps) {
  const INITIAL_GREETING = makeGreeting(storeName);

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
        message: INITIAL_GREETING,
        timestamp: getTimestamp(),
      },
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-focus input when panel opens
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  const updateScrollButtonVisibility = () => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const hasOverflow = el.scrollHeight > el.clientHeight;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(hasOverflow && distFromBottom > 80);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    updateScrollButtonVisibility();
  }, [messages, isTyping]);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const dispatchMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: uid(),
      role: "customer",
      message: text.trim(),
      timestamp: getTimestamp(),
    };
    const nextMessages = [...messages, userMsg];

    setMessages(nextMessages);
    setIsTyping(true);

    try {
      const reply = await getGeminiReply(nextMessages, menuContext, storeName);
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "system",
          message: reply,
          timestamp: getTimestamp(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "system",
          message:
            error instanceof Error
              ? `I'm having trouble reaching Qios AI right now: ${error.message}`
              : "I'm having trouble reaching Qios AI right now. Please try again.",
          timestamp: getTimestamp(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
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
        message: INITIAL_GREETING,
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

  const hasCustomerMessage = messages.some((m) => m.role === "customer");

  return (
    <div
      className={cn(
        "relative flex flex-col w-full rounded-[20px] shadow-2xl overflow-hidden bg-white",
        className,
      )}
    >
      {/* ── Header ── */}
      <div
        className="relative flex items-center justify-between px-5 h-[80px] flex-shrink-0 bg-[#FFC670] rounded-t-[20px]"
        style={{ boxShadow: "0px 24px 34px rgba(174,10,10,0.35)" }}
      >
        <div className="flex items-center gap-[10px]">
          {/* Logo circle */}
          <div
            className="w-11 h-11 rounded-full bg-[#FFB347] flex items-center justify-center flex-shrink-0"
            style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 245 270"
              width={43}
              height={44}
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
          </div>

          {/* Brand name + status */}
          <div className="flex flex-col justify-center items-start">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold text-[22px] leading-tight">
                Qios
              </span>
              <Sparkles size={13} className="text-white/70 mt-0.5" />
            </div>
            <div className="flex items-center gap-[5px]">
              <span className="w-2 h-2 rounded-full bg-[#43EE7D] animate-pulse" />
              <span className="text-[#43EE7D] text-[10px] font-medium">
                AI Assistant · Online
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetChat}
            title="Restart conversation"
            className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <RotateCcw size={18} />
          </button>
          {showClose && onClose && (
            <button
              onClick={onClose}
              title="Close chat"
              className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Shadow strip below header */}
      <div
        className="absolute top-[80px] left-0 w-full h-6 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(217,217,217,0) 100%)",
        }}
      />

      {/* ── Messages area ── */}
      <div
        ref={scrollAreaRef}
        onScroll={updateScrollButtonVisibility}
        className="flex-1 overflow-y-auto bg-[#F8F9FA] px-5 py-5 flex flex-col min-h-0"
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
      <AnimatePresence>
        {showScrollBtn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-[140px] left-1/2 -translate-x-1/2 z-20"
          >
            <button
              onClick={scrollToBottom}
              className="bg-[#2D2D2D] text-white rounded-full p-2 shadow-lg hover:bg-[#444] transition-colors"
            >
              <ChevronDown size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer ── */}
      <div
        className="flex-shrink-0 bg-white rounded-b-[20px] px-4 pt-3 pb-4 flex flex-col gap-2 z-10"
        style={{ boxShadow: "0px -4px 16px rgba(0, 0, 0, 0.06)" }}
      >
        {/* Quick-reply tags — only before first customer message */}
        {!hasCustomerMessage && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] pb-1"
          >
            {QUICK_TAGS.map(({ label, emoji }) => (
              <button
                key={label}
                onClick={() => dispatchMessage(label)}
                disabled={isTyping}
                className="flex-shrink-0 flex items-center gap-1.5 bg-[#FFF3DC] border border-[#FFC670]/40 rounded-[10px] px-3 py-1.5 text-[12px] font-semibold text-[#8A6200] leading-[15px] disabled:opacity-50 hover:bg-[#FFE8A6] transition-colors"
                style={{ boxShadow: "0px 1px 0px rgba(0,0,0,0.08)" }}
              >
                <span>{emoji}</span>
                {label}
              </button>
            ))}
          </motion.div>
        )}

        {/* Input row */}
        <div className="bg-[#E8EBF0] rounded-[14px] px-4 py-3 flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything…"
            disabled={isTyping}
            className="flex-1 bg-transparent text-sm text-[#2D2D2D] outline-none placeholder:text-[#9CA3AF] disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FFC670] flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FFB347] active:scale-90"
          >
            <Send size={15} className="text-white ml-0.5" />
          </button>
        </div>

        <p className="text-center text-[10px] text-[#C4C4C4] leading-tight">
          Powered by Qios AI · Responses may not always be accurate
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Floating FAB + Panel
// ---------------------------------------------------------------------------
function FloatingChatbot({
  menuContext,
  storeName,
}: Pick<ChatbotUIProps, "menuContext" | "storeName">) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat panel — rendered inside a fixed overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop (mobile) */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-black/30 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-up panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className={cn(
                "fixed z-[100]",
                // Mobile: full-width bottom sheet
                "bottom-[88px] left-3 right-3",
                // Desktop: fixed-size panel above the FAB
                "md:bottom-[88px] md:right-6 md:left-auto md:w-[380px]",
              )}
              style={{ maxHeight: "calc(100dvh - 120px)" }}
            >
              <ChatPanel
                storeName={storeName}
                menuContext={menuContext}
                onClose={() => setIsOpen(false)}
                showClose
                className="h-full max-h-[620px]"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className={cn(
          "fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors duration-200",
          isOpen ? "bg-[#2D2D2D]" : "bg-[#FFC670]",
        )}
        style={{
          boxShadow: isOpen
            ? "0 8px 32px rgba(0,0,0,0.35)"
            : "0 8px 32px rgba(255,198,112,0.5)",
        }}
        aria-label={isOpen ? "Close chat" : "Open chat assistant"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X size={24} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle size={24} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#FFC670]/50 animate-ping" />
        )}
      </motion.button>
    </>
  );
}

// ---------------------------------------------------------------------------
// Public export — ChatbotUI
// ---------------------------------------------------------------------------
export function ChatbotUI({
  mode = "page",
  menuContext,
  storeName,
  onClose,
}: ChatbotUIProps) {
  if (mode === "floating") {
    return <FloatingChatbot menuContext={menuContext} storeName={storeName} />;
  }

  // Page mode — original full-page centred layout
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-[#FFF8E1] p-4">
      <ChatPanel
        storeName={storeName}
        menuContext={menuContext}
        onClose={onClose}
        showClose={!!onClose}
        className="w-full max-w-[400px] h-[750px]"
      />
    </div>
  );
}
