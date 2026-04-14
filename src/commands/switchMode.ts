import os from "node:os";
import { effectiveCursorSkillsDir, loadConfig, mergeConfig } from "../utils/config.js";
import { icons, line } from "../utils/logger.js";
import { resolveInjector } from "../injectors/index.js";
import type { InstallContext } from "../injectors/types.js";
import { parseRuleMode } from "../rules/index.js";

function parseScope(value: string | undefined): "global" | "project" {
  return value === "project" ? "project" : "global";
}

export async function runSwitchMode(opts: { mode: string; cwd: string }): Promise<void> {
  const cfg = loadConfig();
  const mode = parseRuleMode(opts.mode, cfg.defaultMode);
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
