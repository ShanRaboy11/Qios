import { NextRequest, NextResponse } from "next/server";

const GEMINI_MODEL = "gemini-1.5-flash";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GOOGLE_GEMINI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const { prompt, context } = (await request.json()) as {
      prompt?: string;
      context?: string;
    };

    if (!prompt) {
      return NextResponse.json(
        { error: "A prompt value is required." },
        { status: 400 }
      );
    }

    const combinedPrompt = [
      "You are Qios AI, assisting F&B kiosk ordering.",
      context ? `Context: ${context}` : "",
      `User: ${prompt}`
    ]
      .filter(Boolean)
      .join("\n\n");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: combinedPrompt }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorPayload = await response.text();
      return NextResponse.json(
        { error: "Gemini API request failed", details: errorPayload },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part?.text ?? "")
        .join("\n") ?? "";

    return NextResponse.json({
      model: GEMINI_MODEL,
      output: text,
      raw: data
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected AI route error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
