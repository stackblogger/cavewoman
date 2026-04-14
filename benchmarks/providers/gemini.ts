export interface GeminiUsage {
  promptTokens: number;
  completionTokens: number;
}

export async function geminiComplete(
  apiKey: string,
  model: string,
  system: string,
  user: string,
): Promise<GeminiUsage> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 900,
      },
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Gemini ${res.status}: ${text}`);
  }
  const data = JSON.parse(text) as {
    usageMetadata?: {
      promptTokenCount?: number;
      candidatesTokenCount?: number;
    };
  };
  const promptTokens = data.usageMetadata?.promptTokenCount ?? 0;
  const completionTokens = data.usageMetadata?.candidatesTokenCount ?? 0;
  return { promptTokens, completionTokens };
}
