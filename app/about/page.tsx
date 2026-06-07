import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-[#171d1b] text-white">
      <Header />

      <section className="container-app py-14 sm:py-20">
        <div className="max-w-4xl space-y-6">
          <div className="space-y-3 text-center">
            <p className="font-tech text-xs uppercase tracking-[0.24em] text-sky-300">
              &gt; About this assistant
            </p>
            <h1 className="font-tech text-4xl font-black uppercase text-white sm:text-5xl">
              About
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
              Kenya Finance Bill AI helps you explore the 2026 Finance Bill with conversational questions and bill-backed responses.
            </p>
          </div>

          <div className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Purpose</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                The tool is designed to make Finance Bill content easier to understand. It is useful for researchers, tax practitioners, students, and business owners who want a faster way to review proposed changes.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">Scope</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Answers are based on the bill text and related amendments. The assistant focuses on taxes, duties, exemptions, implementation dates, and affected sectors.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">Disclaimer</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                This service is educational only and should not be relied on as legal, tax, or financial advice. Always verify with KRA, Parliament, or a certified tax professional.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-white/60">
              Built to make the Kenya Finance Bill 2026 easier to navigate and understand.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
