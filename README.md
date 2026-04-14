<p align="center">
  <img src="assets/cavewoman-logo.png" alt="cavewoman" />
</p>

<h1 align="center">cavewoman</h1>

<p align="center">
  <strong>a lightweight CLI that saves your real money with coding agents</strong>
</p>

<p align="center">
  <a href="https://github.com/stackblogger/cavewoman/actions/workflows/semgrep.yml"><img src="https://github.com/stackblogger/cavewoman/actions/workflows/semgrep.yml/badge.svg" alt="Semgrep" /></a>
  <a href="https://www.npmjs.com/package/cavewoman"><img src="https://img.shields.io/npm/l/cavewoman" alt="License" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
</p>

**Documentation:** https://opensource.stackblogger.com/cavewoman/

## Installation

As a prerequisite, you need to have [Node.js](https://nodejs.org) installed on your machine to use `npm` commands.

### Option 1: Install globally (recommended)

```bash
npm install -g cavewoman
```

Then run:
```bash
cavewoman
```

Follow the on-screen prompts to configure it.

### Option 2: Run without global installation

```bash
npx cavewoman
```

Runs instantly — no install needed.

## Quick start

```bash
cavewoman install -t cursor -m structured -s global
cavewoman install -t claude-code -m ultra
cavewoman status
cavewoman switch balanced
cavewoman uninstall -t cursor
```

**`install`** — `-t` / `--target` → agent id (`cursor`, `claude-code`, `chatgpt`, `gemini`, `codex`, `windsurf`, `generic`).  
**`install`** — `-m` / `--mode` → `balanced` | `structured` | `ultra`.  
**`install`** — `-s` / `--scope` → `global` (this machine) | `project` (current repo).  
**`install`** (no flags) → prompts for target, mode, scope when TTY.  

**`switch [mode]`** — sets default mode and refreshes last installed target; omit `mode` for interactive picker.  

**`uninstall`** — `-t` / `--target` → which agent to clean (defaults to last install).  
**`uninstall`** — `-s` / `--scope` → scope for non-Cursor targets; Cursor uninstall touches global and project skill dirs when present.  

**`status`** — prints saved defaults, last install, and last scope.

## Supported agents

| Target | What it does |
| --- | --- |
| `cursor` | Writes a `SKILL.md` skill under `~/.agents/skills/cavewoman` (global) or `./.agents/skills/cavewoman` (project) |
| `claude-code` | Writes a Claude Code plugin (`~/.cavewoman/claude-code-plugin` or `./.cavewoman/claude-code-plugin`): `.claude-plugin/plugin.json` + `skills/cavewoman/SKILL.md` — use `claude --plugin-dir …` or a marketplace |
| `chatgpt` | Saves `~/.cavewoman/chatgpt-sticky-prompt.txt` and copies the same text to the clipboard |
| `gemini` | Writes a Gemini CLI extension under `~/.gemini/extensions/cavewoman` (or `./.gemini/extensions/cavewoman`): `gemini-extension.json` + `GEMINI.md` — restart CLI; `gemini extensions link` / `gemini extensions install` |
| `codex` | Writes `~/.cavewoman/codex-prefix.txt` and a `~/.cavewoman/bin/cavewoman-codex` wrapper (expects a `codex` CLI; adjust if flags differ) |
| `windsurf` | Writes `~/.cavewoman/windsurf-prefix.txt` for Cascade-style persistent instructions |
| `generic` | Writes `~/.cavewoman/generic-prefix.txt` to prepend manually |

## Configuration

`~/.cavewomanrc` (JSON):

- `defaultTarget`: default agent id
- `defaultMode`: `balanced` | `structured` | `ultra`
- `lastInstalledTarget`: used by `switch` refresh + `uninstall` default
- `lastScope`: `global` (this computer) | `project` (this repo)
- `preferences.cursorSkillsDir`: optional absolute override for Cursor skill root

Environment override:

- `CAVEWOMAN_CURSOR_SKILLS_DIR`: overrides Cursor skills base directory (does not write to rc)

## Modes

- `balanced`: tighter writing without rigid headings
- `structured`: headings + checklist-style contract
- `ultra`: maximum compression guidance

## Before vs after (illustrative)

Before:

> Sure! I'd be happy to help you with that. The issue you're experiencing is likely caused by a subtle mismatch between...

After (cavewoman-guided):

> Root cause: stale build artifact in `dist/`. Fix: delete `dist`, rerun `npm run build`, restart dev server. Verify: `curl localhost:3000/health` returns 200.

## Extending agents

Add a new injector under `src/injectors/`, export it from `src/injectors/index.ts`, and document the target in this README.

## Development

```bash
npm install
npm run build
node dist/cli.js status
```

## License

MIT
