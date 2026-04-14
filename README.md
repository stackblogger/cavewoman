# cavewoman

Universal AI response optimizer CLI. Installs concise, structured, low-fluff guidance into different coding agents (Cursor, Claude, ChatGPT, Codex, Windsurf, generic prefix workflows).

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
cavewoman install --target claude --mode ultra
cavewoman status
cavewoman switch-mode balanced
cavewoman uninstall --target cursor
```

If you omit flags on `install`, cavewoman prompts interactively (TTY only).

## Supported agents

| Target | What it does |
| --- | --- |
| `cursor` | Writes a `SKILL.md` skill under `~/.agents/skills/cavewoman` (global) or `./.agents/skills/cavewoman` (project) |
| `claude` | Saves a sticky system prompt file under `~/.cavewoman` and copies it to clipboard |
| `chatgpt` | Same clipboard workflow as Claude, separate saved file |
| `codex` | Writes `~/.cavewoman/codex-prefix.txt` and a `~/.cavewoman/bin/cavewoman-codex` wrapper (expects a `codex` CLI; adjust if flags differ) |
| `windsurf` | Writes `~/.cavewoman/windsurf-prefix.txt` for Cascade-style persistent instructions |
| `generic` | Writes `~/.cavewoman/generic-prefix.txt` to prepend manually |

## Configuration

`~/.cavewomanrc` (JSON):

- `defaultTarget`: default agent id
- `defaultMode`: `balanced` | `structured` | `ultra`
- `lastInstalledTarget`: used by `switch-mode` refresh + `uninstall` default
- `lastScope`: `global` | `project` (mainly Cursor paths)
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
