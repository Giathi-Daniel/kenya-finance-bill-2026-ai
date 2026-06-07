import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ProcessPage() {
  return (
    <main className="min-h-dvh bg-[#171d1b] text-white">
      <Header />

      <section className="container-app py-14 sm:py-20">
        <div className="max-w-4xl space-y-6">
          <div className="space-y-3 text-center">
            <p className="font-tech text-xs uppercase tracking-[0.24em] text-sky-300">
              &gt; How the assistant works
            </p>
            <h1 className="font-tech text-4xl font-black uppercase text-white sm:text-5xl">
              Process
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
              This tool turns the Finance Bill text into an interactive research assistant. Ask about clauses, taxes, dates, exemptions, affected sectors, and the bill&apos;s impact.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-white">1. Read the bill</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                The assistant is built around the uploaded Finance Bill content, so answers are based on the bill wording and amendments rather than generic tax commentary.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-white">2. Ask in plain English</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Type a question about VAT, PAYE, excise, exemptions, import duties, or when a clause would take effect.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-white">3. Get cited answers</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                The assistant returns streamed replies that reference bill sections, so you can verify the source and consider follow-up questions.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-white">4. Human check</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                A simple arithmetic check helps prevent automated abuse and keeps the assistant available for genuine questions.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-white/60">
              The source is the Finance Bill; this is an educational assistant and not a substitute for professional tax advice.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
