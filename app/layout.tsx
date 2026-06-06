import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kenya Finance Bill 2026 — AI Assistant",
    template: "%s | Kenya Finance Bill 2026",
  },
  description:
    "Understand the Kenya Finance Bill 2026 in plain English. Ask questions and get instant, accurate answers with specific section citations.",
  keywords: [
    "Kenya Finance Bill 2026",
    "Kenya taxes",
    "KRA",
    "income tax Kenya",
    "VAT Kenya",
    "excise duty Kenya",
    "Finance Act 2026",
    "Kenya tax law",
  ],
  authors: [{ name: "Kenya Finance Bill AI Assistant" }],
  creator: "Kenya Finance Bill AI Assistant",
  openGraph: {
    type: "website",
    locale: "en_KE",
    title: "Kenya Finance Bill 2026 — AI Assistant",
    description:
      "Ask any question about the Kenya Finance Bill 2026 and get simple, accurate answers with section citations.",
    siteName: "Kenya Finance Bill 2026 AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenya Finance Bill 2026 — AI Assistant",
    description:
      "Understand the Kenya Finance Bill 2026 in plain English. Instant answers with section citations.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#006600",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased" suppressHydrationWarning>
        {/* Accessibility skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 btn-primary btn-md"
        >
          Skip to main content
        </a>

        {/* App root */}
        <div className="relative flex flex-col min-h-dvh">
          {children}
        </div>
      </body>
    </html>
  );
}
