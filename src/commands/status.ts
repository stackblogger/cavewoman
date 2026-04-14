import os from "node:os";
import { effectiveCursorSkillsDir, formatScope, loadConfig } from "../utils/config.js";
import { icons, line } from "../utils/logger.js";
import { injectors } from "../injectors/index.js";
import type { InstallContext } from "../injectors/types.js";
import { parseRuleMode } from "../rules/index.js";

export async function runStatus(opts: { cwd: string }): Promise<void> {
  const cfg = loadConfig();
  line(`${icons.mascot} cavewoman status`);
  line(`Config: ~/.cavewomanrc`);
  line(`Default target: ${cfg.defaultTarget}`);
  line(`Default mode: ${cfg.defaultMode}`);
  line(`Last install: ${cfg.lastInstalledTarget ?? "none"}`);
  line(`Last scope: ${cfg.lastScope ? formatScope(cfg.lastScope) : "n/a"}`);
  line("");

  const ctx: InstallContext = {
    cwd: opts.cwd,
    home: os.homedir(),
    mode: parseRuleMode(undefined, cfg.defaultMode),
    scope: cfg.lastScope === "project" ? "project" : "global",
    preferences: { cursorSkillsDir: effectiveCursorSkillsDir(cfg) },
  };

  for (const injector of injectors) {
    if (!injector.status) {
      line(`- ${injector.id}: (no status)`);
      continue;
    }
    const s = await injector.status(ctx);
    line(`- ${injector.id}: ${s.summary}`);
  }
}
