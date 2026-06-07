import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { getServerEnv } from "./env";

const HUMAN_CHECK_TTL_MS = 5 * 60 * 1000;
let lastExpression = "";

export type HumanCheckChallenge = {
  left: number;
  right: number;
  token: string;
};

type HumanCheckPayload = {
  answer: number;
  expiresAt: number;
  left: number;
  nonce: string;
  right: number;
};

function getSigningSecret(): string {
  return getServerEnv().humanCheckSecret;
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(encodedPayload: string): string {
  return createHmac("sha256", getSigningSecret())
    .update(encodedPayload)
    .digest("base64url");
}

function signaturesMatch(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export function createHumanCheckChallenge(): HumanCheckChallenge {
  let left = randomInt(2, 10);
  let right = randomInt(2, 10);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const expression = `${left}+${right}`;

    if (expression !== lastExpression) {
      break;
    }

    left = randomInt(2, 10);
    right = randomInt(2, 10);
  }

  lastExpression = `${left}+${right}`;

  const payload: HumanCheckPayload = {
    answer: left + right,
    expiresAt: Date.now() + HUMAN_CHECK_TTL_MS,
    left,
    nonce: randomInt(100000, 999999).toString(),
    right,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);

  return {
    left,
    right,
    token: `${encodedPayload}.${signature}`,
  };
}

export function verifyHumanCheck(token: unknown, answer: unknown): boolean {
  if (typeof token !== "string" || token.length === 0) {
    return false;
  }

  const numericAnswer =
    typeof answer === "number" ? answer : Number.parseInt(String(answer), 10);

  if (!Number.isInteger(numericAnswer)) {
    return false;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return false;
  }

  const expectedSignature = signPayload(encodedPayload);

  if (!signaturesMatch(signature, expectedSignature)) {
    return false;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as HumanCheckPayload;

    return payload.expiresAt >= Date.now() && payload.answer === numericAnswer;
  } catch {
    return false;
  }
}
