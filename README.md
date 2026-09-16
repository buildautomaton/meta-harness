# meta-harness

Swap out agents at will.

The industry keeps hoping for one true agent. This repo is built for the other outcome: a polytheistic world of many harnesses, and a way to switch among them when the job, the price, or the model changes — or to let another agent do the picking.

It is an MIT-licensed open-source meta-harness on the Agent Client Protocol (ACP): a small kernel, a catalog of plugins, and a CLI bridge so the same agents can run inside an ADE or on any compute you already own. Cursor today, Codex tomorrow, Claude Code when it fits — the host stays small. The plugins move.

Published on npm as [`@buildautomaton/agent-runtime`](https://www.npmjs.com/package/@buildautomaton/agent-runtime) and [`@buildautomaton/local-cli`](https://www.npmjs.com/package/@buildautomaton/local-cli).

## Architecture

The host (CLI or Node app) stays small. `@buildautomaton/agent-runtime` is the kernel: `createRuntime({ plugins })` fills slots for harness, session, transport, and tools.

See [`packages/agent-runtime/README.md`](packages/agent-runtime/README.md) for the plugin architecture, factories, types, and custom plugins, and [`packages/local-cli/README.md`](packages/local-cli/README.md) for the CLI.

## Project structure

- `packages/agent-runtime`: ACP runtime (`src/runtime/{core,acp,harnesses,session,transport,tools}`) plus plugins (`src/plugins/`)
- `packages/local-cli`: thin CLI that registers `coreSet()` (MCP HTTP or remote)

## Getting started

Install from npm:

```bash
npm install @buildautomaton/agent-runtime
npx @buildautomaton/local-cli --cwd /path/to/repo
```

From this repo:

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
pnpm --filter @buildautomaton/local-cli build
pnpm --filter @buildautomaton/local-cli test
```

## Publishing

`@buildautomaton/agent-runtime` and `@buildautomaton/local-cli` publish publicly to npm under the `@buildautomaton` org. Bump versions, then run `pnpm publish:packages`.

## License

MIT. See [LICENSE](LICENSE).
