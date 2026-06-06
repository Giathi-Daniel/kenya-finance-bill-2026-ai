import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { verifyHumanCheck } from "../../lib/human-check";
import { GET } from "./route";

describe("GET /api/human-check", () => {
  const originalGroqApiKey = process.env.GROQ_API_KEY;

  beforeEach(() => {
    process.env.GROQ_API_KEY = "test-groq-key";
  });

  afterEach(() => {
    process.env.GROQ_API_KEY = originalGroqApiKey;
  });

  it("returns a signed arithmetic challenge", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      left: expect.any(Number),
      right: expect.any(Number),
      token: expect.any(String),
    });
    expect(verifyHumanCheck(body.token, body.left + body.right)).toBe(true);
  });

  it("does not return the same visible challenge twice in a row", async () => {
    const first = await (await GET()).json();
    const second = await (await GET()).json();

    expect(`${second.left}+${second.right}`).not.toBe(`${first.left}+${first.right}`);
  });

  it("returns 500 when signing is not configured", async () => {
    delete process.env.GROQ_API_KEY;

    const response = await GET();

    await expect(response.json()).resolves.toEqual({
      error: "Unable to create human check challenge.",
    });
    expect(response.status).toBe(500);
  });
});
