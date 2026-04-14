import assert from "node:assert/strict";
import test from "node:test";

import { cavewomanSystem } from "./lib/skill.js";

test("cavewomanSystem bundles skill markdown", () => {
  const s = cavewomanSystem("ultra");
  assert.match(s, /Cavewoman/);
  assert.match(s, /\*\*ultra\*\*/);
  assert.ok(s.length > 200);
});
