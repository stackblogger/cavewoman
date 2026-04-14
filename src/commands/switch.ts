import os from "node:os";
import readline from "node:readline";
import { effectiveCursorSkillsDir, loadConfig, mergeConfig } from "../utils/config.js";
import { icons, line } from "../utils/logger.js";
import { resolveInjector } from "../injectors/index.js";
import type { InstallContext } from "../injectors/types.js";
import { parseRuleMode, type RuleMode } from "../rules/index.js";

const MODES: RuleMode[] = ["balanced", "structured", "ultra"];

function parseScope(value: string | undefined): "global" | "project" {
  return value === "project" ? "project" : "global";
}

function pickModeInteractive(current: RuleMode): Promise<RuleMode> {
  const stdin = process.stdin;
  const stdout = process.stdout;
  let index = MODES.indexOf(current);
  if (index < 0) {
    index = MODES.indexOf("structured");
  }

  readline.emitKeypressEvents(stdin);
  stdin.setRawMode(true);
  stdin.resume();

  const render = () => {
    stdout.write("\x1b[2J\x1b[H");
    stdout.write("Select mode (↑/↓, Enter):\n\n");
    for (let i = 0; i < MODES.length; i++) {
      stdout.write(i === index ? `> ${MODES[i]}\n` : `  ${MODES[i]}\n`);
    }
  };

  return new Promise((resolve, reject) => {
    const onKeypress = (_str: string, key: readline.Key) => {
      if (!key) {
        return;
      }
      if (key.ctrl && key.name === "c") {
        cleanup();
        reject(new Error("Interrupted"));
        return;
      }
      if (key.name === "up") {
        index = (index - 1 + MODES.length) % MODES.length;
        render();
      } else if (key.name === "down") {
        index = (index + 1) % MODES.length;
        render();
      } else if (key.name === "return") {
        cleanup();
        stdout.write("\x1b[2J\x1b[H");
        resolve(MODES[index]!);
      }
    };

    function cleanup() {
      stdin.removeListener("keypress", onKeypress);
      stdin.setRawMode(false);
      stdin.pause();
    }

    stdin.on("keypress", onKeypress);
    render();
  });
}

export async function runSwitch(opts: { mode: string | undefined; cwd: string }): Promise<void> {
  const cfg = loadConfig();
  let modeInput = opts.mode;
  if (!modeInput) {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      line(`${icons.warn} Mode required (non-interactive). Example: cavewoman switch ultra`);
      process.exitCode = 1;
      return;
    }
    modeInput = await pickModeInteractive(cfg.defaultMode);
  }

  const mode = parseRuleMode(modeInput, cfg.defaultMode);
  mergeConfig({ defaultMode: mode });

  const target = cfg.lastInstalledTarget ?? cfg.defaultTarget;
  const injector = resolveInjector(target);
  if (!injector) {
    line(`${icons.warn} Unknown last target "${target}". Run: cavewoman install --target <agent>`);
    return;
  }

  const ctx: InstallContext = {
    cwd: opts.cwd,
    home: os.homedir(),
    mode,
    scope: parseScope(cfg.lastScope ?? "global"),
    preferences: { cursorSkillsDir: effectiveCursorSkillsDir(cfg) },
  };

  const result = await injector.install(ctx);
  line(`${icons.mascot} switched mode → ${mode}`);
  line(`${icons.check} ${result.summary}`);
}
