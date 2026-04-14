import { chatgptInjector, claudeInjector } from "./claude.js";
import { codexInjector } from "./codex.js";
import { cursorInjector } from "./cursor.js";
import { genericInjector, windsurfInjector } from "./generic.js";
import type { Injector, InstallTarget } from "./types.js";

export const injectors: Injector[] = [
  cursorInjector,
  claudeInjector,
  chatgptInjector,
  codexInjector,
  windsurfInjector,
  genericInjector,
];

const byId = new Map<InstallTarget, Injector>(injectors.map((i) => [i.id, i]));

export function listTargets(): InstallTarget[] {
  return injectors.map((i) => i.id);
}

export function listTargetChoices(): { name: string; value: InstallTarget }[] {
  return injectors.map((i) => ({ name: `${i.id} — ${i.label}`, value: i.id }));
}

export function resolveInjector(target: string): Injector | null {
  const key = target.toLowerCase() as InstallTarget;
  return byId.get(key) ?? null;
}

export function describeTargets(): string {
  return injectors.map((i) => `- ${i.id}: ${i.label}`).join("\n");
}
