import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createHumanCheckChallenge, verifyHumanCheck } from "./human-check";

describe("human check", () => {
  const originalGroqApiKey = process.env.GROQ_API_KEY;

  beforeEach(() => {
    process.env.GROQ_API_KEY = "test-groq-key";
  });

  afterEach(() => {
    process.env.GROQ_API_KEY = originalGroqApiKey;
  });

  it("creates a signed challenge that verifies with the correct answer", () => {
    const challenge = createHumanCheckChallenge();

    expect(verifyHumanCheck(challenge.token, challenge.left + challenge.right)).toBe(true);
  });

  it("rejects incorrect answers", () => {
    const challenge = createHumanCheckChallenge();

    expect(verifyHumanCheck(challenge.token, challenge.left + challenge.right + 1)).toBe(false);
  });

  it("does not repeat the same visible arithmetic on consecutive challenges", () => {
    const first = createHumanCheckChallenge();
    const second = createHumanCheckChallenge();

    expect(`${second.left}+${second.right}`).not.toBe(`${first.left}+${first.right}`);
  });

  it("rejects tampered tokens", () => {
    const challenge = createHumanCheckChallenge();

    expect(
      verifyHumanCheck(`${challenge.token.slice(0, -1)}x`, challenge.left + challenge.right),
    ).toBe(false);
  });
});
