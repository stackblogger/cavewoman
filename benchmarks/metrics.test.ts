import assert from "node:assert/strict";
import test from "node:test";

import { average, completionSavingsPct, type Row } from "./lib/metrics.js";

test("completionSavingsPct halves", () => {
  assert.equal(completionSavingsPct(100, 50), 50);
});

test("completionSavingsPct zero baseline", () => {
  assert.equal(completionSavingsPct(0, 10), 0);
});

test("average over rows", () => {
  const rows: Row[] = [
    {
      provider: "x",
      scenarioId: "a",
      baselineCompletion: 100,
      cavewomanCompletion: 80,
      baselinePrompt: 1,
      cavewomanPrompt: 2,
    },
    {
      provider: "x",
      scenarioId: "b",
      baselineCompletion: 100,
      cavewomanCompletion: 60,
      baselinePrompt: 1,
      cavewomanPrompt: 2,
    },
  ];
  const avg = average(rows, (r) => completionSavingsPct(r.baselineCompletion, r.cavewomanCompletion));
  assert.ok(Math.abs(avg - 30) < 0.0001);
});
