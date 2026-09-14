# @buildautomaton/agent-runtime

ACP agent runtime with a small kernel and a catalog of plugins.

```text
CLI  →  createRuntime({ plugins: coreSet({ options, hooks, implementation, runtime }) })
     →  ACP manager (runtime/core)
     →  harness / session / transport / tools plugins
```

## Who this is for

| You are… | Use |
| --- | --- |
| Building a CLI or Node host around local coding agents | This library + `coreSet()` or individual plugins |
| Shipping the default MCP CLI | [`@buildautomaton/cli`](../cli) |

The **runtime** owns ACP subprocesses, prompt routing, and plugin interfaces. Hosts stay small: parse argv, pick plugins, call `createRuntime` / `runRuntime`.

## Install

```bash
pnpm install
pnpm --filter @buildautomaton/agent-runtime build
```

```ts
import { createRuntime, coreSet } from '@buildautomaton/agent-runtime';

const runtime = await createRuntime({
  cwd: process.cwd(),
  plugins: coreSet({ options: { cwd: process.cwd() } }),
});
```

Requires **Node.js 18+**. Plugins are also exported from `@buildautomaton/agent-runtime/plugins`.

## Layout

| Folder | Holds |
| --- | --- |
| `src/types/` | Public plugin contracts: options, hooks, implementation |
| `src/runtime/core/` | `createRuntime`, plugin kernel, ACP manager |
| `src/runtime/harnesses/` | ACP client, install, discovery |
| `src/runtime/session/` | Session runtime helpers |
| `src/runtime/transport/` | Transport runtime helpers |
| `src/runtime/tools/` | Tools runtime helpers |
| `src/plugins/` | `coreSet()` plus one folder per plugin (`harnesses/cursor`, `session/disk`, `tools/minion`, `transport/mcp`, …) |

`createRuntime` does not register plugins on its own. It requires a **session** plugin and a **transport** plugin.

## Plugin architecture

Every plugin factory takes one named-args object `{ options, hooks, implementation, runtime }`. Start with `src/types/`. Core applies plugins with internal setup calls — there is no public `PluginApi`.

| Piece | Meaning |
| --- | --- |
| **options** | Config data (`dir`, `remoteUrl`, …) |
| **hooks** | Notifications to the host (`onSessionUpdate`, `onStart`, …) |
| **implementation** | How the plugin does its work (simple functions) |
| **runtime** | `{ cwd, log }` at construction |

| Kind | Options | Hooks | Implementation |
| --- | --- | --- | --- |
| `harness` | `HarnessOptions` | `HarnessHooks` | `HarnessImplementation` |
| `session` | `DiskSessionOptions` / `StreamSessionOptions` | `SessionHooks` | `SessionImplementation` |
| `transport` | `McpTransportOptions` / `RemoteTransportOptions` | `TransportHooks` | `TransportImplementation` / `RemoteTransportImplementation` |
| `tools` | `ToolsOptions` | `ToolsHooks` | `ToolsImplementation` |

```ts
import {
  createRuntime,
  cursorHarnessPlugin,
  diskSessionPlugin,
  mcpTransportPlugin,
  minionToolsPlugin,
} from '@buildautomaton/agent-runtime';

const runtime = await createRuntime({
  cwd: process.cwd(),
  plugins: [
    cursorHarnessPlugin(),
    diskSessionPlugin({ options: { dir: '.harness/sessions' } }),
    minionToolsPlugin(),
    mcpTransportPlugin(),
  ],
});

await runtime.start();
```

`coreSet({ options, hooks, implementation, runtime })` is the usual bundle used by the CLI. It includes every built-in harness plugin plus disk sessions, MCP (or remote), and `minionToolsPlugin` unless `minionTools: false`. Register any other `kind: 'tools'` plugin beside it — minion tools are not the tools layer.

The ACP manager starts with an **empty** harness registry. Register harnesses through a plugin (or `manager.registerHarness`) before prompting.

## Available plugins

Located in `src/plugins/`.

### Harnesses

Each agent type is its own plugin. `coreSet()` / `coreHarnessPlugins()` include all of them:

| Plugin | `type` | Display name | Detect | Install | Prompts |
| --- | --- | --- | --- | --- | --- |
| `cursorHarnessPlugin` | `cursor-cli` | Cursor | yes | yes (`CURSOR_API_KEY`) | yes |
| `codexHarnessPlugin` | `codex-acp` | Codex | yes | yes (`OPENAI_API_KEY`) | yes |
| `claudeCodeHarnessPlugin` | `claude-code` | Claude Code | yes | yes (`ANTHROPIC_API_KEY`) | yes |
| `kiroHarnessPlugin` | `kiro-acp` | Kiro | yes | no | yes |
| `opencodeHarnessPlugin` | `opencode` | OpenCode | no | yes | not yet (install-only) |

### Sessions

- **`diskSessionPlugin({ options: { dir } })`** — `{id}.jsonl` event log while running; compact at the end to `{id}.md` messages and a structured `log` on `{id}.json`. Default dir: `<cwd>/.harness/sessions`.
- **`streamSessionPlugin()`** — wraps the current backend with in-memory `subscribe()`.

### Transports

