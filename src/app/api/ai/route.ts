import { NextRequest, NextResponse } from "next/server";

const GEMINI_MODEL = process.env.GOOGLE_GEMINI_MODEL ?? "gemini-2.5-flash";

type ChatMessage = {
  role: "system" | "customer";
  message: string;
};

type GeminiPart = {
  text?: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
  }>;
};

type GeminiErrorResponse = {
  error?: {
    message?: string;
    status?: string;
  };
};

function getGeminiModelPath(model: string) {
  return model.startsWith("models/") ? model : `models/${model}`;
}

function buildConversationPrompt({
  prompt,
  context,
  messages,
  storeName,
}: {
  prompt: string;
  context?: string;
  messages?: ChatMessage[];
  storeName?: string;
}) {
  const store = storeName ? `Store name: ${storeName}.` : "";

  const menuBlock = context
    ? `Current menu items available:\n${context}\n\nUse this menu information to answer customer questions accurately. If an item is not on the menu, say so politely.`
    : "No menu data was provided. If a customer asks about specific items, let them know you don't have live menu data right now and suggest they check the menu board.";

  const conversation = messages
    ?.filter((message) => message.message.trim())
    .map((message) => {
      const speaker = message.role === "customer" ? "Customer" : "Qios AI";
      return `${speaker}: ${message.message.trim()}`;
    })
    .join("\n");

  return [
    `You are Qios AI, a friendly and helpful F&B kiosk ordering assistant. ${store}`,
    "Your role: help customers with menu questions, item recommendations, payment methods, opening hours, allergen information, and order changes.",
    "Tone: warm, concise, and practical. Keep responses under 3 short paragraphs. Use bullet points for lists.",
    "Format: Use **bold** for item names and prices. Use bullet points (- item) for lists. Do not use markdown headers (##).",
    "If you genuinely don't know restaurant-specific information (e.g. exact hours), say so and suggest asking a staff member.",
    "",
    menuBlock,
    "",
    store,
    conversation
      ? `Conversation so far:\n${conversation}`
      : `Customer: ${prompt}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GOOGLE_GEMINI_API_KEY is not configured." },
        { status: 500 },
      );
    }

    const { prompt, context, messages, storeName } = (await request.json()) as {
      prompt?: string;
      context?: string;
      messages?: ChatMessage[];
      storeName?: string;
    };

    const latestPrompt = prompt?.trim() || messages?.at(-1)?.message.trim();

    if (!latestPrompt) {
      return NextResponse.json(
        { error: "A prompt value or at least one message is required." },
        { status: 400 },
      );
    }

    const combinedPrompt = buildConversationPrompt({
      prompt: latestPrompt,
      context,
      messages,
      storeName,
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${getGeminiModelPath(
        GEMINI_MODEL,
      )}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: combinedPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 800,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorPayload = (await response
        .json()
        .catch(() => null)) as GeminiErrorResponse | null;
      const details =
        errorPayload?.error?.message ??
        errorPayload?.error?.status ??
        "Gemini API request failed";

      return NextResponse.json(
        { error: "Gemini API request failed", details },
        { status: response.status },
      );
    }

    const data = (await response.json()) as GeminiResponse;
    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("\n")
        .trim() ?? "";

    return NextResponse.json({
      model: GEMINI_MODEL,
      output: text,
      raw: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected AI route error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
