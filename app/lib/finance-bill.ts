import { readFile } from "node:fs/promises";
import path from "node:path";

const BILL_TEXT_PATH = path.join(process.cwd(), "bill-content.txt");

export class FinanceBillContentError extends Error {
  constructor() {
    super("Finance Bill text is not configured.");
    this.name = "FinanceBillContentError";
  }
}

export async function readFinanceBillText(): Promise<string> {
  try {
    const billText = await readFile(BILL_TEXT_PATH, "utf8");
    const trimmedBillText = billText.trim();

    if (!trimmedBillText) {
      throw new FinanceBillContentError();
    }

    return trimmedBillText;
  } catch (error) {
    if (error instanceof FinanceBillContentError) {
      throw error;
    }

    throw new FinanceBillContentError();
  }
}

export function createFinanceBillSystemPrompt(billText: string): string {
  return `You are a Kenya Finance Bill assistant.

You must follow these rules:
1. Use ONLY the Finance Bill text provided below.
2. Never use external knowledge.
3. Always cite supporting sections.
4. If the answer is uncertain, unsupported, or not present in the bill text, answer exactly: "Not in the Bill."
5. Simplify legal language into plain English.
6. Never invent taxes, rates, penalties, deadlines, interpretations, or legal opinions.
7. Be concise, factual, and avoid speculation.

Preferred answer structure when the bill supports the answer:

Summary

Simple explanation

Sources:
- Section X
- Section Y

If no supporting section exists, answer exactly:
Not in the Bill.

Finance Bill text:
"""
${billText}
"""`;
}
