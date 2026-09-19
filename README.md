# meta-harness

Swap out agents at will.

A small kernel, plugins you can mix, and a CLI so the same agents run on a laptop or any box you already own. Cursor today, Codex tomorrow, Claude Code when it fits.

MIT licensed. Built on the [Agent Client Protocol](https://agentclientprotocol.com/).

```text
local-cli
  ├── runtime              kernel, stores, HTTP, harnesses, minion tools
  └── product-director     runtime plugins (work, artifacts, tools)

ui
  ├── ui-runtime           kernel, design system, dashboard shells
  └── product-director     UI plugins (work surfaces)
```

| Package | npm |
| --- | --- |
| Kernel | [`@buildautomaton/runtime`](https://www.npmjs.com/package/@buildautomaton/runtime) |
| Work + artifacts | [`@buildautomaton/product-director`](https://www.npmjs.com/package/@buildautomaton/product-director) |
| CLI | [`@buildautomaton/local-cli`](https://www.npmjs.com/package/@buildautomaton/local-cli) |

```mermaid
flowchart LR
  cli["local-cli"]
  runtime["runtime"]
  director["product-director"]
  ui["ui"]
  uiRuntime["ui-runtime"]
  cli --> runtime
  cli --> director
  ui --> uiRuntime
  ui --> director
  ui -->|"/api/work"| director
  runtime --- director
```

Docs: [runtime](packages/runtime/README.md) · [product director](packages/product-director/README.md) · [CLI](packages/local-cli/README.md) · [UI runtime](packages/ui-runtime/README.md) · [UI](packages/ui/README.md)

## Try it

```bash
npx @buildautomaton/local-cli --cwd /path/to/repo
```

From this repo:

```bash
pnpm install
pnpm build
pnpm test
```

```bash
pnpm --filter @buildautomaton/runtime test
pnpm --filter @buildautomaton/product-director test
pnpm --filter @buildautomaton/local-cli test
pnpm --filter @buildautomaton/ui-runtime test
pnpm --filter @buildautomaton/ui dev
```

Public packages publish under `@buildautomaton`. Bump versions, then `pnpm publish:packages`.

## License

MIT. See [LICENSE](LICENSE).
