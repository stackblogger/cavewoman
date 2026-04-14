import fs from "node:fs";
import path from "node:path";
import type { RuleMode } from "../rules/index.js";
import { CAVEWOMAN_DIR, CAVEWOMAN_RC, ensureDir } from "./paths.js";

export type Scope = "global" | "project";

export type CavewomanPreferences = {
  cursorSkillsDir?: string | null;
};

export type CavewomanConfig = {
  defaultTarget: string;
  defaultMode: RuleMode;
  lastInstalledTarget?: string | null;
  lastScope?: Scope | null;
  preferences: CavewomanPreferences;
};

const defaultConfig: CavewomanConfig = {
  defaultTarget: "cursor",
  defaultMode: "structured",
  lastInstalledTarget: null,
  lastScope: "global",
  preferences: {},
};

export function loadConfig(): CavewomanConfig {
  try {
    const raw = fs.readFileSync(CAVEWOMAN_RC, "utf8");
    const parsed = JSON.parse(raw) as Partial<CavewomanConfig>;
    return {
      ...defaultConfig,
      ...parsed,
      preferences: { ...defaultConfig.preferences, ...(parsed.preferences ?? {}) },
    };
  } catch {
    return { ...defaultConfig };
  }
}

export function saveConfig(config: CavewomanConfig): void {
  ensureDir(path.dirname(CAVEWOMAN_RC));
  fs.writeFileSync(CAVEWOMAN_RC, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

export function effectiveCursorSkillsDir(cfg: CavewomanConfig): string | null | undefined {
  return cfg.preferences.cursorSkillsDir ?? process.env.CAVEWOMAN_CURSOR_SKILLS_DIR ?? null;
}

export function mergeConfig(partial: Partial<CavewomanConfig>): CavewomanConfig {
  const current = loadConfig();
  const next: CavewomanConfig = {
    ...current,
    ...partial,
    preferences: { ...current.preferences, ...(partial.preferences ?? {}) },
  };
  saveConfig(next);
  return next;
}
