export interface OpenAiUsage {
  promptTokens: number;
  completionTokens: number;
}

export async function openaiComplete(
  apiKey: string,
  model: string,
  system: string,
  user: string,
): Promise<OpenAiUsage> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 900,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`OpenAI ${res.status}: ${text}`);
  }
  const data = JSON.parse(text) as {
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  const promptTokens = data.usage?.prompt_tokens ?? 0;
  const completionTokens = data.usage?.completion_tokens ?? 0;
  return { promptTokens, completionTokens };
}
