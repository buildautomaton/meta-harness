# @buildautomaton/cli

Thin CLI around `@buildautomaton/agent-runtime`. It only parses flags and registers `coreSet()`.

```text
meta-harness  →  coreSet (harnesses + disk + minion tools + MCP or remote)
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

`spawn_minion` / `await_minion` stream progress and permission prompts on the in-flight MCP tool call (SSE + `notifications/progress` / elicitation). Do not poll `get_minion` in a loop. Resolve permissions with `resolve_minion_request` while those calls are still running. Permission and auth requests share one shape (`title`, `message`, labeled options). Sessions append `{id}.jsonl` while running, then compact to `{id}.json` (metadata + structured log) and `{id}.md` (messages).

The initialize **instructions** tell coordinators to use `spawn_minion` instead of Task, never pass `background`, and apply their current permission mode to in-flight minion permission notifications — resolving immediately if that mode would auto-run, or seeking the user if it would ask. Restart the MCP connection after upgrading.

Sessions are stored on disk (`<cwd>/.harness/sessions` by default) via `diskSessionPlugin`.

## Usage

```bash
pnpm --filter @buildautomaton/cli build
node packages/cli/dist/cli.js --cwd /path/to/repo
```

MCP HTTP on localhost is the default transport (`http://127.0.0.1:3333/mcp`).

```bash
meta-harness --cwd /path/to/repo --port 3333 --mcp-path /mcp

# Remote HTTP registration instead of local MCP
meta-harness --transport remote --remote-url https://control.example
```

| Flag | Meaning |
| --- | --- |
| `--cwd <path>` | Working directory for spawned minions |
| `--sessions-dir <path>` | Disk session directory |
| `--backend disk\|stream` | Disk (default) or in-memory stream wrap |
| `--transport mcp\|remote` | localhost MCP HTTP (default) or remote adapter |
| `--port <n>` | MCP HTTP port (default: `3333`) |
| `--mcp-path <path>` | MCP URL path (default: `/mcp`) |
| `--remote-url <url>` | Required with `--transport remote` |
| `--verbose` | Log to stderr |

## Plugins registered

`coreSet()` from agent-runtime:

- `cursorHarnessPlugin` / `codexHarnessPlugin` / `kiroHarnessPlugin` / `claudeCodeHarnessPlugin` / `opencodeHarnessPlugin`
- `diskSessionPlugin` — `{id}.jsonl` while running; compact to `{id}.json` (metadata + log) and `{id}.md`
- `minionToolsPlugin` — one tools plugin: `spawn_minion`, `await_minion`, `get_minion_transcript`, `resolve_minion_request`
- `streamSessionPlugin` — when `--backend stream`
- `mcpTransportPlugin` or `remoteTransportPlugin` (HTTP adapter from `--remote-url`)

Add more by calling `createRuntime` from `@buildautomaton/agent-runtime` instead of this binary.

## Development

```bash
pnpm --filter @buildautomaton/cli build
pnpm --filter @buildautomaton/cli test
pnpm --filter @buildautomaton/cli type-check
```
