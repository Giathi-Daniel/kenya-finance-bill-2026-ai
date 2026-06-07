import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function FAQPage() {
  return (
    <main className="min-h-dvh bg-[#171d1b] text-white">
      <Header />

      <section className="container-app py-14 sm:py-20">
        <div className="max-w-4xl space-y-6">
          <div className="space-y-3 text-center">
            <p className="font-tech text-xs uppercase tracking-[0.24em] text-sky-300">
              &gt; Frequently asked questions
            </p>
            <h1 className="font-tech text-4xl font-black uppercase text-white sm:text-5xl">
              FAQ
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
              Answers to the most common questions about how the Finance Bill AI assistant works.
            </p>
          </div>

          <div className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Is this legal or tax advice?</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                No. This assistant is for educational research only. Always verify with official KRA or parliamentary sources and consult a professional for advice.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">What questions can I ask?</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Ask about clauses, tax categories, exemptions, implementation dates, affected sectors, and the bill&apos;s impact on imports, PAYE, VAT, excise, and more.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">How accurate are the answers?</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Answers are generated from the Finance Bill text. They should be treated as a starting point and checked against the bill or a licensed advisor.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">Why is there a human check?</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                The arithmetic check helps prevent automated abuse and keeps the assistant available for real users.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-white/60">
              Still have a question? Return home and ask in the chat console.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
