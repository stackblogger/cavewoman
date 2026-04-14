import fs from "node:fs";
import path from "node:path";
import { getRules } from "../rules/index.js";
import { CAVEWOMAN_DIR, ensureDir } from "../utils/paths.js";
import type { Injector, InstallContext, InstallResult } from "./types.js";

export const genericInjector: Injector = {
  id: "generic",
  label: "Other",
  install: (ctx) =>
    writePrefixFile(
      ctx,
      "generic-prefix.txt",
      "Prepend file contents to prompts for agents without dedicated installer."
    ),

  async uninstall(ctx: InstallContext): Promise<InstallResult> {
    const out = path.join(CAVEWOMAN_DIR, "generic-prefix.txt");
    try {
      fs.rmSync(out, { force: true });
    } catch {
      /* ignore */
    }
    return { summary: "Removed generic prefix snippet", details: [out] };
  },

  async status(ctx: InstallContext): Promise<InstallResult> {
    const out = path.join(CAVEWOMAN_DIR, "generic-prefix.txt");
    return {
      summary: fs.existsSync(out) ? "Generic prefix present" : "Generic prefix missing",
      details: [out],
    };
  },
};

async function writePrefixFile(
  ctx: InstallContext,
  filename: string,
  extraHint: string
): Promise<InstallResult> {
  ensureDir(CAVEWOMAN_DIR);
  const rules = getRules(ctx.mode);
  const snippet = [
    "---",
    "cavewoman: prefix this block to any prompt",
    `mode: ${ctx.mode}`,
    "---",
    "",
    rules,
    "",
  ].join("\n");
  const out = path.join(CAVEWOMAN_DIR, filename);
  fs.writeFileSync(out, snippet, "utf8");
  return {
    summary: "Wrote prefix snippet",
    details: [out, extraHint],
  };
}

export const windsurfInjector: Injector = {
  id: "windsurf",
  label: "Windsurf",
  install: (ctx) =>
    writePrefixFile(
      ctx,
      "windsurf-prefix.txt",
      "Paste into Windsurf/Cascade persistent instructions if supported."
    ),
  uninstall: async () => {
    const out = path.join(CAVEWOMAN_DIR, "windsurf-prefix.txt");
    try {
      fs.rmSync(out, { force: true });
    } catch {
      /* ignore */
    }
    return { summary: "Removed Windsurf prefix snippet", details: [out] };
  },
  status: async () => {
    const out = path.join(CAVEWOMAN_DIR, "windsurf-prefix.txt");
    return {
      summary: fs.existsSync(out) ? "Windsurf prefix present" : "Windsurf prefix missing",
      details: [out],
    };
  },
};
