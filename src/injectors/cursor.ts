import fs from "node:fs";
import path from "node:path";
import { getRules } from "../rules/index.js";
import { ensureDir, resolveCursorSkillsDir } from "../utils/paths.js";
import type { Injector, InstallContext, InstallResult } from "./types.js";

const SKILL_NAME = "cavewoman";

function skillMarkdown(mode: string, rules: string): string {
  return `---
name: ${SKILL_NAME}
description: Cavewoman response optimizer (${mode}). Injects concise, structured, low-fluff guidance.
---

# Cavewoman

Mode: **${mode}**

## Rules

${rules}

## Usage

Keep this skill enabled while pair-programming. Adjust mode via \`cavewoman switch-mode\`.
`;
}

function skillDir(ctx: InstallContext): string {
  const base = resolveCursorSkillsDir(ctx.preferences.cursorSkillsDir ?? undefined, ctx.scope, ctx.cwd);
  return path.join(base, SKILL_NAME);
}

export const cursorInjector: Injector = {
  id: "cursor",
  label: "Cursor (skill)",

  async install(ctx: InstallContext): Promise<InstallResult> {
    const dir = skillDir(ctx);
    ensureDir(dir);
    const rules = getRules(ctx.mode);
    const md = skillMarkdown(ctx.mode, rules);
    fs.writeFileSync(path.join(dir, "SKILL.md"), md, "utf8");
    return {
      summary: "Installed cavewoman skill",
      details: [dir],
    };
  },

  async uninstall(ctx: InstallContext): Promise<InstallResult> {
    const dir = skillDir(ctx);
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      return { summary: "Removed cavewoman Cursor skill", details: [dir] };
    } catch {
      return { summary: "Nothing to remove (skill missing)", details: [dir] };
    }
  },

  async status(ctx: InstallContext): Promise<InstallResult> {
    const dir = skillDir(ctx);
    const exists = fs.existsSync(path.join(dir, "SKILL.md"));
    return {
      summary: exists ? "Cursor skill present" : "Cursor skill missing",
      details: [dir],
    };
  },
};
