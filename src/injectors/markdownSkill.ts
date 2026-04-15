const SKILL = "cavewoman";

function cavewomanBody(mode: string, rules: string): string {
  return `# Cavewoman

Mode: **${mode}**

## Rules

${rules}

## Usage

Keep this skill enabled while pair-programming. Adjust mode via \`cavewoman switch\`.
`;
}

export function cursorSkillMarkdown(mode: string, rules: string): string {
  return `---
name: ${SKILL}
description: Cavewoman response optimizer (${mode}). Injects concise, structured, low-fluff guidance.
---

${cavewomanBody(mode, rules)}`;
}

export function cursorProjectRuleMarkdown(mode: string, rules: string): string {
  return `---
description: Cavewoman response optimizer (${mode}) — always-on project rule
alwaysApply: true
---

${cavewomanBody(mode, rules)}`;
}

export function claudeCodeSkillMarkdown(mode: string, rules: string): string {
  return `---
name: ${SKILL}
description: Cavewoman response optimizer (${mode}). Apply concise, structured, low-fluff guidance while coding. Use for implementation help, refactors, and reviews.
---

# Cavewoman

Mode: **${mode}**

## Rules

${rules}

## Usage

Keep this skill in mind for the session. Update rules by re-running \`cavewoman install --target claude-code\` or \`cavewoman switch\`.
`;
}

export function geminiContextMarkdown(mode: string, rules: string): string {
  return `# Cavewoman

Mode: **${mode}**

Apply the following in every reply while this extension is active:

${rules}

---

Re-install or change mode: \`cavewoman install --target gemini\` / \`cavewoman switch\`.
`;
}
