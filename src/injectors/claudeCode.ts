import fs from "node:fs";
import path from "node:path";
import { getRules } from "../rules/index.js";
import { CAVEWOMAN_DIR, ensureDir } from "../utils/paths.js";
import { readVersion } from "../utils/version.js";
import { claudeCodeSkillMarkdown } from "./markdownSkill.js";
import type { Injector, InstallContext, InstallResult } from "./types.js";

const PLUGIN_FOLDER = "claude-code-plugin";

function pluginRoot(ctx: InstallContext): string {
  if (ctx.scope === "project") {
    return path.join(ctx.cwd, ".cavewoman", PLUGIN_FOLDER);
  }
  return path.join(CAVEWOMAN_DIR, PLUGIN_FOLDER);
}

function writePlugin(ctx: InstallContext): string {
  const root = pluginRoot(ctx);
  const rules = getRules(ctx.mode);
  const md = claudeCodeSkillMarkdown(ctx.mode, rules);
  const manifest = {
    name: "cavewoman",
    description:
      "Cavewoman — concise, structured, low-fluff guidance for coding sessions (plugin for Claude Code).",
    version: readVersion(),
  };

  ensureDir(path.join(root, ".claude-plugin"));
  ensureDir(path.join(root, "skills", "cavewoman"));
  fs.writeFileSync(path.join(root, ".claude-plugin", "plugin.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(root, "skills", "cavewoman", "SKILL.md"), md, "utf8");
  return root;
}

export const claudeCodeInjector: Injector = {
  id: "claude-code",
  label: "Claude Code",
  async install(ctx: InstallContext): Promise<InstallResult> {
    const root = writePlugin(ctx);
    return {
      summary: "Wrote Claude Code plugin (manifest + skill)",
      details: [
        root,
        "Run: claude --plugin-dir \"" + root + "\"",
        "Or: claude plugin install … after publishing this folder layout in a Git repo + marketplace.json",
      ],
    };
  },

  async uninstall(ctx: InstallContext): Promise<InstallResult> {
    const root = pluginRoot(ctx);
    try {
      fs.rmSync(root, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
    return { summary: "Removed Claude Code plugin files", details: [root] };
  },

  async status(ctx: InstallContext): Promise<InstallResult> {
    const root = pluginRoot(ctx);
    const ok = fs.existsSync(path.join(root, ".claude-plugin", "plugin.json"));
    return {
      summary: ok ? "Claude Code plugin files present" : "Claude Code plugin missing",
      details: [root],
    };
  },
};
