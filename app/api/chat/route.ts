import { createGroq } from "@ai-sdk/groq";
import { type ModelMessage, streamText } from "ai";
import {
  createFinanceBillSystemPrompt,
  FinanceBillContentError,
  readFinanceBillText,
} from "@/app/lib/finance-bill";

export const runtime = "nodejs";

const GROQ_MODEL = "llama-3.2-3b-preview";

type ChatMessageInput = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequestBody = {
  messages?: ChatMessageInput[];
};

function isChatMessageInput(value: unknown): value is ChatMessageInput {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string" &&
    candidate.content.trim().length > 0
  );
}

async function parseChatRequest(request: Request): Promise<ModelMessage[]> {
  const body = (await request.json().catch(() => null)) as ChatRequestBody | null;
  const messages = body?.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("A non-empty messages array is required.");
  }

  if (!messages.every(isChatMessageInput)) {
    throw new Error("Messages must include role and content.");
  }

  return messages.map((message) => ({
    role: message.role,
    content: message.content.trim(),
  }));
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "GROQ_API_KEY is not configured." },
      { status: 500 },
    );
  }

  try {
    const [billText, messages] = await Promise.all([
      readFinanceBillText(),
      parseChatRequest(request),
    ]);
    const groq = createGroq({ apiKey });

    const result = streamText({
      model: groq(GROQ_MODEL),
      system: createFinanceBillSystemPrompt(billText),
      messages,
      temperature: 0,
      maxOutputTokens: 700,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    if (error instanceof FinanceBillContentError) {
      return Response.json(
        { error: "Finance Bill text is not configured on the server." },
        { status: 500 },
      );
    }

    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ error: "Unable to process chat request." }, { status: 500 });
  }
}
