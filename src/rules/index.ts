import { balancedRules } from "./balanced.js";
import { structuredRules } from "./structured.js";
import { ultraRules } from "./ultra.js";

export type RuleMode = "balanced" | "structured" | "ultra";

export function getRules(mode: RuleMode): string {
  switch (mode) {
    case "balanced":
      return balancedRules();
    case "structured":
      return structuredRules();
    case "ultra":
      return ultraRules();
    default: {
      const _exhaustive: never = mode;
      return _exhaustive;
    }
  }
}

export function parseRuleMode(value: string | undefined, fallback: RuleMode): RuleMode {
  if (value === "balanced" || value === "structured" || value === "ultra") {
    return value;
  }
  return fallback;
}
