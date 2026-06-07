type ServerEnv = {
  groqApiKey: string;
  humanCheckSecret: string;
};

function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

export function getServerEnv(): ServerEnv {
  const groqApiKey = readRequiredEnv("GROQ_API_KEY");

  return {
    groqApiKey,
    humanCheckSecret: process.env.HUMAN_CHECK_SECRET?.trim() || groqApiKey,
  };
}
