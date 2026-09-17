# @buildautomaton/local-cli

Thin CLI around `@buildautomaton/agent-runtime`. It only parses flags and registers `coreSet()`. MIT licensed.

```text
local-cli  →  coreSet (harnesses + disk + minion tools + sqlite work + HTTP, stdio, or remote)
              →  createRuntime / runRuntime
```

## Tools

The MCP (or remote) server exposes minion tools (not subagents, to avoid clashing with builtin agent tools):

| Tool | Arguments | Result |
| --- | --- | --- |
| `spawn_minion` | `harness`, `prompt`, optional `model` | Waits until done; returns transcript. No background parameter. |
| `await_minion` | `minionId` | Blocks with live progress until done. Use only if spawn already returned. |
| `get_minion_context` | none | cwd, harnesses, shared workspace note |
| `get_minion` | `minionId` | status, pending requests, compacted agent transcript |
| `get_minion_transcript` | `minionId` | agent messages only (no tool/reasoning dumps) |
| `resolve_minion_request` | `minionId`, optional `requestId`, `outcome`, `token` | approve/deny a permission or store a provider token |
| `ask_what_to_work_on` | none | Next draft plus a `sessionId` |
| `tell_what_was_built` | `title`, `description`, artifacts, optional `sessionId` / `questions` | Stores markdown, mermaid, HTML, and review questions |

`spawn_minion` / `await_minion` stream a short tool-call progress summary about every 10s on the in-flight MCP tool call (SSE + `notifications/progress`). Permission prompts use elicitation and are redelivered if missed; sampling applies the coordinator's permission mode when the client supports it. Do not poll `get_minion` in a loop.

The initialize **instructions** tell coordinators to use `spawn_minion` instead of Task, never pass `background`, and apply their current permission mode to in-flight minion permission notifications — resolving immediately if that mode would auto-run, or seeking the user if it would ask. Restart the MCP connection after upgrading.

Sessions are stored on disk (`<cwd>/.harness/sessions` by default) via `diskSessionPlugin`. Work is stored in WASM SQLite (`<cwd>/.harness/work.sqlite`). The HTTP transport mounts that work plugin at `/api` (`/api/work`, `/api/artifacts`) for the `@buildautomaton/ui` dashboard. MCP tools are at `/mcp` on the same server.

## Install

```bash
npm install -g @buildautomaton/local-cli
local-cli --cwd /path/to/repo
```

Or without a global install:

```bash
npx @buildautomaton/local-cli --cwd /path/to/repo
```

## Usage

From this repo:

```bash
pnpm --filter @buildautomaton/local-cli build
node packages/local-cli/dist/cli.js --cwd /path/to/repo
```

HTTP on localhost is the default transport (`http://127.0.0.1:3333/mcp` for MCP tools).

```bash
local-cli --cwd /path/to/repo --port 3333 --mcp-path /mcp

# MCP over stdio instead of HTTP
local-cli --transport stdio --cwd /path/to/repo

# Remote HTTP registration
local-cli --transport remote --remote-url https://control.example
```

| Flag | Meaning |
| --- | --- |
| `--cwd <path>` | Working directory for spawned minions |
| `--sessions-dir <path>` | Disk session directory |
| `--backend disk\|stream` | Disk (default) or in-memory stream wrap |
| `--transport http\|stdio\|remote` | HTTP (default), MCP stdio, or remote adapter |
| `--port <n>` | HTTP port (default: `3333`) |
| `--mcp-path <path>` | MCP tools URL path (default: `/mcp`) |
| `--remote-url <url>` | Required with `--transport remote` |
| `--verbose` | Log to stderr |

## Plugins registered

`coreSet()` from agent-runtime:

- `cursorHarnessPlugin` / `codexHarnessPlugin` / `kiroHarnessPlugin` / `claudeCodeHarnessPlugin` / `opencodeHarnessPlugin`
- `diskSessionPlugin` — `{id}.jsonl` while running; compact to `{id}.json` (metadata + log) and `{id}.md`
- `minionToolsPlugin` — one tools plugin: `spawn_minion`, `await_minion`, `get_minion_transcript`, `resolve_minion_request`
- `sqliteWorkPlugin` + `workToolsPlugin` — queue, artifacts, `ask_what_to_work_on` / `tell_what_was_built`
- `streamSessionPlugin` — when `--backend stream`
- `httpTransportPlugin` (MCP at `/mcp`, work at `/api`), `stdioTransportPlugin`, or `remoteTransportPlugin`

Add more by calling `createRuntime` from `@buildautomaton/agent-runtime` instead of this binary.

## Development

```bash
pnpm --filter @buildautomaton/local-cli build
pnpm --filter @buildautomaton/local-cli test
pnpm --filter @buildautomaton/local-cli type-check
```

## License

MIT. See [LICENSE](LICENSE).
