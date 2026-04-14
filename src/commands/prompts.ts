import { listTargetChoices } from "../injectors/index.js";
import { chooseOne } from "../utils/chooseOne.js";

const MODE_CHOICES = [
  { name: "balanced — tighter prose, fewer headings", value: "balanced" },
  { name: "structured — headings + checklists", value: "structured" },
  { name: "ultra — minimum tokens", value: "ultra" },
] as const;

const SCOPE_CHOICES = [
  { name: "global — user-level paths (~/.agents/skills for Cursor)", value: "global" },
  { name: "project — repo-level paths (./.agents/skills)", value: "project" },
] as const;

export async function promptMissingInstallArgs(opts: {
  target?: string;
  mode?: string;
  scope?: string;
  defaults: { target: string; mode: string; scope: string };
}): Promise<{ target: string; mode: string; scope: string }> {
  let target = opts.target?.trim();
  if (!target) {
    const choices = listTargetChoices();
    target = await chooseOne({
      message: "Target",
      choices,
      defaultValue: opts.defaults.target,
    });
  }

  let mode = opts.mode?.trim();
  if (!mode) {
    mode = await chooseOne({
      message: "Mode",
      choices: [...MODE_CHOICES],
      defaultValue: opts.defaults.mode,
    });
  }

  let scope = opts.scope?.trim();
  if (!scope) {
    scope = await chooseOne({
      message: "Scope",
      choices: [...SCOPE_CHOICES],
      defaultValue: opts.defaults.scope,
    });
  }

  return { target, mode, scope };
}
