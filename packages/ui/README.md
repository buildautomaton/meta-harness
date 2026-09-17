# @buildautomaton/ui

Composable dashboard for the local development environment. Same plugin shape as `@buildautomaton/agent-runtime`: a small kernel, contributed surfaces, and a design system plugins can reuse.

```text
Host (Vite app or embedder)
  → createUi({ plugins })
  → applyUiPlugins → UiSlots
  → Dashboard shell (nav + centered feed)
```

## Plugin kinds

| Kind | Role |
| --- | --- |
| `provider` | React context providers (work client, theme, future auth) |
| `surface` | Views contributed to named panels |
| `theme` | Optional; design tokens live in `src/design/tokens.css` |

The dashboard shell is a narrow nav plus a centered feed column (`main`). Plugins register views into those panels.

```ts
import { createUi, workUiPlugin } from '@buildautomaton/ui';

const { App } = createUi({ plugins: [workUiPlugin()] });
```

The work plugin talks to the local-cli HTTP API (`/api/work`, `/api/artifacts` on the same HTTP server as MCP tools). Completed artifacts show as a Twitter-style feed of cards with HTML thumbnails. Artifacts with no work item still appear (title **Unnamed** if empty). Click a thumbnail to open a full preview.

## Design system

`src/design` ports the IDE/UI tokens (`--background`, `--card`, …) plus Button, Card, Tabs, fields, EmptyState, and multiple-choice radios. Import `@buildautomaton/ui/design`.

## Develop

Run `local-cli` first (HTTP server: MCP tools at `/mcp`, work at `/api` on port 3333), then:

```bash
pnpm --filter @buildautomaton/ui dev
```
