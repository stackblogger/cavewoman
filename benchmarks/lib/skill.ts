import { cursorSkillMarkdown } from "../../src/injectors/markdownSkill.js";
import { getRules, type RuleMode } from "../../src/rules/index.js";

export function cavewomanSystem(mode: RuleMode): string {
  return cursorSkillMarkdown(mode, getRules(mode));
}
