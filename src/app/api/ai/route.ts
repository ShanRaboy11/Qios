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
}: {
  prompt: string;
  context?: string;
  messages?: ChatMessage[];
}) {
  const conversation = messages
    ?.filter((message) => message.message.trim())
    .map((message) => {
      const speaker = message.role === "customer" ? "Customer" : "Qios AI";
      return `${speaker}: ${message.message.trim()}`;
    })
    .join("\n");

  return [
    "You are Qios AI, a friendly F&B kiosk ordering assistant.",
    "Help customers with menu questions, payment options, opening hours, allergies, order changes, and general ordering support.",
    "Keep replies concise, warm, and practical. If you do not know restaurant-specific information, say so and suggest asking staff.",
    context ? `Extra context: ${context}` : "",
    conversation
      ? `Conversation so far:\n${conversation}`
      : `Customer: ${prompt}`,
  ]
    .filter(Boolean)
    .join("\n\n");
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

    const { prompt, context, messages } = (await request.json()) as {
      prompt?: string;
      context?: string;
      messages?: ChatMessage[];
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
            temperature: 0.7,
            maxOutputTokens: 500,
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
