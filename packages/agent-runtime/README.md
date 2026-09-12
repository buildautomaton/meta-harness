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
| `src/plugins/` | Concrete plugins and `coreSet()` |

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
| `tools` | `SubagentToolsOptions` | `ToolsHooks` | `ToolsImplementation` |

```ts
import {
  createRuntime,
  cursorHarnessPlugin,
  diskSessionPlugin,
  mcpTransportPlugin,
  subagentToolsPlugin,
} from '@buildautomaton/agent-runtime';

const runtime = await createRuntime({
  cwd: process.cwd(),
  plugins: [
    cursorHarnessPlugin(),
    diskSessionPlugin({ options: { dir: '.harness/sessions' } }),
    subagentToolsPlugin(),
    mcpTransportPlugin(),
  ],
});

await runtime.start();
```

`coreSet({ options, hooks, implementation, runtime })` is the usual bundle used by the CLI. It includes every built-in harness plugin plus disk sessions, subagent tools, and MCP (or remote).

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

- **`diskSessionPlugin({ options: { dir } })`** — `{id}.json` metadata + `{id}.jsonl` transcript. Default dir: `<cwd>/.harness/sessions`.
- **`streamSessionPlugin()`** — wraps the current backend with in-memory `subscribe()`.

### Transports

- **`mcpTransportPlugin()`** — JSON-RPC MCP over stdin/stdout.
- **`remoteTransportPlugin({ implementation })`** — register with a control plane. `createHttpRemoteAdapter(url)` POSTs `/register`, polls `/commands`, POSTs `/results`.

### Tools — `subagentToolsPlugin()`

`launch_subagent` — `{ harness, prompt, model? }` in the runtime working directory; returns `{ sessionId }` immediately and runs the agent in the background.

`get_session` — `{ sessionId }` → status plus a **summary** (last portion of the transcript).

Permissions default to auto-allow so headless MCP/remote hosts do not stall. Override with `host.resolvePermission`.

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
