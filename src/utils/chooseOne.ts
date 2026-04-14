import readline from "node:readline";
import tty from "node:tty";
import { stdin as input, stdout as output } from "node:process";

export type ListChoice = { name: string; value: string };

export async function chooseOne(options: {
  message: string;
  choices: readonly ListChoice[];
  defaultValue: string;
}): Promise<string> {
  if (options.choices.length === 0) {
    throw new Error("chooseOne requires at least one choice");
  }
  if (!tty.isatty(input.fd) || !tty.isatty(output.fd)) {
    throw new Error("Interactive list requires a TTY");
  }

  let index = options.choices.findIndex((c) => c.value === options.defaultValue);
  if (index < 0) {
    index = 0;
  }

  input.resume();
  readline.emitKeypressEvents(input);
  const inStream = input as typeof input & { setRawMode?: (mode: boolean) => void };
  inStream.setRawMode?.(true);

  const render = (): void => {
    const rows = [
      options.message,
      "",
      ...options.choices.map((c, i) => {
        const pointer = i === index ? "❯ " : "  ";
        const hi = i === index ? "\x1b[1m" : "\x1b[0m";
        return `${pointer}${hi}${c.name}\x1b[0m`;
      }),
      "",
      "\x1b[90m↑/↓ move · Enter or Space confirm · Ctrl+C cancel\x1b[0m",
    ];
    output.write(`\x1B[2J\x1B[H${rows.join("\n")}`);
  };

  return await new Promise<string>((resolve, reject) => {
    const cleanup = (): void => {
      inStream.setRawMode?.(false);
      input.pause();
    };

    const onKeypress = (_str: string, key: readline.Key): void => {
      if (key.name === "escape" || (key.ctrl && key.name === "c")) {
        input.removeListener("keypress", onKeypress);
        cleanup();
        reject(Object.assign(new Error("Cancelled"), { code: "ERR_CANCELLED" }));
        return;
      }
      if (key.name === "up") {
        index = (index - 1 + options.choices.length) % options.choices.length;
        render();
        return;
      }
      if (key.name === "down") {
        index = (index + 1) % options.choices.length;
        render();
        return;
      }
      if (key.name === "return" || key.name === "enter" || key.name === "space") {
        input.removeListener("keypress", onKeypress);
        cleanup();
        output.write("\n");
        resolve(options.choices[index]!.value);
      }
    };

    input.on("keypress", onKeypress);
    render();
  });
}