- **`mcpTransportPlugin()`** — JSON-RPC MCP over localhost HTTP (Streamable HTTP POST + SSE GET). Options: `host`, `port`, `path` (defaults `127.0.0.1:3333/mcp`).
- **`remoteTransportPlugin({ implementation })`** — register with a control plane. `createHttpRemoteAdapter(url)` POSTs `/register`, polls `/commands`, POSTs `/results`.

### Tools

Any plugin with `kind: 'tools'` can register MCP tools via `ToolsImplementation` (`listTools` / `callTool`). Optional `instructions()` and `prompts()` supply MCP initialize instructions and `prompts/list` entries. The MCP transport does not contribute that text. Multiple tools plugins merge. **`minionToolsPlugin()`** is one such plugin:

`spawn_minion` — `{ harness, prompt, model?, background? }` waits like Task by default (streams MCP progress on the same tool call) and returns compacted agent messages. `background: true` returns `minionId` immediately.

`await_minion` — block until a minion finishes or needs the user, with live progress. Use after background spawn or after `resolve_minion_request`. Do not poll.

`get_minion_context` — working directory and harness list minions inherit.

`get_minion` / `get_minion_transcript` — status plus compacted **agent messages only** (no tool output or reasoning). Permission and auth requests use the same shape: `title`, `message`, and options with human-readable `label` plus `optionId`.

`resolve_minion_request` — approve/deny a minion permission (pass `optionId` or the label, e.g. Allow all) or store a provider API token.

While a spawn/await tool call is in flight, progress is sent as MCP `notifications/progress` (and `notifications/message`) on the Streamable HTTP SSE response so the coordinator sees updates without polling.

On disk, a running session appends `{id}.jsonl`. When it ends, that log is compacted to `{id}.md` (concatenated agent messages) and a structured `log` on `{id}.json` (messages, thoughts, and tool calls). The JSONL file is then removed.

Override permission handling with `hooks.resolvePermission` when you do not want to wait for the coordinator.

## Quick start (manager only)

```ts
import { randomUUID } from 'node:crypto';
import {
  createAgentRuntimeManager,
  BUILTIN_HARNESSES,
} from '@buildautomaton/agent-runtime';

const manager = await createAgentRuntimeManager({
  log: (line) => console.error(line),
  isShutdownRequested: () => false,
});
for (const harness of BUILTIN_HARNESSES) manager.registerHarness(harness);

manager.setPreferredHarnessType('cursor-cli');
manager.prompt({
  promptText: 'Summarize this repository in three bullets.',
  runId: randomUUID(),
  sessionId: 'dev',
  cwd: process.cwd(),
  sendResult: (result) => console.log(result.output ?? result.error),
  sendSessionUpdate: (payload) => console.error(JSON.stringify(payload)),
});
```

Prefer `createRuntime` for CLIs. `prompt()` is fire-and-forget; completion arrives through `sendResult`.

## Identifiers

| Id | Who owns it | Purpose |
| --- | --- | --- |
| `runId` | Host (**required** for prompts) | One prompt turn; cancel key |
| `sessionId` | Host | Logical session (runtime session id) |
| `scopeId` | Host (defaults to `sessionId`) | Isolates ACP subprocesses |
| `acpSessionId` | Agent subprocess | Protocol session; persist via host hooks |

## Custom plugins

```ts
const myTools: AgentRuntimePlugin = {
  name: 'my-tools',
  kind: 'tools',
  implementation: {
    listTools: () => [
      { name: 'ping', description: 'Health check', inputSchema: { type: 'object' } },
    ],
    callTool: async (name) => ({
      content: [{ type: 'text', text: name === 'ping' ? 'ok' : 'unknown' }],
    }),
  },
};
```

Or use a factory:

```ts
cursorHarnessPlugin({
  hooks: { onSessionUpdate: (e) => console.error(e) },
  implementation: { getAccessPort: () => 8080 },
});
```

Same `type` on `registerHarness` replaces an existing harness.

## API overview

```ts
createAgentRuntimeManager(options): Promise<AgentRuntimeManager>
createRuntime(options: RuntimeOptions): Promise<RuntimeHandle>
runRuntime(options: RuntimeOptions): Promise<void>
coreSet({ options, hooks?, implementation?, runtime? }): AgentRuntimePlugin[]
```

**Manager:** `registerHarness` / `getHarness` / `listHarnesses` / `discoverAgents` / `probeCapabilities` / `setPreferredHarnessType` / `prompt` / `cancelRun` / `isRegisteredRun` / `resolveRequest` / `disconnect`.

**Runtime handle:** `start` / `stop` / `manager`.

Constructor options: `log`, `reportAgentCapabilities?`, `clientHostHooks?`, `isShutdownRequested?`, `clientInfo?`.

## Development

```bash
pnpm --filter @buildautomaton/agent-runtime build
pnpm --filter @buildautomaton/agent-runtime type-check
pnpm --filter @buildautomaton/agent-runtime test
```

Keep new source files under **100 lines** (see root `AGENTS.md`).

## Related packages

- [`@buildautomaton/cli`](../cli) — MCP/remote CLI that registers `coreSet()`

## License

Private package in the [@buildautomaton/meta-harness](https://github.com/buildautomaton/meta-harness) monorepo.
