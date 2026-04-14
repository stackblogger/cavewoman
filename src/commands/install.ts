import os from "node:os";
import tty from "node:tty";
import { stdin } from "node:process";
import { parseRuleMode } from "../rules/index.js";
import {
  effectiveCursorSkillsDir,
  formatScope,
  loadConfig,
  mergeConfig,
  type Scope,
} from "../utils/config.js";
import { icons, line } from "../utils/logger.js";
import { resolveInjector } from "../injectors/index.js";
import type { InstallContext } from "../injectors/types.js";
import { promptMissingInstallArgs } from "./prompts.js";

function parseScope(value: string | undefined, fallback: Scope): Scope {
  if (value === "global" || value === "project") {
    return value;
  }
  return fallback;
}

export async function runInstall(opts: {
  target?: string;
  mode?: string;
  scope?: string;
  interactive: boolean;
  cwd: string;
}): Promise<void> {
  const cfg = loadConfig();
  const defaults = {
    target: cfg.defaultTarget,
    mode: cfg.defaultMode,
    scope: parseScope(cfg.lastScope ?? undefined, "global"),
  };

  let target = opts.target?.trim();
  let modeStr = opts.mode?.trim();
  let scopeStr = opts.scope?.trim();

  const missing = !target || !modeStr || !scopeStr;
  if (missing && opts.interactive) {
    const filled = await promptMissingInstallArgs({
      target,
      mode: modeStr,
      scope: scopeStr,
      defaults: { target: defaults.target, mode: defaults.mode, scope: defaults.scope },
    });
    target = filled.target;
    modeStr = filled.mode;
    scopeStr = filled.scope;
  }

  if (!target) {
    throw new Error("Missing --target (or run interactively in a TTY)");
  }

  const mode = parseRuleMode(modeStr, cfg.defaultMode);
  const scope = parseScope(scopeStr, defaults.scope);

  const injector = resolveInjector(target);
  if (!injector) {
    throw new Error(`Unknown target "${target}". Try: cavewoman status`);
  }

  const ctx: InstallContext = {
    cwd: opts.cwd,
    home: os.homedir(),
    mode,
    scope,
    preferences: { cursorSkillsDir: effectiveCursorSkillsDir(cfg) },
  };

  const result = await injector.install(ctx);

  mergeConfig({
    defaultTarget: injector.id,
    defaultMode: mode,
    lastInstalledTarget: injector.id,
    lastScope: scope,
  });

  line("");
  line(`${icons.mascot} cavewoman setup`);
  line("");
  line(`Target: ${target}`);
  line(`Mode: ${mode}`);
  line(`Scope: ${formatScope(scope)}`);
  line("");
  line(`${icons.check} ${result.summary}`);
  if (result.details?.length) {
    for (const d of result.details) {
      line(`- ${d}`);
    }
  }

  if (injector.id === "chatgpt") {
    line("");
    line("Paste this once to activate cavewoman (clipboard already filled).");
  }

  line("");
  line("cavewoman is now active.");
  line("");

  if (injector.id === "codex") {
    line("Codex tip: verify your `codex` CLI supports `-p` / prompt injection; edit wrapper if not.");
    line("");
  }

  if (injector.id === "claude-code") {
    line("Claude Code: use the printed path with `claude --plugin-dir \"…\"`, or ship the same layout in a Git repo and register a plugin marketplace (see Anthropic “Plugin marketplaces”).");
    line("");
  }

  if (injector.id === "gemini") {
    line("Gemini CLI: restart the CLI after install; use `gemini extensions list` / `/extensions list`. From a repo: `gemini extensions install <github-url>`.");
    line("");
  }

  if (opts.interactive && tty.isatty(stdin.fd)) {
    const s = stdin as typeof stdin & { setRawMode?: (mode: boolean) => void };
    s.setRawMode?.(false);
    stdin.pause();
  }
}
