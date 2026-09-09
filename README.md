# Metaharness

A pnpm/Turborepo monorepo for local agent harness tooling.

## Project structure

- `packages/agent-runtime`: ACP agent runtime library
  - Discover local agents, probe capabilities, run prompts
  - Stream plans, todos, permissions, and file changes
  - TypeScript library for CLI and Node hosts

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

See [`packages/agent-runtime/README.md`](packages/agent-runtime/README.md)
for the host API and CLI integration patterns.
