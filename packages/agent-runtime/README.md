# @buildautomaton/agent-runtime

ACP agent runtime for CLI hosts: discover local agents, probe capabilities, run prompts, and stream plans, todos, permissions, and file changes.

Use this package when you want to **build a CLI (or other Node host) around local coding agents**, without re-implementing Agent Client Protocol subprocesses, provider detection, or turn routing.

```text
Your CLI  →  AgentRuntimeManager  →  providers (Cursor, Codex, Claude Code, …)
                                      →  ACP subprocess over stdio
                                      →  session updates / requests / prompt results
```

## Who this is for

| You are… | Use |
| --- | --- |
| Building a custom agent CLI, REPL, or local harness | This library |
| Connecting agents to BuildAutomaton's hosted control plane | [`@buildautomaton/cli`](https://github.com/rchodava/buildautomaton/tree/main/packages/cli) / [`@buildautomaton/bridge`](https://github.com/rchodava/buildautomaton/tree/main/packages/bridge) (they consume this runtime) |
| Implementing a new ACP agent binary | The [Agent Client Protocol](https://agentclientprotocol.com/) spec, then optionally a provider here |

The runtime is the **library**. Your CLI owns argv parsing, TTY UX, config files, and process lifecycle. This mirrors the split used by strong open-source stacks (Commander/oclif for commands, Ink for UI, a domain library for the real work).

## Install

This package lives in the Metaharness monorepo and is currently private (`"private": true`). From the workspace:

```bash
pnpm install
pnpm --filter @buildautomaton/agent-runtime build
```

```ts
import {
  createAgentRuntimeManager,
  type AgentRuntimeManager,
  type AgentPromptResult,
} from '@buildautomaton/agent-runtime';
```

Requires **Node.js 18+**.

## Quick start

Minimal one-shot prompt against a local agent in a project directory:

```ts
import { randomUUID } from 'node:crypto';
import { createAgentRuntimeManager } from '@buildautomaton/agent-runtime';

const runtime = await createAgentRuntimeManager({
  log: (line) => console.error(line),
  isShutdownRequested: () => false,
});

const agents = await runtime.discoverAgents();
if (agents.length === 0) {
  console.error('No local ACP agents found on PATH.');
  process.exit(1);
}

runtime.setPreferredAgentType(agents[0]!.type);

await new Promise<void>((resolve) => {
  runtime.prompt({
    promptText: 'Summarize this repository in three bullets.',
    runId: randomUUID(),
    sessionId: 'dev',
    cwd: process.cwd(),
    sendResult: (result) => {
      if (!result.success) console.error(result.error ?? 'failed');
      else console.log(result.output ?? result.stopReason ?? 'ok');
      resolve();
    },
    sendSessionUpdate: (payload) => {
      // Stream tool calls, messages, plans, todos, …
      console.error(JSON.stringify(payload));
    },
    sendRequest: (payload) => {
      // Interactive: permissions, plans, questions.
      // When the user answers: runtime.resolveRequest(requestId, result)
      console.error('request', JSON.stringify(payload));
    },
  });
});

await runtime.disconnect();
```

`prompt()` is **fire-and-forget**. Completion always arrives through `sendResult`. Mid-turn traffic uses `sendSessionUpdate` and optional `sendRequest`.

## Building a CLI on top

Treat agent-runtime like a domain SDK. Keep CLI concerns outside the library.

### Suggested layout

```text
my-agent-cli/
  src/
    cli.ts                 # argv (Commander, oclif, Pastel, …)
    commands/
      run.ts               # one-shot prompt
      repl.ts              # multi-turn session
      agents.ts            # discover / probe
    host/
      log.ts
      session-store.ts     # ClientHostHooks persistence
      permissions.ts       # resolveRequest UI
    runtime.ts             # createAgentRuntimeManager once
  package.json             # "bin": { "my-agent": "./dist/cli.js" }
```

### Wiring pattern

1. Parse flags (`--cwd`, `--agent`, `--mode`, `--json`).
2. Create **one** `AgentRuntimeManager` for the process.
3. Discover or accept an explicit `agentType`.
4. For each turn, mint a `runId` and call `prompt`.
5. Render updates to the TTY (plain logs, Ink, or `--json` lines).
6. On SIGINT: `cancelRun(runId)` for the active turn, then `disconnect()`.

```ts
// src/runtime.ts
import { createAgentRuntimeManager } from '@buildautomaton/agent-runtime';
import { createHostHooks } from './host/session-store.js';

let singleton: ReturnType<typeof createAgentRuntimeManager> | null = null;

export function getRuntime() {
  if (!singleton) {
    singleton = createAgentRuntimeManager({
      log: (m) => console.error(m),
      clientInfo: { name: 'my-agent-cli', version: '0.1.0' },
      isShutdownRequested: () => shuttingDown,
      clientHostHooks: createHostHooks(),
    });
  }
  return singleton;
}
```

Reference host in BuildAutomaton: [`packages/bridge`](https://github.com/rchodava/buildautomaton/tree/main/packages/bridge) uses the manager for discovery and capability probes, and mirrors the same prompt orchestration patterns for a full agent bridge CLI.

## Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│  CLI host (argv, TTY, config, SIGINT)                       │
│    createAgentRuntimeManager({ log, clientHostHooks, … })   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  AgentRuntimeManager                                        │
│  · discoverAgents / probeCapabilities / registerProvider    │
│  · prompt / cancelRun / resolveRequest / disconnect         │
│  · one ACP subprocess per (scopeId × agent identity)        │
└────────────────────────────┬────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
   Provider registry    Prompt routing     Client lifecycle
   (detect/install/     (runId → session)  (spawn/reuse/
    createClient)                           persist/resume)
          │
          ▼
   ACP agent subprocess (stdio JSON-RPC)
          │
          ├── session updates  → sendSessionUpdate
          ├── requests         → sendRequest  → resolveRequest
          └── prompt result    → sendResult
```

### Layers (source map)

| Layer | Responsibility | Location |
| --- | --- | --- |
| Public API | Single entrypoint | `src/index.ts` |
| Manager | Host-facing orchestration | `src/manager/` |
| Providers | Per-agent detect / install / spawn | `src/providers/` |
| Client lifecycle | Acquire, spawn, default request mapping | `src/client-lifecycle/` |
| Transports | SDK stdio + Cursor JSON-RPC wire | `src/clients/`, `src/providers/cursor/` |
| Types | Contracts for hosts | `src/types/` |

## Core concepts

### Identifiers

| Id | Who owns it | Purpose |
| --- | --- | --- |
| `runId` | Host (**required** for prompts) | One prompt turn; cancel key; stamped on results |
| `sessionId` | Host | Logical session for routing UI / cloud mapping |
| `scopeId` | Host (defaults to `sessionId`) | Isolates ACP subprocesses (`scopeId` × agent key) |
| `acpSessionId` | Agent subprocess | Protocol session; persist/resume via host hooks |
| `promptId` | Host (optional) | Correlation id echoed on `AgentPromptResult` |
| `agentType` | Host or preferred fallback | Selects a registered provider |

Missing `runId` → the prompt is ignored (logged only). Missing agent type → `sendResult({ success: false, error: 'No agent type: …' })`.

### Built-in providers

| `type` | Display name | Detect | Install | Runnable prompts |
| --- | --- | --- | --- | --- |
| `cursor-cli` | Cursor | yes | yes (`CURSOR_API_KEY`) | yes |
| `codex-acp` | Codex | yes | yes (`OPENAI_API_KEY`) | yes |
| `claude-code` | Claude Code | yes | yes (`ANTHROPIC_API_KEY`) | yes |
| `kiro-acp` | Kiro | yes | no | yes |
| `opencode` | OpenCode | no | yes | not yet (install-only) |

Only providers with `detectPresence` appear in `discoverAgents()`. A provider needs `createClient` and a non-empty `defaultCommand` to run prompts.

### Session update and request kinds

Normalized kinds for CLI UIs (`AgentSessionUpdateKind` / request mapping):

- Streaming: `message`, `tool_call`, `tool_call_update`, `task`
- First-class planning: `plan`, `todos`
- Interactive: `permission`, `question`
- Meta: `config_option_update`, `available_commands_update`, `session_info_update`

Default request mapping (when you do not supply custom `buildSessionCallbacks`):

| ACP / vendor method | `kind` |
| --- | --- |
| `cursor/create_plan` | `plan` |
| `cursor/update_todos` | `todos` |
| `cursor/task` | `task` |
| `session/request_permission` | `permission` |
| other | `question` |

## Common scenarios

### 1. Agent development environment

Typical loop for a local coding agent CLI:

```ts
const runtime = await getRuntime();
const cwd = flags.cwd ?? process.cwd();

// Optional: show which agents this machine can run
const available = await runtime.discoverAgents();

// Optional: load modes / slash commands for your TUI
const caps = await runtime.probeCapabilities('cursor-cli', { cwd });

runtime.prompt({
  promptText: flags.prompt,
  runId: randomUUID(),
  sessionId: flags.session ?? 'local',
  scopeId: flags.session ?? 'local',
  agentType: flags.agent ?? available[0]?.type,
  mode: flags.mode, // provider-specific session mode
  agentConfig: flags.config, // provider config options
  cwd,
  sendResult: handleResult,
  sendSessionUpdate: renderUpdate,
  sendRequest: presentInteractiveRequest,
});
```

Use a stable `scopeId` per workspace or chat so the runtime **reuses** the same ACP subprocess and can resume a persisted `acpSessionId`.

### 2. Discover and choose an agent

```ts
const agents = await runtime.discoverAgents();
// [{ type: 'cursor-cli', displayName: 'Cursor' }, …]

runtime.setPreferredAgentType(agents[0]!.type);
// Prefer passing agentType on each prompt when the user picks explicitly.
```

### 3. Probe capabilities (modes, slash commands)

```ts
const caps = await runtime.probeCapabilities('claude-code', {
  cwd: '/path/to/repo',
  signal: AbortSignal.timeout(12_000),
});
// { agentType, configOptions, availableCommands } | null
```

Use this to populate a CLI `--mode` picker or slash-command help before the first prompt.

### 4. Handle permissions, plans, and questions

```ts
runtime.prompt({
  // …
  sendRequest: async (payload) => {
    const { requestId, kind, params } = unwrapRequest(payload);

    if (kind === 'permission') {
      const decision = await askUserToAllowTool(params);
      runtime.resolveRequest(requestId, decision);
      return;
    }

    if (kind === 'plan') {
      const edited = await openPlanInEditor(params);
      runtime.resolveRequest(requestId, edited);
      return;
    }

    // questions / todos / task: same resolveRequest contract
    runtime.resolveRequest(requestId, await promptUser(params));
  },
});
```

For unattended environments, auto-approve only with an explicit flag (see bridge's dangerous auto-approve path as a reference, not a default).

### 5. Cancel a turn

```ts
process.on('SIGINT', async () => {
  if (activeRunId) await runtime.cancelRun(activeRunId);
  await runtime.disconnect();
  process.exit(130);
});
```

`cancelRun` returns `true` when the run is registered and cancel was sent (or marked pending while the agent is still starting). Cancelled turns typically finish with `success: false`.

### 6. Persist and resume sessions

Inject `ClientHostHooks` so the host owns storage (file, SQLite, in-memory):

```ts
const runtime = await createAgentRuntimeManager({
  log: console.error,
  clientHostHooks: {
    readPersistedSession: (scopeId) => store.get(scopeId),
    writePersistedSession: (info) => store.set(info.scopeId, info),
    persistAvailableCommands: (info) => store.setCommands(info),
    buildMcpServers: ({ accessPort }) =>
      accessPort ? [{ name: 'local', /* … */ }] : [],
    buildSessionCallbacks: ({ resolveRouting, sendSessionUpdate, sendRequest, log }) => ({
      onSessionUpdate: (params) => sendSessionUpdate(params),
      onRequest: (request) => sendRequest(request),
      onFileChange: (evt) => {
        log(`file change ${evt.path}`);
        sendSessionUpdate({ type: 'file_change', ...evt });
      },
    }),
  },
});
```

The runtime passes `persistedAcpSessionId` into the client when present and writes back on `onAcpSessionEstablished` / config updates.

### 7. Multi-turn REPL

Keep `sessionId` / `scopeId` constant; mint a new `runId` per user message. Do not call `disconnect()` between turns unless you want a cold agent process.

### 8. Graceful process exit

```ts
let shuttingDown = false;

const runtime = await createAgentRuntimeManager({
  log: console.error,
  isShutdownRequested: () => shuttingDown,
});

async function shutdown() {
  shuttingDown = true;
  await runtime.disconnect();
}
```

Discovery, capability probes, and spawns respect `isShutdownRequested` and bail out early.

## Patterns

### Host owns UX; runtime owns ACP

Do not put Ink components, Commander commands, or chalk formatting inside provider code. Pass plain callbacks (`sendResult`, `sendSessionUpdate`, `sendRequest`) and render in the CLI layer. That keeps the library testable and reusable from headless services.

### One manager per process

Create a single manager and reuse it. Subprocess isolation is keyed by `scopeId` and agent identity, not by creating more managers.

### Structured output modes

Support both human and machine output in the CLI:

- Human: pretty tool-call lines, spinners, permission prompts
- `--json`: one JSON object per update / result on stdout

The runtime always gives you structured callbacks; formatting is your job.

### MCP and local tools

Use `ClientHostHooks.buildMcpServers` / `getAccessPort` to attach host MCP servers when acquiring a client. Keep MCP server construction in the host so secrets and ports stay out of the library.

### Prefer explicit `agentType`

`setPreferredAgentType` is first-call-wins fallback for hosts that configure agents once. Interactive CLIs should pass `agentType` on each `prompt`.

## Error handling

Results are reported on `AgentPromptResult`, not thrown from `prompt()`:

```ts
type AgentPromptResult = {
  success: boolean;
  stopReason?: string;
  output?: string;
  error?: string;
  runId?: string;
  sessionId?: string;
  promptId?: string;
};
```

| Situation | Typical result |
| --- | --- |
| No `runId` | Prompt ignored (log only) |
| No agent type / unknown provider | `success: false`, clear error string |
| Spawn / cwd failure | `success: false`, spawn error (also stored as last start error) |
| Auth failure (provider `authErrorHints`) | `success: false`, stderr/message suggesting login |
| User cancel | `success: false` (e.g. stopped / cancelled) |
| Model refusal | `success: false`, refusal message |
| Capability probe failure / shutdown | `null` from `probeCapabilities` |

CLI guidance:

1. Always handle `success: false` in `sendResult`.
2. Map auth-looking errors to a "run login / set API key" UX (providers expose `authErrorHints`; bridge uses `localAgentErrorSuggestsAuth`-style checks).
3. On SIGINT, cancel then disconnect; do not leave orphaned ACP children.
4. For `--json` CLIs, print the error object and exit non-zero; do not mix human logs on stdout.

## Extending: custom providers

```ts
runtime.registerProvider({
  type: 'my-agent',
  displayName: 'My Agent',
  defaultCommand: ['my-agent', 'acp'],
  authErrorHints: [/not authenticated/i, /login required/i],
  detectPresence: async () => {
    // PATH / version check
    return true;
  },
  install: {
    detectCommand: 'my-agent',
    tokenEnvVar: 'MY_AGENT_TOKEN',
    async run(ctx) {
      ctx.onProgress?.('Installing my-agent…');
      // install binary + authenticate using ctx.authToken / ctx.env
    },
  },
  createClient: async (options) => {
    // Spawn ACP stdio, return AcpClientHandle
    return myCreateClient(options);
  },
  buildSpawnCommand: (base, sessionMode, agentConfig) => [...base],
});
```

Same `type` replaces an existing registration. OpenCode in-tree is an example of an **install-only** provider (`defaultCommand: []`, no `createClient`) until the ACP client is wired.

## API overview

```ts
createAgentRuntimeManager(options: AgentRuntimeManagerOptions): Promise<AgentRuntimeManager>
```

**Manager**

| Method | Description |
| --- | --- |
| `registerProvider` / `getProvider` / `listProviders` | Provider registry |
| `discoverAgents()` | PATH presence probes |
| `probeCapabilities(agentType, opts?)` | Short-lived ACP handshake |
| `setPreferredAgentType(agentType)` | Fallback when prompts omit `agentType` |
| `prompt(options)` | Start a turn (callbacks for result / updates / requests) |
| `cancelRun(runId)` | Cancel the streaming turn |
| `isRegisteredRun(runId)` | Whether routing still knows this turn |
| `resolveRequest(requestId, result)` | Answer permission / plan / question |
| `disconnect()` | Graceful teardown of all ACP clients |

**Constructor options:** `log`, `reportAgentCapabilities?`, `clientHostHooks?`, `isShutdownRequested?`, `clientInfo?`.

See `src/types/` for full TypeScript contracts (`AgentPromptOptions`, `ClientHostHooks`, `AgentProvider`, `AcpClientHandle`, …).

## Development

```bash
pnpm --filter @buildautomaton/agent-runtime build
pnpm --filter @buildautomaton/agent-runtime type-check
pnpm --filter @buildautomaton/agent-runtime test
```

Keep new source files under **100 lines** (see root `AGENTS.md`): one concern per file, thin compose modules, shared types in siblings.

## Contributing

1. Prefer extending **providers** or **host hooks** over growing the manager API.
2. Match existing patterns: small files, explicit dependency params, no "action bag" hooks that compose context into callback objects.
3. Add focused unit tests next to the code you change (see `src/providers/cursor/*.test.ts` and routing/permission tests).
4. Do not introduce CLI UI frameworks into this package; keep those in the consuming CLI.
5. When adding a provider: implement `type`, `displayName`, `defaultCommand`, `authErrorHints`, `buildSpawnCommand`, and usually `detectPresence` + `createClient`. Document required env vars in this README table.
6. Run build, type-check, and tests before opening a PR.

Useful references:

- Library entry: `src/index.ts`
- Manager factory: `src/manager/create-agent-runtime-manager.ts`
- Host integration (discovery today): [bridge `get-bridge-agent-runtime.ts`](https://github.com/rchodava/buildautomaton/blob/main/packages/bridge/src/agents/get-bridge-agent-runtime.ts)
- Full prompt/bridge UX twin: [bridge `src/agents/acp/`](https://github.com/rchodava/buildautomaton/tree/main/packages/bridge/src/agents/acp)

## Related packages

- [`@buildautomaton/bridge`](https://github.com/rchodava/buildautomaton/tree/main/packages/bridge) – local bridge CLI (ACP, git/worktrees, control-plane plugin)
- [`@buildautomaton/cli`](https://github.com/rchodava/buildautomaton/tree/main/packages/cli) – BuildAutomaton-hosted bridge plugin on top of bridge

## License

Private package in the Metaharness monorepo. Distribution follows the repository's licensing terms.
