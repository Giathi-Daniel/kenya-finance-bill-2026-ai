# 🇰🇪 Kenya Finance Bill 2026 AI Assistant

[Preview](preview.png)

A free, fast, and open-source AI chatbot designed to explain the **Kenya Finance Bill, 2026** in plain English. Built with Next.js, Vercel, and Groq (Llama 3.2), this tool helps citizens, business owners, and students understand complex tax amendments without needing a law degree.

> **What it does:** You ask a question (e.g., *"How does the bill affect gambling winnings?"*), and the AI scans the official 46-page bill to give you a simple answer with specific Section citations.

## Features

- **Plain English Explanations:** Translates legalese into simple terms.
- **Section Citations:** Every answer references the specific Section (e.g., *Section 12H*, *Section 23(y)*) for verification.
- **Zero Cost:** Uses a free-tier API (Groq) and free hosting (Vercel).
- **Fast & Serverless:** Built on Next.js App Router with streaming responses.
- **Mobile Friendly:** Responsive design works perfectly on phones.

## Quick Start

### Prerequisites
- Node.js (v18+)
- A free [Groq Cloud](https://console.groq.com) API key

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/kenya-finance-bill-2026-ai.git
cd kenya-finance-bill-2026-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a file named `.env.local` in the root directory:

```env
GROQ_API_KEY=gsk_**************************
```
*Get your free key at [console.groq.com](https://console.groq.com)*

### 4. Run Locally
```bash
npm run dev
```
Open `http://localhost:3000` to see the bot in action.

## How It Works

This app uses a **Retrieval-Augmented Generation (RAG)** approach, but simplified for speed:
1. **Context Injection:** The full text of the Finance Bill, 2026 is embedded directly into the client code (`page.tsx`).
2. **Prompt Engineering:** When you ask a question, the system constructs a prompt that includes your question + the full bill text.
3. **LLM Processing:** The prompt is sent to **Groq** (running Llama 3.2), which analyzes the text and generates a simplified answer.
4. **Streaming:** The answer is streamed back to the user in real-time.

## ⚠️ Disclaimer

**This tool is for educational and informational purposes only.**
- The AI may make mistakes. Always verify critical tax information with the Kenya Revenue Authority (KRA) or a certified tax consultant.
- This bot is not an official government tool and is not affiliated with the National Treasury or KRA.
- The Finance Bill is subject to parliamentary approval; ensure you are using the final passed Act.

## 🤝 Contributing

Found a bug or want to add features (e.g., Swahili support, PDF export)?
1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## License

MIT License - Feel free to use this for personal or commercial projects.

---

**Built with ❤️ for Kenya's Digital Economy**
