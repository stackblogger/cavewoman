import os from "node:os";
import { effectiveCursorSkillsDir, loadConfig, mergeConfig } from "../utils/config.js";
import { icons, line } from "../utils/logger.js";
import { resolveInjector } from "../injectors/index.js";
import type { InstallContext } from "../injectors/types.js";
import { parseRuleMode } from "../rules/index.js";

function parseScope(value: string | undefined): "global" | "project" {
  return value === "project" ? "project" : "global";
}

export async function runUninstall(opts: { target?: string; scope?: string; cwd: string }): Promise<void> {
  const cfg = loadConfig();
  const target = (opts.target ?? cfg.lastInstalledTarget ?? cfg.defaultTarget).toLowerCase();
  const injector = resolveInjector(target);
  if (!injector?.uninstall) {
    line(`${icons.warn} No uninstaller for target "${target}" (or unknown target).`);
    return;
  }

  const ctx: InstallContext = {
    cwd: opts.cwd,
    home: os.homedir(),
    mode: parseRuleMode(undefined, cfg.defaultMode),
    scope: parseScope(opts.scope ?? cfg.lastScope ?? "global"),
    preferences: { cursorSkillsDir: effectiveCursorSkillsDir(cfg) },
  };

  const result = await injector.uninstall(ctx);
  mergeConfig({ lastInstalledTarget: null });

  line(`${icons.check} ${result.summary}`);
  if (result.details?.length) {
    for (const d of result.details) {
      line(`- ${d}`);
    }
  }
}
