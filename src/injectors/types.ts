import type { RuleMode } from "../rules/index.js";
import type { Scope } from "../utils/config.js";

export type InstallTarget =
  | "cursor"
  | "claude-code"
  | "chatgpt"
  | "gemini"
  | "codex"
  | "windsurf"
  | "generic";

export type InstallContext = {
  cwd: string;
  home: string;
  mode: RuleMode;
  scope: Scope;
  preferences: {
    cursorSkillsDir?: string | null;
  };
};

export type InstallResult = {
  summary: string;
  details?: string[];
};

export type Injector = {
  id: InstallTarget;
  label: string;
  install: (ctx: InstallContext) => Promise<InstallResult>;
  uninstall?: (ctx: InstallContext) => Promise<InstallResult>;
  status?: (ctx: InstallContext) => Promise<InstallResult>;
};
