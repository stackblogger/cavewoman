import fs from "node:fs";
import path from "node:path";
import clipboardy from "clipboardy";
import { getRules } from "../rules/index.js";
import { CAVEWOMAN_DIR, ensureDir } from "../utils/paths.js";
import type { Injector, InstallContext, InstallResult } from "./types.js";

const stickyHeader = (agent: string) =>
  [
    `Cavewoman sticky system prompt (${agent})`,
    "Paste once as a custom instruction / project rules / system prompt.",
    "",
  ].join("\n");

export function buildStickyPrompt(modeLabel: string, rules: string, agent: string): string {
  return `${stickyHeader(agent)}## Mode: ${modeLabel}\n\n${rules}\n`;
}

async function installClipboardAgent(
  ctx: InstallContext,
  agent: "claude" | "chatgpt"
): Promise<InstallResult> {
  ensureDir(CAVEWOMAN_DIR);
  const rules = getRules(ctx.mode);
  const text = buildStickyPrompt(ctx.mode, rules, agent);
  const outFile = path.join(CAVEWOMAN_DIR, `${agent}-sticky-prompt.txt`);
  fs.writeFileSync(outFile, text, "utf8");
  await clipboardy.write(text);
  return {
    summary: "Copied sticky system prompt to clipboard",
    details: [outFile, "Paste this once to activate cavewoman"],
  };
}

async function uninstallClipboardAgent(agent: "claude" | "chatgpt"): Promise<InstallResult> {
  const outFile = path.join(CAVEWOMAN_DIR, `${agent}-sticky-prompt.txt`);
  try {
    fs.rmSync(outFile, { force: true });
  } catch {
    /* ignore */
  }
  return { summary: "Removed saved sticky prompt file", details: [outFile] };
}

async function statusClipboardAgent(agent: "claude" | "chatgpt"): Promise<InstallResult> {
  const outFile = path.join(CAVEWOMAN_DIR, `${agent}-sticky-prompt.txt`);
  return {
    summary: fs.existsSync(outFile) ? `${agent} sticky prompt on disk` : `${agent} sticky prompt missing`,
    details: [outFile],
  };
}

export const claudeInjector: Injector = {
  id: "claude",
  label: "Claude (clipboard + sticky prompt)",
  install: (ctx) => installClipboardAgent(ctx, "claude"),
  uninstall: () => uninstallClipboardAgent("claude"),
  status: () => statusClipboardAgent("claude"),
};

export const chatgptInjector: Injector = {
  id: "chatgpt",
  label: "ChatGPT (clipboard + sticky prompt)",
  install: (ctx) => installClipboardAgent(ctx, "chatgpt"),
  uninstall: () => uninstallClipboardAgent("chatgpt"),
  status: () => statusClipboardAgent("chatgpt"),
};
