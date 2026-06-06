"use client";

import Image from "next/image";
import { useState } from "react";

type MessageRole = "user" | "assistant";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

const SAMPLE_QUESTIONS = [
  "Summarize the biggest tax changes",
  "How are gambling winnings affected?",
  "What changes apply to secondhand clothing imports?",
  "Are electric vehicles exempt from VAT?",
  "Explain withholding tax on scrap metal",
  "When would the Act come into force?",
];

const BILL_METRICS = [
  { label: "Bill pages", value: "46" },
  { label: "Tax changes", value: "60+" },
  { label: "Acts amended", value: "6" },
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

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/92 backdrop-blur-xl">
      <div className="h-1 flag-line" />
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100 shadow-sm">
            <KenyaFlagImage
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-800">
              Kenya Finance Bill
            </p>
            <h1 className="truncate text-base font-semibold text-stone-950">
              2026 AI Briefing Desk
            </h1>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 sm:inline-flex">
            Bill text loaded
          </span>
          <a
            href="https://www.parliament.go.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
          >
            Parliament
          </a>
        </nav>
      </div>
    </header>
  );
}

function BillBrief() {
  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-950 shadow-xl shadow-stone-200/80">
          <KenyaFlagImage
            priority
            className="h-36 w-full object-cover sm:h-44"
          />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
          Subject to parliamentary approval
        </div>
        <div className="space-y-3">
          <h2 className="max-w-2xl text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
            Ask sharper questions about the Finance Bill.
          </h2>
          <p className="max-w-xl text-base leading-7 text-stone-600">
            A focused workspace for reading Kenya's Finance Bill 2026 in plain
            English, with answers constrained to the bill context once the AI
            backend is connected.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
        {BILL_METRICS.map((metric) => (
          <div
            key={metric.label}
            className="border-r border-stone-200 px-4 py-4 last:border-r-0"
          >
            <p className="text-2xl font-semibold text-stone-950">
              {metric.value}
            </p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">
              {metric.label}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-stone-200 bg-[#fbfaf7] p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          What this is good for
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "Find tax clauses faster",
            "Translate legal wording",
            "Compare affected sectors",
            "Prepare follow-up questions",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-stone-700">
              <span className="h-2 w-2 rounded-full bg-emerald-700" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SampleQuestions({ onAsk }: { onAsk: (q: string) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          Suggested prompts
        </p>
        <span className="text-xs text-stone-400">Tap to fill</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {SAMPLE_QUESTIONS.map((question) => (
          <button
            key={question}
            onClick={() => onAsk(question)}
            className="min-h-12 rounded-lg border border-stone-200 bg-white px-3 py-2 text-left text-sm font-medium leading-snug text-stone-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
          isUser ? "bg-stone-950 text-white" : "bg-emerald-800 text-white"
        }`}
      >
        {isUser ? (
          "You"
        ) : (
          <KenyaFlagImage className="h-full w-full rounded-lg object-cover" />
        )}
      </div>
      <div
        className={`flex max-w-[82%] flex-col gap-1 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-xl px-4 py-3 text-sm leading-6 shadow-sm ${
            isUser
              ? "bg-stone-950 text-white"
              : "border border-stone-200 bg-white text-stone-800"
          }`}
        >
          {message.content}
        </div>
        <span className="px-1 text-[11px] text-stone-400">
          {message.timestamp.toLocaleTimeString("en-KE", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[310px] flex-col justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50/80 p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
        <KenyaFlagImage className="h-full w-full rounded-lg object-cover" />
      </div>
      <h3 className="text-xl font-semibold text-stone-950">
        Start with a concrete question.
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">
        Ask about a tax measure, affected sector, date, exemption, or wording in
        the bill. Suggested prompts are below the chat.
      </p>
      <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
        Educational tool only. Verify critical tax decisions with KRA, Parliament,
        or a certified tax professional.
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-800">
        <KenyaFlagImage className="h-full w-full rounded-lg object-cover" />
      </div>
      <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
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
    <div className="border-t border-stone-200 bg-white p-4">
      <div className="flex items-end gap-3">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask about VAT, PAYE, exemptions, deadlines, or definitions..."
          rows={1}
          className="min-h-12 max-h-32 flex-1 resize-none rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm leading-6 text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
          onInput={(event) => {
            const target = event.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
          }}
        />
        <button
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-stone-300"
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-stone-400">
        Enter sends. Shift+Enter adds a new line.
      </p>
    </div>
  );
}

function ChatWorkspace({
  messages,
  input,
  isLoading,
  onAsk,
  onInputChange,
  onSubmit,
}: {
  messages: Message[];
  input: string;
  isLoading: boolean;
  onAsk: (question: string) => void;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl shadow-stone-200/70">
      <div className="flex items-center justify-between gap-4 border-b border-stone-200 bg-stone-950 px-4 py-3 text-white">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
            Assistant
          </p>
          <h2 className="text-base font-semibold text-white">Bill Q&A</h2>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-stone-200">
          Preview mode
        </span>
      </div>

      <div className="flex min-h-[640px] flex-col">
        <div className="flex-1 overflow-y-auto bg-[#f7f4ed] p-4 sm:p-5">
          <div className="flex flex-col gap-4">
            {messages.length === 0 && !isLoading ? (
              <EmptyState />
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && <TypingIndicator />}
              </>
            )}
          </div>
        </div>

        <div className="border-t border-stone-200 bg-[#fbfaf7] p-4">
          <SampleQuestions onAsk={onAsk} />
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

function DisclaimerBanner() {
  return (
    <div className="bg-stone-950 px-4 py-2 text-center">
      <p className="text-[11px] leading-5 text-stone-300">
        Educational tool only. Not affiliated with National Treasury, Parliament,
        or KRA.
      </p>
    </div>
  );
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((previous) => [...previous, userMsg]);
    setInput("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        'AI integration is not connected yet. The next milestone should wire this chat to the bill context and model endpoint. Your question was: "' +
        trimmed +
        '"',
      timestamp: new Date(),
    };

    setMessages((previous) => [...previous, assistantMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[#f7f4ed]">
      <DisclaimerBanner />
      <Header />

      <main id="main-content" className="flex-1" role="main">
        <div className="container-app grid gap-8 py-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start lg:py-12">
          <BillBrief />
          <ChatWorkspace
            messages={messages}
            input={input}
            isLoading={isLoading}
            onAsk={setInput}
            onInputChange={setInput}
            onSubmit={handleSubmit}
          />
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white px-4 py-5">
        <div className="container-app flex flex-col gap-2 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Kenya Finance Bill 2026 AI Briefing Desk</span>
          <a
            href="https://www.parliament.go.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-emerald-800 hover:text-emerald-700"
          >
            Official Parliament website
          </a>
        </div>
      </footer>
    </div>
  );
}
