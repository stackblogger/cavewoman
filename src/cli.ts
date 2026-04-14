#!/usr/bin/env node
import process from "node:process";
import { Command } from "commander";
import { runInstall } from "./commands/install.js";
import { runStatus } from "./commands/status.js";
import { runSwitchMode } from "./commands/switchMode.js";
import { runUninstall } from "./commands/uninstall.js";
import { readHomepage, readVersion } from "./utils/version.js";

function docHelpText(): string {
  return `\nDocumentation: ${readHomepage()}\n`;
}

function normalizeArgv(argv: string[]): string[] {
  const next = argv.filter((t) => t !== "--");
  if (next.length === 0) {
    return ["install"];
  }
  const first = next[0];
  const rootOnly =
    next.length === 1 &&
    (first === "--help" || first === "-h" || first === "--version" || first === "-V");
  if (rootOnly) {
    return next;
  }
  if (first?.startsWith("-")) {
    return ["install", ...next];
  }
  return next;
}

async function main(): Promise<void> {
  const program = new Command();
  program.name("cavewoman");
  program.description("Universal AI response optimizer for coding agents");
  program.version(readVersion());
  program.addHelpText("after", docHelpText());

  program
    .command("install")
    .description("Install cavewoman rules into an agent integration")
    .option("-t, --target <agent>", "Agent target (cursor|claude|chatgpt|codex|windsurf|generic)")
    .option("-m, --mode <mode>", "Rule mode (balanced|structured|ultra)")
    .option("-s, --scope <scope>", "Install scope (global|project)")
    .addHelpText("after", docHelpText())
    .action(async (cmdOpts) => {
      const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY);
      await runInstall({
        target: cmdOpts.target as string | undefined,
        mode: cmdOpts.mode as string | undefined,
        scope: cmdOpts.scope as string | undefined,
        interactive,
        cwd: process.cwd(),
      });
    });

  program
    .command("uninstall")
    .description("Remove cavewoman artifacts for a target")
    .option("-t, --target <agent>", "Agent target (defaults to last install)")
    .option("-s, --scope <scope>", "Scope used for Cursor uninstall paths (global|project)")
    .addHelpText("after", docHelpText())
    .action(async (cmdOpts) => {
      await runUninstall({
        target: cmdOpts.target as string | undefined,
        scope: cmdOpts.scope as string | undefined,
        cwd: process.cwd(),
      });
    });

  program
    .command("switch-mode <mode>")
    .description("Change default mode and refresh last installed target")
    .addHelpText("after", docHelpText())
    .action(async (mode: string) => {
      await runSwitchMode({ mode, cwd: process.cwd() });
    });

  program
    .command("status")
    .description("Show configuration and injector health")
    .addHelpText("after", docHelpText())
    .action(async () => {
      await runStatus({ cwd: process.cwd() });
    });

  const sliced = process.argv.slice(2);
  const normalized = normalizeArgv(sliced);
  await program.parseAsync(normalized, { from: "user" });
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`${msg}\n`);
  process.exitCode = 1;
});
