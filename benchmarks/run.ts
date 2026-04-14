import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { anthropicComplete } from "./providers/anthropic.js";
import { geminiComplete } from "./providers/gemini.js";
import { openaiComplete } from "./providers/openai.js";
import {
  BASELINE_SYSTEM,
  DEFAULT_ANTHROPIC_MODEL,
  DEFAULT_CAVEWOMAN_MODE,
  DEFAULT_GEMINI_MODEL,
  DEFAULT_OPENAI_MODEL,
} from "./lib/constants.js";
import { average, completionSavingsPct, type Row } from "./lib/metrics.js";
import { cavewomanSystem } from "./lib/skill.js";
import { scenarios } from "./scenarios.js";
import { parseRuleMode } from "../src/rules/index.js";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function envMode(): RuleMode {
  return parseRuleMode(process.env.CAVEWOMAN_BENCHMARK_MODE, DEFAULT_CAVEWOMAN_MODE);
}

function sleepMs(): number {
  const n = Number(process.env.CAVEWOMAN_BENCHMARK_DELAY_MS ?? "400");
  return Number.isFinite(n) && n >= 0 ? n : 400;
}

async function main(): Promise<void> {
  const mode = envMode();
  const caveSystem = cavewomanSystem(mode);
  const outFlag = process.argv.includes("--out");
  const outIdx = process.argv.indexOf("--out");
  const outPath = outFlag && outIdx >= 0 ? process.argv[outIdx + 1] : undefined;

  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();

  const openaiModel = process.env.OPENAI_BENCHMARK_MODEL?.trim() || DEFAULT_OPENAI_MODEL;
  const anthropicModel = process.env.ANTHROPIC_BENCHMARK_MODEL?.trim() || DEFAULT_ANTHROPIC_MODEL;
  const geminiModel = process.env.GEMINI_BENCHMARK_MODEL?.trim() || DEFAULT_GEMINI_MODEL;

  const rows: Row[] = [];
  const errors: string[] = [];
  const ms = sleepMs();

  const jobs: Array<{
    id: "openai" | "anthropic" | "gemini";
    run: (system: string, user: string) => Promise<{ promptTokens: number; completionTokens: number }>;
  }> = [];

  if (openaiKey) {
    jobs.push({
      id: "openai",
      run: (system, user) => openaiComplete(openaiKey, openaiModel, system, user),
    });
  }
  if (anthropicKey) {
    jobs.push({
      id: "anthropic",
      run: (system, user) => anthropicComplete(anthropicKey, anthropicModel, system, user),
    });
  }
  if (geminiKey) {
    jobs.push({
      id: "gemini",
      run: (system, user) => geminiComplete(geminiKey, geminiModel, system, user),
    });
  }

  if (jobs.length === 0) {
    process.stderr.write(
      "No API keys set. Provide one or more:\n  OPENAI_API_KEY\n  ANTHROPIC_API_KEY\n  GEMINI_API_KEY\n\nOptional:\n  CAVEWOMAN_BENCHMARK_MODE=balanced|structured|ultra\n  OPENAI_BENCHMARK_MODEL, ANTHROPIC_BENCHMARK_MODEL, GEMINI_BENCHMARK_MODEL\n  CAVEWOMAN_BENCHMARK_DELAY_MS (default 400)\n",
    );
    process.exitCode = 1;
    return;
  }

  process.stdout.write(
    `cavewoman token benchmark — mode=${mode} — providers=${jobs.map((j) => j.id).join(",")}\n\n`,
  );

  for (const job of jobs) {
    for (const sc of scenarios) {
      try {
        const b = await job.run(BASELINE_SYSTEM, sc.user);
        await delay(ms);
        const c = await job.run(caveSystem, sc.user);
        await delay(ms);
        rows.push({
          provider: job.id,
          scenarioId: sc.id,
          baselineCompletion: b.completionTokens,
          cavewomanCompletion: c.completionTokens,
          baselinePrompt: b.promptTokens,
          cavewomanPrompt: c.promptTokens,
        });
        process.stdout.write(`ok ${job.id} ${sc.id}\n`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        errors.push(`${job.id}/${sc.id}: ${msg}`);
        process.stderr.write(`fail ${job.id} ${sc.id}: ${msg}\n`);
      }
    }
  }

  for (const line of errors) {
    process.stderr.write(`error: ${line}\n`);
  }

  if (rows.length === 0) {
    process.exitCode = 1;
    return;
  }

  const table = rows.map((r) => ({
    provider: r.provider,
    scenario: r.scenarioId,
    baseOut: r.baselineCompletion,
    cwOut: r.cavewomanCompletion,
    savePct: Number(completionSavingsPct(r.baselineCompletion, r.cavewomanCompletion).toFixed(1)),
    baseIn: r.baselinePrompt,
    cwIn: r.cavewomanPrompt,
  }));
  console.table(table);

  const avgSave = average(rows, (r) => completionSavingsPct(r.baselineCompletion, r.cavewomanCompletion));
  process.stdout.write(`\nAvg completion-token savings vs baseline: ${avgSave.toFixed(1)}%\n`);
  process.stdout.write(
    `(Negative values mean cavewoman used more completion tokens for that row; input tokens usually rise because of the skill text.)\n`,
  );

  const payload = {
    generatedAt: new Date().toISOString(),
    cavewomanMode: mode,
    models: { openai: openaiModel, anthropic: anthropicModel, gemini: geminiModel },
    rows,
    avgCompletionSavingsPct: avgSave,
    errors,
  };

  if (outPath) {
    const abs = resolve(outPath);
    writeFileSync(abs, JSON.stringify(payload, null, 2), "utf8");
    process.stdout.write(`\nWrote ${abs}\n`);
  }
}

main().catch((e) => {
  process.stderr.write(String(e instanceof Error ? e.stack ?? e.message : e));
  process.stderr.write("\n");
  process.exitCode = 1;
});
