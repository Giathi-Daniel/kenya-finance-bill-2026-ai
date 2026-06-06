import { createGroq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText } from "ai";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createHumanCheckChallenge } from "../../lib/human-check";
import { POST } from "./route";

vi.mock("@ai-sdk/groq", () => ({
  createGroq: vi.fn(() => vi.fn((modelId: string) => ({ modelId }))),
}));

vi.mock("ai", () => ({
  convertToModelMessages: vi.fn(async (messages: unknown[]) => messages),
  streamText: vi.fn(() => ({
    toUIMessageStreamResponse: () =>
      new Response("mock-stream", {
        headers: {
          "content-type": "text/event-stream",
        },
      }),
  })),
}));

const createChatRequest = (body: unknown) =>
  new Request("http://localhost/api/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

const withHumanCheck = (body: Record<string, unknown>) => {
  const challenge = createHumanCheckChallenge();

  return {
    ...body,
    humanCheckAnswer: challenge.left + challenge.right,
    humanCheckToken: challenge.token,
  };
};

describe("POST /api/chat", () => {
  const originalGroqApiKey = process.env.GROQ_API_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GROQ_API_KEY = "test-groq-key";
  });

  afterEach(() => {
    process.env.GROQ_API_KEY = originalGroqApiKey;
  });

  it("returns 500 when GROQ_API_KEY is missing", async () => {
    delete process.env.GROQ_API_KEY;

    const response = await POST(createChatRequest({ messages: [] }));

    await expect(response.json()).resolves.toEqual({
      error: "GROQ_API_KEY is not configured.",
    });
    expect(response.status).toBe(500);
    expect(streamText).not.toHaveBeenCalled();
  });

  it("returns 400 when messages are missing", async () => {
    const response = await POST(createChatRequest(withHumanCheck({})));

    await expect(response.json()).resolves.toEqual({
      error: "A non-empty messages array is required.",
    });
    expect(response.status).toBe(400);
    expect(streamText).not.toHaveBeenCalled();
  });

  it("streams a Groq response for valid UI messages", async () => {
    const messages = [
      {
        id: "message-1",
        role: "user",
        parts: [{ type: "text", text: "Hello" }],
      },
    ];

    const response = await POST(createChatRequest(withHumanCheck({ messages })));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/event-stream");
    await expect(response.text()).resolves.toBe("mock-stream");
    expect(createGroq).toHaveBeenCalledWith({ apiKey: "test-groq-key" });
    expect(convertToModelMessages).toHaveBeenCalledWith(messages);
    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        maxOutputTokens: 800,
        model: { modelId: "llama-3.1-8b-instant" },
        temperature: 0,
        topP: 1,
      }),
    );
    const systemPrompt = vi.mocked(streamText).mock.calls[0][0].system;

    expect(typeof systemPrompt).toBe("string");
    if (typeof systemPrompt !== "string") {
      throw new Error("Expected system prompt to be a string.");
    }
    expect(systemPrompt).toContain("You are the Kenya Finance Bill 2026 Assistant.");
    expect(systemPrompt).toContain(
      "Use ONLY information contained in the provided Finance Bill text.",
    );
    expect(systemPrompt).toContain("Provided Finance Bill text:");
    expect(systemPrompt.length).toBeLessThan(7000);
  });

  it("limits chat history before sending messages to the model", async () => {
    const messages = Array.from({ length: 8 }, (_, index) => ({
      id: `message-${index}`,
      role: index % 2 === 0 ? "user" : "assistant",
      parts: [
        {
          type: "text",
          text: `${index} ${"long message ".repeat(160)}`,
        },
      ],
    }));

    await POST(createChatRequest(withHumanCheck({ messages })));

    const convertedMessages = vi.mocked(convertToModelMessages).mock.calls[0][0] as typeof messages;

    expect(convertedMessages).toHaveLength(4);
    expect(convertedMessages[0].id).toBe("message-4");
    expect(convertedMessages.at(-1)?.parts[0].text.length).toBeLessThanOrEqual(800);
  });

  it("handles simultaneous chat requests without shared mutable state", async () => {
    const createMessages = (text: string) => [
      {
        id: crypto.randomUUID(),
        role: "user",
        parts: [{ type: "text", text }],
      },
    ];

    const responses = await Promise.all([
      POST(
        createChatRequest(
          withHumanCheck({ messages: createMessages("VAT exemptions") }),
        ),
      ),
      POST(
        createChatRequest(
          withHumanCheck({ messages: createMessages("PAYE deductions") }),
        ),
      ),
    ]);

    expect(responses.map((response) => response.status)).toEqual([200, 200]);
    expect(streamText).toHaveBeenCalledTimes(2);
  });

  it("returns 400 when the human check is missing", async () => {
    const response = await POST(
      createChatRequest({
        messages: [
          {
            id: "message-1",
            role: "user",
            parts: [{ type: "text", text: "Hello" }],
          },
        ],
      }),
    );

    await expect(response.json()).resolves.toEqual({
      error: "Human check answer is required and must be correct.",
    });
    expect(response.status).toBe(400);
    expect(streamText).not.toHaveBeenCalled();
  });

  it("returns 400 when the human check answer is incorrect", async () => {
    const challenge = createHumanCheckChallenge();
    const response = await POST(
      createChatRequest({
        humanCheckAnswer: challenge.left + challenge.right + 1,
        humanCheckToken: challenge.token,
        messages: [
          {
            id: "message-1",
            role: "user",
            parts: [{ type: "text", text: "Hello" }],
          },
        ],
      }),
    );

    await expect(response.json()).resolves.toEqual({
      error: "Human check answer is required and must be correct.",
    });
    expect(response.status).toBe(400);
    expect(streamText).not.toHaveBeenCalled();
  });
});
