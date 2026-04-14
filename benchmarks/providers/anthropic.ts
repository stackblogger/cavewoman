export interface AnthropicUsage {
  promptTokens: number;
  completionTokens: number;
}

export async function anthropicComplete(
  apiKey: string,
  model: string,
  system: string,
  user: string,
): Promise<AnthropicUsage> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 900,
      temperature: 0.2,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Anthropic ${res.status}: ${text}`);
  }
  const data = JSON.parse(text) as {
    usage?: { input_tokens?: number; output_tokens?: number };
  };
  const promptTokens = data.usage?.input_tokens ?? 0;
  const completionTokens = data.usage?.output_tokens ?? 0;
  return { promptTokens, completionTokens };
}
