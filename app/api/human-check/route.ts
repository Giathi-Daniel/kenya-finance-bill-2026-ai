import { createHumanCheckChallenge } from "../../lib/human-check";

export const runtime = "nodejs";

export async function GET() {
  try {
    return Response.json(createHumanCheckChallenge());
  } catch (error) {
    console.error("Human check challenge failed", error);
    return Response.json(
      { error: "Unable to create human check challenge." },
      { status: 500 },
    );
  }
}
