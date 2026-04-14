import fs from "node:fs";
import path from "node:path";
import { getRules } from "../rules/index.js";
import { ensureDir } from "../utils/paths.js";
import { readVersion } from "../utils/version.js";
import { geminiContextMarkdown } from "./markdownSkill.js";
import type { Injector, InstallContext, InstallResult } from "./types.js";

const EXT_NAME = "cavewoman";

function extensionRoot(ctx: InstallContext): string {
  if (ctx.scope === "project") {
    return path.join(ctx.cwd, ".gemini", "extensions", EXT_NAME);
  }
  return path.join(ctx.home, ".gemini", "extensions", EXT_NAME);
}

function writeExtension(ctx: InstallContext): string {
  const root = extensionRoot(ctx);
  const rules = getRules(ctx.mode);
  const manifest = {
    name: EXT_NAME,
    version: readVersion(),
    description: "Cavewoman — concise, structured response rules for Gemini CLI.",
    contextFileName: "GEMINI.md",
  };
  ensureDir(root);
  fs.writeFileSync(path.join(root, "gemini-extension.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(root, "GEMINI.md"), geminiContextMarkdown(ctx.mode, rules), "utf8");
  return root;
}

export const geminiInjector: Injector = {
  id: "gemini",
  label: "Gemini CLI",
  async install(ctx: InstallContext): Promise<InstallResult> {
    const root = writeExtension(ctx);
    return {
      summary: "Wrote Gemini CLI extension (gemini-extension.json + GEMINI.md)",
      details: [
        root,
        "Restart Gemini CLI, then run /extensions list (or gemini extensions list).",
        "From a published repo: gemini extensions install <github-url>",
      ],
    };
  },

  async uninstall(ctx: InstallContext): Promise<InstallResult> {
    const root = extensionRoot(ctx);
    try {
      fs.rmSync(root, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
    return { summary: "Removed Gemini extension directory", details: [root] };
  },

  async status(ctx: InstallContext): Promise<InstallResult> {
    const root = extensionRoot(ctx);
    const ok = fs.existsSync(path.join(root, "gemini-extension.json"));
    return {
      summary: ok ? "Gemini extension files present" : "Gemini extension missing",
      details: [root],
    };
  },
};
