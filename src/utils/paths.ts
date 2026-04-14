import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const CAVEWOMAN_DIR = path.join(os.homedir(), ".cavewoman");
export const CAVEWOMAN_RC = path.join(os.homedir(), ".cavewomanrc");

export function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

export function defaultGlobalSkillsDir(): string {
  return path.join(os.homedir(), ".agents", "skills");
}

export function defaultProjectSkillsDir(cwd: string): string {
  return path.join(cwd, ".agents", "skills");
}

export function resolveCursorSkillsDir(
  override: string | undefined,
  scope: "global" | "project",
  cwd: string
): string {
  if (override && override.trim()) {
    return path.resolve(override.trim());
  }
  return scope === "global" ? defaultGlobalSkillsDir() : defaultProjectSkillsDir(cwd);
}
