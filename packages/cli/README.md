# @buildautomaton/cli

Thin CLI around `@buildautomaton/agent-runtime`. It only parses flags and registers `coreSet()`.

```text
meta-harness  →  coreSet (harnesses + disk + subagent tools + MCP or remote)
              →  createRuntime / runRuntime
```

## Tools

The MCP (or remote) server exposes two tools:

| Tool | Arguments | Result |
| --- | --- | --- |
| `launch_subagent` | `harness`, `prompt`, optional `model` | `{ sessionId }` — runs in the CLI working directory |
| `get_session` | `sessionId` | status plus a summary of the last transcript |

Sessions are stored on disk (`<cwd>/.harness/sessions` by default) via `diskSessionPlugin`.

## Usage

```bash
pnpm --filter @buildautomaton/cli build
node packages/cli/dist/cli.js --cwd /path/to/repo
```

MCP stdio is the default transport (for Cursor / Claude Desktop MCP configs).

```bash
# Remote HTTP registration instead of stdio MCP
meta-harness --transport remote --remote-url https://control.example
```

| Flag | Meaning |
| --- | --- |
| `--cwd <path>` | Working directory for launched subagents |
| `--sessions-dir <path>` | Disk session directory |
| `--backend disk\|stream` | Disk (default) or in-memory stream wrap |
| `--transport mcp\|remote` | stdio MCP (default) or remote adapter |
| `--remote-url <url>` | Required with `--transport remote` |
| `--verbose` | Log to stderr |

## Plugins registered

`coreSet()` from agent-runtime:

- `cursorHarnessPlugin` / `codexHarnessPlugin` / `kiroHarnessPlugin` / `claudeCodeHarnessPlugin` / `opencodeHarnessPlugin`
- `diskSessionPlugin` — persist sessions and transcripts
- `subagentToolsPlugin` — `launch_subagent` and `get_session`
- `streamSessionPlugin` — when `--backend stream`
- `mcpTransportPlugin` or `remoteTransportPlugin` (HTTP adapter from `--remote-url`)

Add more by calling `createRuntime` from `@buildautomaton/agent-runtime` instead of this binary.

## Development

```bash
pnpm --filter @buildautomaton/cli build
pnpm --filter @buildautomaton/cli test
pnpm --filter @buildautomaton/cli type-check
```
