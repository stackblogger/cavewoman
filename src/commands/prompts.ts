import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { listTargets } from "../injectors/index.js";

export async function promptMissingInstallArgs(opts: {
  target?: string;
  mode?: string;
  scope?: string;
  defaults: { target: string; mode: string; scope: string };
}): Promise<{ target: string; mode: string; scope: string }> {
  const rl = readline.createInterface({ input, output });
  try {
    let target = opts.target?.trim();
    if (!target) {
      const targets = listTargets().join(", ");
      const ans = await rl.question(`Target (${targets}) [${opts.defaults.target}]: `);
      target = ans.trim() || opts.defaults.target;
    }

    let mode = opts.mode?.trim();
    if (!mode) {
      const ans = await rl.question(`Mode (balanced|structured|ultra) [${opts.defaults.mode}]: `);
      mode = ans.trim() || opts.defaults.mode;
    }

    let scope = opts.scope?.trim();
    if (!scope) {
      const ans = await rl.question(`Scope (global|project) [${opts.defaults.scope}]: `);
      scope = ans.trim() || opts.defaults.scope;
    }

    return { target, mode, scope };
  } finally {
    rl.close();
  }
}
