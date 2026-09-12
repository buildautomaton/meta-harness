## Launch message

I'm open sourcing what I've been building for the last 5 months!

If you have a second, please star the project. Also follow the project on X at https://x.com/BuildAutomaton and me at https://x.com/rchodava. This would help me out a lot! You'll also get updates as I add to it incrementally.

This isn't an official launch of the open source project. That will hopefully come in a few weeks.

Till then, I will be incrementally adding packages to the big monorepo.

Why am I doing it this way? Mainly because there is a lot of code! And I want to re-architect it and make it more useful as individual projects, as well as a cohesive whole. And this will take time, even with agents writing and refactoring the code.

The overall idea here is to create an open-source meta-harness. A set of projects built on a core framework that supports multiple agent harnesses. It comes from the old (in AI time) notion that we are hoping not for a monotheistic AI agent but a polytheistic world of many agents (and harnesses). We want to create an open source framework that lets anyone build on this polytheistic world of many agent harnesses. Switch to the one with the capabilities and price point you need (or have another agent do the picking for you).

As with anything in AI, there are many engineers working on similar projects. But not many that are explicitly structured as meta-harnesses. And not many of those are built on the open Agent Client Protocol (ACP).

Furthermore, I haven't seen any that are explicitly architected around a CLI bridge at the core to support not only an ADE but also to allow you to take any compute infrastructure you own and run any agent harness on it.

That's the uniqueness of it. More to come!

# @buildautomaton/meta-harness

A monorepo for meta-harness tooling.

## Project structure

- `packages/agent-runtime`: ACP runtime (`src/runtime/{core,harnesses,session,transport,tools}`) plus plugins (`src/plugins/`)
  - `coreSet({ options, hooks, implementation, runtime })`: builtin harnesses, disk/stream sessions, subagent tools, MCP and remote transports
  - Tools plugin: `launch_subagent`, `get_session`
- `packages/cli`: thin CLI that registers `coreSet()` (MCP stdio or HTTP remote)

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
for the plugin architecture and available plugins.

### CLI

```bash
pnpm --filter @buildautomaton/cli build
pnpm --filter @buildautomaton/cli test
```

See [`packages/cli/README.md`](packages/cli/README.md).
