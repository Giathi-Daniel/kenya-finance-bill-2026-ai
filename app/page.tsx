"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import Link from "next/link";
import KenyaFlagImage from "./components/KenyaFlagImage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

const SAMPLE_QUESTIONS = [
  "Summarize the biggest tax changes",
  "How are gambling winnings affected?",
  "What changes apply to mitumba imports?",
  "Are electric vehicles exempt from VAT?",
  "Explain withholding tax on scrap metal",
  "When would the Act come into force?",
];

const MAX_USER_TEXT_WORDS = 200;

const FEATURE_CARDS = [
  {
    icon: "46",
    title: "46 Pages Analyzed",
    body: "The assistant is designed around the uploaded Finance Bill text, not generic tax commentary.",
    accent: "text-sky-300",
  },
  {
    icon: "60+",
    title: "Tax Changes Mapped",
    body: "Ask by sector, clause, tax type, date, exemption, or affected business activity.",
    accent: "text-emerald-300",
  },
  {
    icon: "6",
    title: "Acts Amended",
    body: "Trace how the bill changes existing tax laws and prepare sharper follow-up questions.",
    accent: "text-red-300",
  },
];

function SendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 2 11 13" />
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
    </svg>
  );
}

type HumanCheck = {
  left: number;
  right: number;
  token: string;
};

