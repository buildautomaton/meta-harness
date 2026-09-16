# @buildautomaton/ui

Composable dashboard for the local development environment. Same plugin shape as `@buildautomaton/agent-runtime`: a small kernel, contributed surfaces, and a design system plugins can reuse.

```text
Host (Vite app or embedder)
  → createUi({ plugins })
  → applyUiPlugins → UiSlots
  → Dashboard shell (nav / sidebar / main panels)
```

## Plugin kinds

| Kind | Role |
| --- | --- |
| `provider` | React context providers (work client, theme, future auth) |
| `surface` | Views contributed to named panels |
| `theme` | Optional; design tokens live in `src/design/tokens.css` |

The dashboard defines three panels: `nav`, `sidebar`, and `main`. Plugins register generic views into those panels — a sidebar list is the same kind of contribution as a full content area.

```ts
import { createUi, workUiPlugin } from '@buildautomaton/ui';

const { App } = createUi({ plugins: [workUiPlugin()] });
```

The work plugin talks to the local-cli HTTP API (`/api/work`, `/api/artifacts`). Swap `createHttpWorkClient` for a cloud client later; the surfaces stay the same.

## Design system

`src/design` ports the IDE/UI tokens (`--background`, `--card`, …) plus Button, Card, Tabs, fields, EmptyState, and multiple-choice radios. Import `@buildautomaton/ui/design`.

## Develop

Run `local-cli` first (MCP + work API on port 3333), then:

```bash
pnpm --filter @buildautomaton/ui dev
```
