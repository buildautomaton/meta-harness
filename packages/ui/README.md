# @buildautomaton/ui

Composable dashboard for the local development environment. Same plugin shape as `@buildautomaton/agent-runtime`: a small kernel, contributed surfaces, and a design system plugins can reuse.

```text
Host (Vite app or embedder)
  → createUi({ plugins })
  → applyUiPlugins → UiSlots
  → Dashboard shell (sidebar | master-detail | columns)
```

## Plugin kinds

| Kind | Role |
| --- | --- |
| `provider` | React context providers (work client, theme, future auth) |
| `surface` | Views contributed to named panels |
| `layout` | Chooses a constrained shell; last plugin that sets `layout` wins |
| `theme` | Optional; design tokens live in `src/design/tokens.css` |

Layouts are a small set, not free-form CSS. Plugins register views into the panels that layout owns:

| Layout | Panels | Shape |
| --- | --- | --- |
| `sidebar` | `nav`, `sidebar`, `main` | Rail, side pane, remaining main |
| `master-detail` | `nav`, `master`, `detail` | Rail, list, selected detail |
| `columns` | `nav`, `column`, `header` | Rail, equal columns, header overlay on the right |

```ts
import { createUi, workUiPlugin } from '@buildautomaton/ui';

const { App } = createUi({ plugins: [workUiPlugin()] });
```

The work plugin uses the **columns** layout: completed artifacts on the left, draft work plus a prompt composer on the right. Completed cards show numbered review questions. Artifacts with no work item still appear (title **Unnamed** if empty). Click a thumbnail to open a full preview.

Use `layoutPlugin('sidebar')` (or `master-detail` / `columns`) when another plugin should pick the shell. Shared `Column`, `PromptComposer`, and `NumberedQuestion` components live in the design system.

The work plugin talks to the local-cli HTTP API (`/api/work`, `/api/artifacts` on the same HTTP server as MCP tools).

## Design system

`src/design` ports the IDE/UI tokens (`--background`, `--card`, …) plus Button, Card, Tabs, fields, EmptyState, multiple-choice radios, column chrome, numbered questions, and the prompt composer. Import `@buildautomaton/ui/design`.

## Develop

Run `local-cli` first (HTTP server: MCP tools at `/mcp`, work at `/api` on port 3333), then:

```bash
pnpm --filter @buildautomaton/ui dev
```
