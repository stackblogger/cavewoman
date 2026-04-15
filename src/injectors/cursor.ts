import fs from "node:fs";
import path from "node:path";
import { getRules } from "../rules/index.js";
import { ensureDir, resolveCursorSkillsDir } from "../utils/paths.js";
import { cursorProjectRuleMarkdown, cursorSkillMarkdown } from "./markdownSkill.js";
import type { Injector, InstallContext, InstallResult } from "./types.js";

const SKILL_NAME = "cavewoman";

function skillDir(ctx: InstallContext): string {
  const base = resolveCursorSkillsDir(ctx.preferences.cursorSkillsDir ?? undefined, ctx.scope, ctx.cwd);
  return path.join(base, SKILL_NAME);
}

function skillDirsForUninstall(ctx: InstallContext): string[] {
  const globalDir = skillDir({ ...ctx, scope: "global" });
  const projectDir = skillDir({ ...ctx, scope: "project" });
  if (globalDir === projectDir) {
    return [globalDir];
  }
  return [globalDir, projectDir];
}

function projectCursorRulePath(cwd: string): string {
  return path.join(cwd, ".cursor", "rules", "cavewoman.mdc");
}

export const cursorInjector: Injector = {
  id: "cursor",
  label: "Cursor",

  async install(ctx: InstallContext): Promise<InstallResult> {
    const dir = skillDir(ctx);
    ensureDir(dir);
    const rules = getRules(ctx.mode);
    const md = cursorSkillMarkdown(ctx.mode, rules);
    fs.writeFileSync(path.join(dir, "SKILL.md"), md, "utf8");
    const rulePath = projectCursorRulePath(ctx.cwd);
    ensureDir(path.dirname(rulePath));
    fs.writeFileSync(rulePath, cursorProjectRuleMarkdown(ctx.mode, rules), "utf8");
    return {
      summary: "Installed cavewoman Cursor skill + always-on project rule (.cursor/rules)",
      details: [dir, rulePath],
    };
  },

  async uninstall(ctx: InstallContext): Promise<InstallResult> {
    const dirs = skillDirsForUninstall(ctx);
    const removed: string[] = [];
    for (const dir of dirs) {
      try {
        if (fs.existsSync(path.join(dir, "SKILL.md")) || fs.existsSync(dir)) {
          fs.rmSync(dir, { recursive: true, force: true });
          removed.push(dir);
        }
      } catch {
        /* ignore */
      }
    }
    const rulePath = projectCursorRulePath(ctx.cwd);
    try {
      if (fs.existsSync(rulePath)) {
        fs.unlinkSync(rulePath);
        removed.push(rulePath);
      }
    } catch {
      /* ignore */
    }
    if (removed.length === 0) {
      return { summary: "Nothing to remove (Cursor skill / rule missing)", details: [...dirs, rulePath] };
    }
    return { summary: "Removed cavewoman Cursor skill + project rule when present", details: removed };
  },

  async status(ctx: InstallContext): Promise<InstallResult> {
    const dir = skillDir(ctx);
    const skillOk = fs.existsSync(path.join(dir, "SKILL.md"));
    const rulePath = projectCursorRulePath(ctx.cwd);
    const ruleOk = fs.existsSync(rulePath);
    let summary: string;
    if (skillOk && ruleOk) {
      summary = "Cursor skill + always-on rule present";
    } else if (skillOk) {
      summary = "Cursor skill present (no .cursor/rules/cavewoman.mdc)";
    } else if (ruleOk) {
      summary = "Always-on rule present (Cursor skill missing)";
    } else {
      summary = "Cursor skill + rule missing";
    }
    return {
      summary,
      details: [dir, rulePath],
    };
  },
};
