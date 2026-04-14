export function ultraRules(): string {
  return [
    "Ultra-compact mode: minimize tokens; fragments OK.",
    "Drop filler, hedging, and redundant politeness.",
    "Use arrows for causality (A → B) when helpful.",
    "Prefer imperative bullets; one fact per line.",
    "Errors: quote exact text. Code: minimal diff, normal formatting.",
    "Security/destructive ops: switch to explicit warnings; then resume compact style.",
  ].join("\n");
}
