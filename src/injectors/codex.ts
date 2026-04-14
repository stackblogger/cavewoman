import fs from "node:fs";
import path from "node:path";
import { getRules } from "../rules/index.js";
import { CAVEWOMAN_DIR, ensureDir } from "../utils/paths.js";
import type { Injector, InstallContext, InstallResult } from "./types.js";

function wrapperScript(home: string): string {
  const prefixFile = path.join(home, ".cavewoman", "codex-prefix.txt");
  const quoted = `'${prefixFile.replace(/'/g, "'\\''")}'`;
  return [
    "#!/usr/bin/env bash",
    "set -euo pipefail",
    "if [[ $# -lt 1 ]]; then",
    '  echo "usage: cavewoman-codex <codex-args...>" >&2',
    '  echo "Prefixes Codex prompts with ~/.cavewoman/codex-prefix.txt" >&2',
    "  exit 2",
    "fi",
    `PREFIX_FILE=${quoted}`,
    'if [[ ! -f "$PREFIX_FILE" ]]; then',
    '  echo "missing prefix file: $PREFIX_FILE (run: cavewoman install --target codex)" >&2',
    "  exit 1",
    "fi",
    'PREFIX="$(cat "$PREFIX_FILE")"',
    'USER_PROMPT="$*"',
    "printf -v COMBINED $'%s\\n\\n%s' \"$PREFIX\" \"$USER_PROMPT\"",
    'exec codex -p "$COMBINED"',
  ].join("\n");
}

export const codexInjector: Injector = {
  id: "codex",
  label: "Codex (wrapper + prefix file)",

  async install(ctx: InstallContext): Promise<InstallResult> {
    ensureDir(CAVEWOMAN_DIR);
    const rules = getRules(ctx.mode);
    const prefix = [
      "Cavewoman prefix (auto-generated).",
      "Mode: " + ctx.mode,
      "",
      rules,
      "",
    ].join("\n");
    const prefixPath = path.join(CAVEWOMAN_DIR, "codex-prefix.txt");
    fs.writeFileSync(prefixPath, prefix, "utf8");

    const binDir = path.join(CAVEWOMAN_DIR, "bin");
    ensureDir(binDir);
    const wrapPath = path.join(binDir, "cavewoman-codex");
    fs.writeFileSync(wrapPath, wrapperScript(ctx.home), "utf8");
    fs.chmodSync(wrapPath, 0o755);

    return {
      summary: "Generated Codex wrapper + prefix cache",
      details: [
        prefixPath,
        wrapPath,
        "Add to PATH: export PATH=\"$HOME/.cavewoman/bin:$PATH\"",
        "Run: cavewoman-codex \"your prompt here\"",
        "Note: requires `codex` CLI with `-p` prompt flag; adjust wrapper if your Codex build differs.",
      ],
    };
  },

  async uninstall(ctx: InstallContext): Promise<InstallResult> {
    const paths = [
      path.join(CAVEWOMAN_DIR, "codex-prefix.txt"),
      path.join(CAVEWOMAN_DIR, "bin", "cavewoman-codex"),
    ];
    for (const p of paths) {
      try {
        fs.rmSync(p, { force: true });
      } catch {
        /* ignore */
      }
    }
    return { summary: "Removed Codex wrapper artifacts", details: paths };
  },

  async status(ctx: InstallContext): Promise<InstallResult> {
    const prefixPath = path.join(CAVEWOMAN_DIR, "codex-prefix.txt");
    const wrapPath = path.join(CAVEWOMAN_DIR, "bin", "cavewoman-codex");
    const ok = fs.existsSync(prefixPath) && fs.existsSync(wrapPath);
    return {
      summary: ok ? "Codex wrapper installed" : "Codex wrapper missing",
      details: [prefixPath, wrapPath],
    };
  },
};
