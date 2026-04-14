export interface Row {
  provider: string;
  scenarioId: string;
  baselineCompletion: number;
  cavewomanCompletion: number;
  baselinePrompt: number;
  cavewomanPrompt: number;
}

export function completionSavingsPct(baselineCompletion: number, cavewomanCompletion: number): number {
  if (baselineCompletion <= 0) {
    return 0;
  }
  return ((baselineCompletion - cavewomanCompletion) / baselineCompletion) * 100;
}

export function average(rows: Row[], pick: (r: Row) => number): number {
  if (rows.length === 0) {
    return 0;
  }
  const sum = rows.reduce((a, r) => a + pick(r), 0);
  return sum / rows.length;
}
