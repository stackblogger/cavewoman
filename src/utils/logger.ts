export const icons = {
  mascot: "🗿",
  check: "✔",
  warn: "⚠",
  info: "ℹ",
} as const;

export function line(message: string): void {
  process.stdout.write(`${message}\n`);
}
