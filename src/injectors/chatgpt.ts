import fs from "node:fs";
import path from "node:path";
import clipboardy from "clipboardy";
import { getRules } from "../rules/index.js";
import { CAVEWOMAN_DIR, ensureDir } from "../utils/paths.js";
import type { Injector, InstallContext, InstallResult } from "./types.js";

const stickyHeader = () =>
  [
    "Cavewoman sticky system prompt (ChatGPT)",
    "Paste once as a custom instruction / project rules / system prompt.",
    "",
  ].join("\n");

function buildStickyPrompt(modeLabel: string, rules: string): string {
  return `${stickyHeader()}## Mode: ${modeLabel}\n\n${rules}\n`;
}

async function installChatgpt(ctx: InstallContext): Promise<InstallResult> {
  ensureDir(CAVEWOMAN_DIR);
  const rules = getRules(ctx.mode);
  const text = buildStickyPrompt(ctx.mode, rules);
  const outFile = path.join(CAVEWOMAN_DIR, "chatgpt-sticky-prompt.txt");
  fs.writeFileSync(outFile, text, "utf8");
  await clipboardy.write(text);
  return {
    summary: "Copied sticky system prompt to clipboard",
    details: [outFile, "Paste this once to activate cavewoman"],
  };
}

async function uninstallChatgpt(): Promise<InstallResult> {
  const outFile = path.join(CAVEWOMAN_DIR, "chatgpt-sticky-prompt.txt");
  try {
    fs.rmSync(outFile, { force: true });
  } catch {
    /* ignore */
  }
  return { summary: "Removed saved sticky prompt file", details: [outFile] };
}

async function statusChatgpt(): Promise<InstallResult> {
  const outFile = path.join(CAVEWOMAN_DIR, "chatgpt-sticky-prompt.txt");
  return {
    summary: fs.existsSync(outFile) ? "ChatGPT sticky prompt on disk" : "ChatGPT sticky prompt missing",
    details: [outFile],
  };
}

export const chatgptInjector: Injector = {
  id: "chatgpt",
  label: "ChatGPT",
  install: (ctx) => installChatgpt(ctx),
  uninstall: () => uninstallChatgpt(),
  status: () => statusChatgpt(),
};
