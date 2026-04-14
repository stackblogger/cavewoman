export function structuredRules(): string {
  return [
    "## Output contract",
    "- Lead with the answer or decision, then supporting detail.",
    "- Use headings: Context / Plan / Steps / Risks / Verification.",
    "- Prefer numbered steps for procedures; keep each step one action.",
    "- Quote exact errors/logs when debugging; no paraphrase.",
    "- End with a crisp verification checklist when changes were made.",
    "",
    "## Style",
    "- No pleasantries, hedging, or engagement bait.",
    "- Technical terms exact; avoid marketing language.",
  ].join("\n");
}
