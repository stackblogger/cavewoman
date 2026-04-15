import assert from "node:assert/strict";
import test from "node:test";

import { cursorProjectRuleMarkdown } from "../src/injectors/markdownSkill.js";
import { getRules } from "../src/rules/index.js";
import { cavewomanSystem } from "./lib/skill.js";

test("cavewomanSystem bundles skill markdown", () => {
  const s = cavewomanSystem("ultra");
  assert.match(s, /Cavewoman/);
  assert.match(s, /\*\*ultra\*\*/);
  assert.ok(s.length > 200);
});

test("cursorProjectRuleMarkdown sets alwaysApply", () => {
  const s = cursorProjectRuleMarkdown("ultra", getRules("ultra"));
  assert.match(s, /alwaysApply:\s*true/);
  assert.match(s, /# Cavewoman/);
  assert.match(s, /cavewoman \(ultra mode\)/);
});
