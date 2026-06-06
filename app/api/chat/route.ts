import { createGroq } from "@ai-sdk/groq";
import { convertToModelMessages, type UIMessage, streamText } from "ai";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const GROQ_MODEL = "llama-3.1-8b-instant";
const BILL_CONTENT_PATH = path.join(process.cwd(), "data", "bill-content.txt");
const MAX_BILL_CONTEXT_CHARS = 4000;
const MAX_CHUNKS = 6;
const MAX_HISTORY_MESSAGES = 4;
const MAX_MESSAGE_TEXT_CHARS = 800;
const STOP_WORDS = new Set([
  "about",
  "after",
  "again",
  "also",
  "and",
  "are",
  "bill",
  "can",
  "does",
  "for",
  "from",
  "have",
  "how",
  "into",
  "kenya",
  "the",
  "this",
  "what",
  "when",
  "where",
  "which",
  "with",
  "would",
]);

type ChatRequestBody = {
  messages?: UIMessage[];
};

class ChatRequestError extends Error {}

async function parseChatRequest(request: Request): Promise<UIMessage[]> {
  const body = (await request.json().catch(() => null)) as ChatRequestBody | null;
  const messages = body?.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new ChatRequestError("A non-empty messages array is required.");
  }

  return messages;
}

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ");
}

function getLatestUserQuestion(messages: UIMessage[]): string {
  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");

  return latestUserMessage ? getMessageText(latestUserMessage) : "";
}

function trimText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength).trim();
}

function limitMessageHistory(messages: UIMessage[]): UIMessage[] {
  return messages.slice(-MAX_HISTORY_MESSAGES).map((message) => ({
    ...message,
    parts: message.parts.map((part) => {
      if (part.type !== "text") {
        return part;
      }

      return {
        ...part,
        text: trimText(part.text, MAX_MESSAGE_TEXT_CHARS),
      };
    }),
  }));
}

async function loadFinanceBillContent(): Promise<string> {
  const billContent = await readFile(BILL_CONTENT_PATH, "utf8");
  const trimmedBillContent = billContent.trim();

  if (!trimmedBillContent) {
    throw new Error("Finance Bill content is empty.");
  }

  return trimmedBillContent;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .match(/[a-z0-9]+/g)
    ?.filter((term) => term.length > 2 && !STOP_WORDS.has(term)) ?? [];
}

function splitBillIntoChunks(billContent: string): string[] {
  return billContent
    .split(/(?=\n\d+\.\s)/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

function selectRelevantBillContext(billContent: string, question: string): string {
  const queryTerms = new Set(tokenize(question));
  const chunks = splitBillIntoChunks(billContent);

  const scoredChunks = chunks
    .map((chunk, index) => {
      const chunkText = chunk.toLowerCase();
      const score = [...queryTerms].reduce(
        (total, term) => total + (chunkText.includes(term) ? 1 : 0),
        0,
      );

      return { chunk, index, score };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const selectedChunks = scoredChunks
    .filter((item) => item.score > 0)
    .slice(0, MAX_CHUNKS)
    .map((item) => item.chunk);

  const fallbackChunks = chunks.slice(0, Math.min(MAX_CHUNKS, chunks.length));
  const candidateChunks = selectedChunks.length > 0 ? selectedChunks : fallbackChunks;
  const contextChunks: string[] = [];
  let contextLength = 0;

  for (const chunk of candidateChunks) {
    const nextLength = contextLength + chunk.length + 2;

    if (nextLength > MAX_BILL_CONTEXT_CHARS && contextChunks.length > 0) {
      break;
    }

    contextChunks.push(chunk);
    contextLength = nextLength;
  }

  return contextChunks.join("\n\n---\n\n").slice(0, MAX_BILL_CONTEXT_CHARS);
}

function createSystemPrompt(billContext: string): string {
  return `You are a Kenya Finance Bill assistant.

Use ONLY the Finance Bill excerpts provided below.
Never use external knowledge.
Never invent taxes, rates, penalties, deadlines, or interpretations.
If the answer is not supported by the Finance Bill excerpts, answer exactly: "Not in the Bill."
Explain legal language in simple English.
Be concise and factual.

Formatting rules:
- Use Markdown.
- Use Markdown tables when comparing items, rates, dates, categories, or impacts.
- Use clear bullet lists for lists.
- Use bold text for important labels only.
- Every supported answer must end with:

Sources:
- Section X
- Section Y

If there is no supporting section, answer exactly:
Not in the Bill.

Finance Bill excerpts:
"""
${billContext}
"""`;
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
    const [messages, billContent] = await Promise.all([
      parseChatRequest(request),
      loadFinanceBillContent(),
    ]);
    const limitedMessages = limitMessageHistory(messages);
    const billContext = selectRelevantBillContext(
      billContent,
      getLatestUserQuestion(limitedMessages),
    );
    const groq = createGroq({ apiKey });

    const result = streamText({
      model: groq(GROQ_MODEL),
      system: createSystemPrompt(billContext),
      messages: await convertToModelMessages(limitedMessages),
      temperature: 0,
      topP: 1,
      maxOutputTokens: 800,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    if (error instanceof ChatRequestError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    console.error("Chat request failed", error);
    return Response.json({ error: "Unable to process chat request." }, { status: 500 });
  }
}
