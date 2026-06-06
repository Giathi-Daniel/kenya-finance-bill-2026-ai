"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";

const SAMPLE_QUESTIONS = [
  "Summarize the biggest tax changes",
  "How are gambling winnings affected?",
  "What changes apply to mitumba imports?",
  "Are electric vehicles exempt from VAT?",
  "Explain withholding tax on scrap metal",
  "When would the Act come into force?",
];

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

function KenyaFlagImage({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/kenya-flag.png"
      width={200}
      height={134}
      alt="Kenya flag"
      priority={priority}
      className={className}
    />
  );
}

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

function Header({ onFocusChat }: { onFocusChat: () => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#121716]/95 backdrop-blur-xl">
      <div className="container-app flex h-16 items-center justify-between gap-2 sm:h-[70px] sm:gap-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="h-9 w-11 shrink-0 overflow-hidden rounded-md border border-white/15 bg-white/5 shadow-[0_0_22px_rgba(14,165,233,0.18)] sm:h-10 sm:w-12">
            <KenyaFlagImage priority className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="font-tech text-[10px] uppercase tracking-[0.24em] text-sky-300">
              Kenya
            </p>
            <h1 className="font-tech truncate text-xs font-semibold text-white sm:text-base">
              <span className="sm:hidden">Finance Bill AI</span>
              <span className="hidden sm:inline">Finance Bill Intelligence</span>
            </h1>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-xs font-semibold text-white/75 md:flex">
          {["Home", "Bill", "Process", "About", "FAQ"].map((item, index) => (
            <a
              key={item}
              href={index === 0 ? "#" : "#analysis"}
              className={`transition hover:text-sky-300 ${
                index === 0 ? "border-b border-red-400 pb-1 text-red-300" : ""
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={onFocusChat}
          className="h-10 shrink-0 rounded-md bg-red-500 px-3 font-tech text-[11px] font-semibold text-white shadow-[0_0_22px_rgba(239,68,68,0.25)] transition hover:bg-red-400 sm:h-11 sm:px-4 sm:text-xs"
        >
          <span className="sm:hidden">Ask</span>
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </div>
    </header>
  );
}

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
              className="group rounded-md bg-[#141a18]/95 p-8 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_70px_rgba(0,0,0,0.28)] transition hover:bg-[#17211f]"
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
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
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
        className={`flex max-w-[84%] flex-col gap-1 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-md border px-4 py-3 text-sm font-medium leading-6 ${
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
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t border-white/10 bg-black/20 p-3 sm:gap-3 sm:p-4">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Ask about VAT, PAYE, exemptions, deadlines, or definitions..."
        rows={1}
        className="min-h-11 max-h-32 min-w-0 flex-1 resize-none rounded-md border border-white/12 bg-[#101514] px-3 py-2.5 text-sm leading-6 text-white outline-none transition placeholder:text-white/45 focus:border-sky-300 focus:ring-4 focus:ring-sky-300/10 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-12 sm:px-4 sm:py-3"
        onInput={(event) => {
          const target = event.target as HTMLTextAreaElement;
          target.style.height = "auto";
          target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
        }}
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-green-500 text-[#07100d] shadow-[0_0_24px_rgba(34,197,94,0.24)] transition hover:bg-green-300 disabled:cursor-not-allowed disabled:bg-white/12 disabled:text-white/30 sm:h-12 sm:w-12"
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </div>
  );
}

function ChatConsole({
  messages,
  input,
  isLoading,
  error,
  onAsk,
  onInputChange,
  onSubmit,
}: {
  messages: UIMessage[];
  input: string;
  isLoading: boolean;
  error: Error | undefined;
  onAsk: (question: string) => void;
  onInputChange: (value: string) => void;
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
        <p className="max-w-md text-sm leading-6 text-white/55">
          Responses stream from Groq and must cite Finance Bill sections.
        </p>
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
                {error.message}
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
        />
      </div>
    </section>
  );
}

export default function Page() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, clearError } = useChat();
  const isLoading = status === "submitted" || status === "streaming";

  const focusChat = () => {
    document.getElementById("chat")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput("");
    clearError();
    void sendMessage({ text: trimmed });
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
          onAsk={setInput}
          onInputChange={setInput}
          onSubmit={handleSubmit}
        />
      </main>
      <footer className="border-t border-white/10 bg-[#121716] px-4 py-7">
        <div className="container-app flex flex-col gap-3 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>Kenya Finance Bill Intelligence</span>
          <a
            href="https://www.parliament.go.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sky-300 hover:text-sky-200"
          >
            Official Parliament website
          </a>
        </div>
      </footer>
    </div>
  );
}
