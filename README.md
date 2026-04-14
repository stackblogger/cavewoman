# cavewoman

Universal AI response optimizer CLI. Installs concise, structured, low-fluff guidance into different coding agents (Cursor, Claude Code, ChatGPT, Gemini CLI, Codex, Windsurf, generic prefix workflows).

**Website & documentation:** https://opensource.stackblogger.com/cavewoman/

## Install

```bash
npm install -g cavewoman
```

Or run without global install:

```bash
npx cavewoman --target cursor
```

## Quick start

```bash
cavewoman install --target cursor --mode structured --scope global
cavewoman install --target claude-code --mode ultra
cavewoman status
cavewoman switch-mode balanced
cavewoman uninstall --target cursor
```

If you omit flags on `install`, cavewoman prompts interactively (TTY only).

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
- `lastInstalledTarget`: used by `switch-mode` refresh + `uninstall` default
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
