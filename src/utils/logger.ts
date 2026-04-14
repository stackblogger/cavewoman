export const icons = {
  mascot: "𓁄",
  check: "✔",
  warn: "⚠",
  info: "ℹ",
} as const;

export function line(message: string): void {
  process.stdout.write(`${message}\n`);
}