function normalizeUserInput(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countInputWords(value: string): number {
  const normalizedValue = normalizeUserInput(value);

  return normalizedValue.length === 0 ? 0 : normalizedValue.split(/\s+/).length;
}

// Header moved to ./components/Header

function Hero({ onFocusChat }: { onFocusChat: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#171d1b]">
      <div className="absolute inset-0 cyber-grid opacity-45" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

      <div className="container-app relative z-10 flex min-h-[690px] flex-col items-center justify-center py-16 text-center">
        <p className="font-tech text-xs uppercase tracking-[0.24em] text-sky-300 sm:text-sm">
          &gt; Finance Bill research analysis...
        </p>

        <h2 className="font-tech mt-8 max-w-6xl text-4xl font-black uppercase leading-[1.08] text-white sm:text-6xl lg:text-7xl">
          Kenya Finance Bill{" "}
          <span className="text-red-400">2026</span>
          <br />
          <span className="text-green-300">AI Briefing</span>{" "}
          <span className="text-sky-300">Desk</span>
        </h2>

        <p className="mt-7 max-w-3xl text-lg leading-8 text-white/80">
          Ask plain-English questions about tax changes, exemptions, dates,
          affected sectors, and clause wording from the bill.
        </p>

        <div className="mt-10 w-full max-w-4xl rounded-md border border-red-400/20 bg-red-950/20 px-5 py-8 shadow-[0_0_40px_rgba(14,165,233,0.08)]">
          <p className="font-tech text-base font-semibold text-red-300 sm:text-lg">
            Critical tax decisions need verified sources and professional advice.
          </p>
          <p className="mt-5 text-sm font-semibold text-white/75 sm:text-base">
            This tool is educational and should be checked against KRA,
            Parliament, or a certified tax professional.
          </p>
        </div>

        <div id="analysis" className="mt-16 grid w-full gap-6 md:grid-cols-3">
          {FEATURE_CARDS.map((card) => (
            <article
              key={card.title}
              className="group border border-gray-500 rounded-md bg-[#141a18]/95 p-8 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_70px_rgba(0,0,0,0.28)] transition hover:bg-[#17211f]"
            >
              <div className="font-tech text-4xl font-black text-white">
                {card.icon}
              </div>
              <h3 className="font-tech mt-7 text-xl font-bold text-white">
                {card.title}
              </h3>
              <p className="mt-5 text-sm leading-7 text-white">
                {card.body}
              </p>
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={onFocusChat}
          className="mt-12 rounded-md border border-sky-300/50 bg-sky-400/10 px-6 py-3 font-tech text-sm font-semibold text-sky-200 transition hover:bg-sky-400/20"
        >
          Start asking questions
        </button>
      </div>
    </section>
  );
}

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function renderInlineMarkdown(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

function isTableSeparator(line: string): boolean {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (
      line.includes("|") &&
      index + 1 < lines.length &&
      isTableSeparator(lines[index + 1])
    ) {
      const headers = parseTableRow(line);
      const rows: string[][] = [];
      index += 2;

      while (index < lines.length && lines[index].includes("|")) {
        rows.push(parseTableRow(lines[index]));
        index += 1;
      }

      blocks.push(
        <div key={blocks.length} className="my-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr>
                {headers.map((header, headerIndex) => (
                  <th
                    key={headerIndex}
                    className="border border-white/15 bg-white/10 px-3 py-2 font-semibold text-white"
                  >
                    {renderInlineMarkdown(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((_, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border border-white/10 px-3 py-2 align-top font-medium text-white"
                    >
                      {renderInlineMarkdown(row[cellIndex] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];

      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*[-*]\s+/, ""));
        index += 1;
      }

      blocks.push(
        <ul key={blocks.length} className="my-3 list-disc space-y-1 pl-5 text-white">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];

      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*\d+\.\s+/, ""));
        index += 1;
      }

      blocks.push(
        <ol key={blocks.length} className="my-3 list-decimal space-y-1 pl-5 text-white">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInlineMarkdown(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    const paragraphLines: string[] = [];

    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^\s*[-*]\s+/.test(lines[index]) &&
      !/^\s*\d+\.\s+/.test(lines[index]) &&
      !(
        lines[index].includes("|") &&
        index + 1 < lines.length &&
        isTableSeparator(lines[index + 1])
      )
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }

    blocks.push(
      <p key={blocks.length} className="my-3 text-white first:mt-0 last:mb-0">
        {renderInlineMarkdown(paragraphLines.join(" "))}
      </p>,
    );
  }

  return <>{blocks}</>;
}

function ChatMessage({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";

  return (
    <div className={`flex w-full min-w-0 gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border ${
          isUser
            ? "border-red-300/30 bg-red-500 text-white"
            : "border-sky-300/30 bg-white/5"
        }`}
      >
        {isUser ? (
          <span className="font-tech text-[10px]">YOU</span>
        ) : (
          <KenyaFlagImage className="h-full w-full object-cover" />
        )}
      </div>
      <div
        className={`flex min-w-0 flex-col gap-1 ${
          isUser ? "max-w-[84%] items-end" : "flex-1 items-start sm:max-w-[84%]"
        }`}
      >
        <div
          className={`max-w-full overflow-hidden rounded-md border px-4 py-3 text-sm font-medium leading-6 ${
            isUser
              ? "border-red-300/30 bg-red-500/18 text-white"
              : "border-white/10 bg-white/[0.06] text-white"
          }`}
        >
          <div>
            <MarkdownContent content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-md border border-dashed border-white/15 bg-black/15 p-6 text-center">
      <div className="h-14 w-20 overflow-hidden rounded-md border border-white/15">
        <KenyaFlagImage className="h-full w-full object-cover" />
      </div>
      <h3 className="font-tech mt-6 text-2xl font-bold text-white">
        Ask the bill, not the internet.
      </h3>
      <p className="mt-3 max-w-lg text-sm leading-7 text-white/60">
        Choose a prompt or type a question about a clause, date, exemption, tax
        category, or affected sector.
      </p>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-sky-300/30">
        <KenyaFlagImage className="h-full w-full object-cover" />
      </div>
      <div className="rounded-md border border-white/10 bg-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

function PromptGrid({ onAsk }: { onAsk: (question: string) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {SAMPLE_QUESTIONS.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onAsk(question)}
          className="min-h-12 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-xs font-semibold leading-5 text-white/70 transition hover:border-sky-300/50 hover:bg-sky-400/10 hover:text-sky-100"
        >
          {question}
        </button>
      ))}
    </div>
  );
}

function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  humanCheck,
  humanCheckError,
  humanCheckValue,
  onHumanCheckChange,
  onHumanCheckRetry,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  humanCheck: HumanCheck | null;
  humanCheckError: string | null;
  humanCheckValue: string;
  onHumanCheckChange: (value: string) => void;
  onHumanCheckRetry: () => void;
}) {
  const humanCheckAnswer = Number.parseInt(humanCheckValue.trim(), 10);
  const isHumanCheckFilled = Number.isInteger(humanCheckAnswer);
  const isHumanCheckCorrect =
    humanCheck !== null &&
    isHumanCheckFilled &&
    humanCheckAnswer === humanCheck.left + humanCheck.right;
  const wordCount = countInputWords(value);
  const isWithinWordLimit = wordCount <= MAX_USER_TEXT_WORDS;
  const canSubmit =
    !disabled &&
    humanCheck !== null &&
    normalizeUserInput(value).length > 0 &&
    isHumanCheckCorrect &&
    isWithinWordLimit;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-3 border-t border-white/10 bg-black/20 p-3 sm:gap-4 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask about VAT, PAYE, exemptions, deadlines, or definitions..."
          rows={1}
          className="min-h-11 max-h-32 w-full min-w-0 resize-none rounded-md border border-white/12 bg-[#101514] px-3 py-2.5 text-sm leading-6 text-white outline-none transition placeholder:text-white/45 focus:border-sky-300 focus:ring-4 focus:ring-sky-300/10 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-12 sm:basis-3/4 sm:px-4 sm:py-3"
          onInput={(event) => {
            const target = event.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
          }}
        />
        <div className="flex w-full items-end gap-2 sm:basis-1/4 sm:w-auto">
          <label className="min-w-0 flex-1">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
              {humanCheck ? `${humanCheck.left} + ${humanCheck.right}` : "Check"}
            </span>
            <input
              type="number"
              inputMode="numeric"
              value={humanCheckValue}
              onChange={(event) => onHumanCheckChange(event.target.value)}
              disabled={disabled || humanCheck === null}
              placeholder="Answer"
              className="h-11 w-full rounded-md border border-white/12 bg-[#101514] px-3 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-sky-300 focus:ring-4 focus:ring-sky-300/10 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12"
              aria-label={
                humanCheck
                  ? `Human check: ${humanCheck.left} plus ${humanCheck.right}`
                  : "Human check loading"
              }
            />
          </label>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-green-500 text-[#07100d] shadow-[0_0_24px_rgba(34,197,94,0.24)] transition hover:bg-green-300 disabled:cursor-not-allowed disabled:bg-white/12 disabled:text-white/30 sm:h-12 sm:w-12"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>
      <div
        className={`text-xs font-medium ${
          isWithinWordLimit ? "text-white/55" : "text-red-100"
        } sm:w-full`}
      >
        {wordCount}/{MAX_USER_TEXT_WORDS} words
        {!isWithinWordLimit ? " - shorten the pasted content." : ""}
      </div>
      {humanCheckError ? (
        <button
          type="button"
          onClick={onHumanCheckRetry}
          className="text-left text-xs font-semibold text-red-100 underline-offset-4 hover:underline sm:w-full"
        >
          {humanCheckError} Tap to retry.
        </button>
      ) : null}
    </div>
  );
}

function getDisplayErrorMessage(error: Error): string {
  try {
    const parsedError = JSON.parse(error.message) as { error?: unknown };

    if (typeof parsedError.error === "string") {
      return parsedError.error;
    }
  } catch {
    // Fall through to the raw message when it is not JSON.
  }

  return error.message;
}

function ChatConsole({
  messages,
  input,
  isLoading,
  error,
  humanCheck,
  humanCheckError,
  humanCheckValue,
  onAsk,
  onInputChange,
  onHumanCheckChange,
  onHumanCheckRetry,
  onSubmit,
}: {
  messages: UIMessage[];
  input: string;
  isLoading: boolean;
  error: Error | undefined;
  humanCheck: HumanCheck | null;
  humanCheckError: string | null;
  humanCheckValue: string;
  onAsk: (question: string) => void;
  onInputChange: (value: string) => void;
  onHumanCheckChange: (value: string) => void;
  onHumanCheckRetry: () => void;
  onSubmit: () => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const visibleMessages = messages
    .map((message) => ({
      id: message.id,
      role: message.role,
      content: getMessageText(message),
    }))
    .filter(
      (message): message is {
        id: string;
        role: "user" | "assistant";
        content: string;
      } =>
        (message.role === "user" || message.role === "assistant") &&
        message.content.trim().length > 0,
    );
  const showTypingIndicator =
    isLoading && visibleMessages[visibleMessages.length - 1]?.role !== "assistant";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages, isLoading, error]);

  return (
    <section
      id="chat"
      className="container-app scroll-mt-28 py-14 sm:py-18"
      aria-label="Finance Bill AI chat"
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-tech text-xs uppercase tracking-[0.24em] text-sky-300">
            &gt; Interactive analysis console
          </p>
          <h2 className="font-tech mt-3 text-3xl font-black uppercase text-white sm:text-4xl">
            Ask the Finance Bill AI
          </h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-white/10 bg-[#111716] shadow-[0_30px_90px_rgba(0,0,0,0.34)]">
        <div className="border-b border-white/10 bg-black/25 p-4">
          <PromptGrid onAsk={onAsk} />
        </div>

        <div className="min-h-[360px] p-4 sm:p-5">
          <div className="flex flex-col gap-4">
            {visibleMessages.length === 0 && !isLoading ? (
              <EmptyState />
            ) : (
              <>
                {visibleMessages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                  />
                ))}
                {showTypingIndicator && <TypingIndicator />}
              </>
            )}
            {error ? (
              <div className="rounded-md border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm leading-6 text-red-100">
                {getDisplayErrorMessage(error)}
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <ChatInput
          value={input}
          onChange={onInputChange}
          onSubmit={onSubmit}
          disabled={isLoading}
          humanCheck={humanCheck}
          humanCheckError={humanCheckError}
          humanCheckValue={humanCheckValue}
          onHumanCheckChange={onHumanCheckChange}
          onHumanCheckRetry={onHumanCheckRetry}
        />
      </div>
    </section>
  );
}

export default function Page() {
  const [input, setInput] = useState("");
  const [humanCheck, setHumanCheck] = useState<HumanCheck | null>(null);
  const [humanCheckError, setHumanCheckError] = useState<string | null>(null);
  const [humanCheckValue, setHumanCheckValue] = useState("");
  const { messages, sendMessage, status, error, clearError } = useChat();
  const isLoading = status === "submitted" || status === "streaming";

  const loadHumanCheck = useCallback(async () => {
    try {
      const response = await fetch("/api/human-check", {
        cache: "no-store",
      });

      if (!response.ok) {
        setHumanCheck(null);
        setHumanCheckError("Human check failed to load.");
        return;
      }

      const challenge = (await response.json()) as HumanCheck;
      setHumanCheck(challenge);
      setHumanCheckError(null);
      setHumanCheckValue("");
    } catch {
      setHumanCheck(null);
      setHumanCheckError("Human check failed to load.");
    }
  }, []);

  useEffect(() => {
    void loadHumanCheck();
  }, [loadHumanCheck]);

  const focusChat = () => {
    document.getElementById("chat")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = () => {
    const trimmed = normalizeUserInput(input);
    const humanCheckAnswer = Number.parseInt(humanCheckValue.trim(), 10);

    if (
      !trimmed ||
      isLoading ||
      humanCheck === null ||
      !Number.isInteger(humanCheckAnswer) ||
      countInputWords(trimmed) > MAX_USER_TEXT_WORDS
    ) {
      return;
    }

    if (humanCheckAnswer !== humanCheck.left + humanCheck.right) {
      setHumanCheckError("Human check answer is incorrect.");
      return;
    }

    setInput("");
    setHumanCheckValue("");
    clearError();
    void sendMessage(
      { text: trimmed },
      {
        body: {
          humanCheckAnswer,
          humanCheckToken: humanCheck.token,
        },
      },
    ).finally(() => {
      void loadHumanCheck();
    });
  };

  const handleHumanCheckChange = (value: string) => {
    setHumanCheckValue(value);

    if (humanCheckError === "Human check answer is incorrect.") {
      setHumanCheckError(null);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " "));
  };

  return (
    <div className="min-h-dvh bg-[#171d1b] text-white">
      <Header onFocusChat={focusChat} />
      <main id="main-content" role="main">
        <Hero onFocusChat={focusChat} />
        <ChatConsole
          messages={messages}
          input={input}
          isLoading={isLoading}
          error={error}
          humanCheck={humanCheck}
          humanCheckError={humanCheckError}
          humanCheckValue={humanCheckValue}
          onAsk={setInput}
          onInputChange={handleInputChange}
          onHumanCheckChange={handleHumanCheckChange}
          onHumanCheckRetry={() => void loadHumanCheck()}
          onSubmit={handleSubmit}
        />
      </main>
      <Footer />
    </div>
  );
}
