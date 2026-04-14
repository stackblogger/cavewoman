import { listTargetChoices } from "../injectors/index.js";
import { chooseOne } from "../utils/chooseOne.js";
import { formatScope, type Scope } from "../utils/config.js";

const MODE_CHOICES = [
  { name: "balanced — tighter prose, fewer headings", value: "balanced" },
  { name: "structured — headings + checklists", value: "structured" },
  { name: "ultra — minimum tokens", value: "ultra" },
] as const;

const SCOPE_CHOICES: { name: string; value: Scope }[] = [
  { name: formatScope("global"), value: "global" },
  { name: formatScope("project"), value: "project" },
];

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
