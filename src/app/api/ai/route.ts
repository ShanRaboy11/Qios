import { NextRequest, NextResponse } from "next/server";
import { fetchTenantCustomerMenu } from "@/lib/customerMenu";

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

type CartAction = {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
};

type TenantMenuItem = {
  id: string;
  name: string;
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

function buildTenantMenuContext({
  categories,
  items,
  currency,
}: {
  categories: { name: string }[];
  items: {
    name: string;
    price: number;
    available: boolean;
    category: string;
  }[];
  currency: string;
}) {
  const categoryList = categories
    .map((category) => category.name)
    .filter(Boolean);
  const itemLines = items.map((item) => {
    const availability = item.available ? "available" : "sold out";
    return `- ${item.name} (${item.category}) - ${currency} ${item.price.toFixed(2)} - ${availability}`;
  });

  return [
    categoryList.length > 0
      ? `Categories: ${categoryList.join(", ")}`
      : "Categories: none",
    itemLines.length > 0
      ? `Menu items:\n${itemLines.join("\n")}`
      : "Menu items: none",
    `Currency: ${currency}`,
  ].join("\n");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizePrompt(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function isAddToCartIntent(prompt: string) {
  const normalized = normalizePrompt(prompt);
  return (
    /\b(add|put|include|order|get me|throw in|buy)\b/.test(normalized) &&
    /\b(cart|bag|basket|shopping bag)\b/.test(normalized)
  );
}

function extractCartActions(prompt: string, items: TenantMenuItem[]) {
  const masked = normalizePrompt(prompt).split("");
  const orderedItems = [...items].sort((a, b) => b.name.length - a.name.length);
  const actions: CartAction[] = [];
  const quantityMap: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
  };

  for (const item of orderedItems) {
    const itemName = item.name.trim().toLowerCase();
    if (!itemName) continue;

    const escapedItem = escapeRegExp(itemName).replace(/\s+/g, "\\s+");
    const regex = new RegExp(
      `(^|[^a-z0-9])(?:(?<quantity>\\d+|one|two|three|four|five|six|seven|eight|nine|ten)\\s+)?${escapedItem}\\b`,
    );

    const currentText = masked.join("");
    const match = currentText.match(regex);
    if (!match || match.index == null) continue;

    const quantityValue = match.groups?.quantity?.toLowerCase() ?? "1";
    const parsedQuantity = Number.parseInt(quantityValue, 10);
    const quantity = Number.isFinite(parsedQuantity)
      ? parsedQuantity
      : (quantityMap[quantityValue] ?? 1);

    const start = match.index + match[1].length;
    const matchedLength = match[0].length - match[1].length;
    for (let index = start; index < start + matchedLength; index += 1) {
      masked[index] = " ";
    }

    actions.push({
      menuItemId: item.id,
      menuItemName: item.name,
      quantity: Math.max(1, quantity),
    });
  }

  return actions;
}

function formatCartConfirmation(actions: CartAction[]) {
  const labels = actions.map((action) =>
    action.quantity > 1
      ? `${action.quantity} ${action.menuItemName}`
      : action.menuItemName,
  );

  if (labels.length === 0) {
    return "I couldn't find any matching menu items to add to your cart.";
  }

  if (labels.length === 1) {
    return `Added ${labels[0]} to your cart.`;
  }

  const lastLabel = labels.pop();
  return `Added ${labels.join(", ")} and ${lastLabel} to your cart.`;
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

    const { prompt, context, messages, storeName, tenantId } =
      (await request.json()) as {
        prompt?: string;
        context?: string;
        messages?: ChatMessage[];
        storeName?: string;
        tenantId?: string;
      };

    const latestPrompt = prompt?.trim() || messages?.at(-1)?.message.trim();

    if (!latestPrompt) {
      return NextResponse.json(
        { error: "A prompt value or at least one message is required." },
        { status: 400 },
      );
    }

    let resolvedContext = context;
    let resolvedStoreName = storeName;
    let menuItemsForMatching: TenantMenuItem[] = [];

    if (tenantId) {
      const tenantMenu = await fetchTenantCustomerMenu(tenantId);
      menuItemsForMatching = tenantMenu.items.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      resolvedContext = buildTenantMenuContext({
        categories: tenantMenu.categories,
        items: tenantMenu.items,
        currency: tenantMenu.currency,
      });
      resolvedStoreName = tenantMenu.storeName || resolvedStoreName;
    }

    const cartActions =
      tenantId && isAddToCartIntent(latestPrompt)
        ? extractCartActions(latestPrompt, menuItemsForMatching)
        : [];

    if (cartActions.length > 0) {
      return NextResponse.json({
        model: GEMINI_MODEL,
        output: formatCartConfirmation(cartActions),
        cartActions,
        raw: null,
      });
    }

    const combinedPrompt = buildConversationPrompt({
      prompt: latestPrompt,
      context: resolvedContext,
      messages,
      storeName: resolvedStoreName,
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
      cartActions,
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
