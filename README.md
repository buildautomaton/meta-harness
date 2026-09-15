# @buildautomaton/meta-harness

Swap out agents at will.

The industry keeps hoping for one true agent. This repo is built for the other outcome: a polytheistic world of many harnesses, and a way to switch among them when the job, the price, or the model changes — or to let another agent do the picking.

It is an open-source meta-harness on the Agent Client Protocol (ACP): a small kernel, a catalog of plugins, and a CLI bridge so the same agents can run inside an ADE or on any compute you already own. Cursor today, Codex tomorrow, Claude Code when it fits — the host stays small. The plugins move.

## Architecture

The host (CLI or Node app) stays small. `@buildautomaton/agent-runtime` is the kernel: `createRuntime({ plugins })` fills slots for harness, session, transport, and tools.

See [`packages/agent-runtime/README.md`](packages/agent-runtime/README.md) for the plugin architecture, factories, types, and custom plugins, and [`packages/cli/README.md`](packages/cli/README.md) for the CLI.

## Project structure

- `packages/agent-runtime`: ACP runtime (`src/runtime/{core,harnesses,session,transport,tools}`) plus plugins (`src/plugins/`)
- `packages/cli`: thin CLI that registers `coreSet()` (MCP HTTP or remote)

## Getting started

1. Install dependencies:

```bash
pnpm install
```

2. Build packages:

```bash
pnpm build
```

3. Run tests:

```bash
pnpm test
```

## Development

The project uses Turborepo to manage the workspace. Each package can be
developed independently or together.

### Agent runtime

```bash
pnpm --filter @buildautomaton/agent-runtime build
pnpm --filter @buildautomaton/agent-runtime test
pnpm --filter @buildautomaton/agent-runtime type-check
```

### CLI

```bash
pnpm --filter @buildautomaton/cli build
pnpm --filter @buildautomaton/cli test
```
