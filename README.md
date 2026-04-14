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

**Documentation:** [cavewoman](https://opensource.stackblogger.com/cavewoman/)

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

Follow on-screen prompts to configure it.

### Option 2: Run without installation

```bash
npx cavewoman
```

Runs instantly — no install needed.

## Common commands

### Switch mode

Change the mode for the last agent that you configured. Available modes are - `balanced`, `structured`, or `ultra`

Note: You can either specify the mode directly in the command or run `cavewoman switch` without specifying any mode. It will show the available modes where you can choose one and hit enter to install.

```bash
cavewoman switch ultra
```

### Configure another agent (change target)

Run `cavewoman` or `npx cavewoman` and follow on-screen prompts to select a different coding agent.

Supported coding agents:

- Cursor (`cursor`)
- Claude Code (`claude-code`)
- ChatGPT (`chatgpt`)
- Gemini CLI (`gemini`)
- Codex CLI (`codex`)
- Windsurf (`windsurf`)
- Other (`generic`) — fallback when your tool is not in the list above

### Check status

```bash
cavewoman status
```

Get the status of configured coding agent, target, scope and mode.

### Uninstall

```bash
cavewoman uninstall
cavewoman uninstall -t cursor
cavewoman uninstall -t chatgpt -s global
```

If you don't provide `-t` or target, it will uninstall the `cavewoman` CLI from the last installed coding agent.

## How to use in each agent

| Target | Outputs (typical) | Invoke |
| ------ | ----------------- | ------ |
| `cursor` | `SKILL.md` → `~/.agents/skills/cavewoman` or `./.agents/skills/cavewoman` | `/cavewoman` per chat |
| `claude-code` | `.claude-plugin/plugin.json`, `skills/cavewoman/SKILL.md` under `~/.cavewoman/claude-code-plugin` or `./.cavewoman/claude-code-plugin` | `claude --plugin-dir <plugin-root>` (or marketplace install of same tree) |
| `chatgpt` | `~/.cavewoman/chatgpt-sticky-prompt.txt` (+ clipboard on `install`) | Paste → Custom instructions / project rules / system prompt (persistent until replaced) |
| `gemini` | `~/.gemini/extensions/cavewoman/` (`gemini-extension.json`, `GEMINI.md`) or `./.gemini/extensions/cavewoman/` | Restart CLI; enable extension; `/extensions` or `gemini extensions list` |
| `codex` | `~/.cavewoman/codex-prefix.txt`, `~/.cavewoman/bin/cavewoman-codex` | `export PATH="$HOME/.cavewoman/bin:$PATH"`; `cavewoman-codex "<prompt>"` → prefixes, calls `codex -p`; or prepend file if calling `codex` yourself |
| `windsurf` | `~/.cavewoman/windsurf-prefix.txt` | Paste into Cascade persistent instructions |
| `generic` | `~/.cavewoman/generic-prefix.txt` | Manual prepend to prompts |

## Configuration

`~/.cavewomanrc` (JSON):

- `defaultTarget`: default agent id
- `defaultMode`: `balanced` | `structured` | `ultra`
- `lastInstalledTarget`: used by `switch` refresh + `uninstall` default
- `lastScope`: `global` (this computer) | `project` (this repo)
- `preferences.cursorSkillsDir`: optional absolute override for Cursor skill root

Environment override:

- `CAVEWOMAN_CURSOR_SKILLS_DIR`: override Cursor skills base directory

## Modes

- `balanced`: concise, natural response with minimal fluff - best for readable answers
- `structured`: organized sections for clarity and quick action - best for debugging
- `ultra`: maximum compression guidance - best for frequently coders - it saves more money

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
npx cavewoman
```

## License

MIT
