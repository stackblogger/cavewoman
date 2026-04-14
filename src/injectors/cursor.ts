import fs from "node:fs";
import path from "node:path";
import { getRules } from "../rules/index.js";
import { ensureDir, resolveCursorSkillsDir } from "../utils/paths.js";
import { cursorSkillMarkdown } from "./markdownSkill.js";
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

export const cursorInjector: Injector = {
  id: "cursor",
  label: "Cursor",

  async install(ctx: InstallContext): Promise<InstallResult> {
    const dir = skillDir(ctx);
    ensureDir(dir);
    const rules = getRules(ctx.mode);
    const md = cursorSkillMarkdown(ctx.mode, rules);
    fs.writeFileSync(path.join(dir, "SKILL.md"), md, "utf8");
    return {
      summary: "Installed cavewoman skill",
      details: [dir],
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
    if (removed.length === 0) {
      return { summary: "Nothing to remove (skill missing)", details: dirs };
    }
    return { summary: "Removed cavewoman Cursor skill", details: removed };
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
