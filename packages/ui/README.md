# @buildautomaton/ui

Dashboard for the local work queue. Same idea as the runtime: a small kernel, plugins that fill panels.

```text
Vite app
  → createUi({ plugins })
  → layout (sidebar | master-detail | columns)
  → surfaces in those panels
```

```ts
import { createUi, workUiPlugin } from '@buildautomaton/ui';

const { App } = createUi({ plugins: [workUiPlugin()] });
```

| Kind | Role |
| --- | --- |
| `provider` | React context (work client, theme, …) |
| `surface` | A view in a named panel |
| `layout` | Which shell; last one wins |
| `theme` | Optional; tokens live in `src/design/tokens.css` |

| Layout | Panels |
| --- | --- |
| `sidebar` | `nav`, `sidebar`, `main` |
| `master-detail` | `nav`, `master`, `detail` |
| `columns` | `nav`, `column`, `header` |

The work plugin uses **columns**: completed artifacts on the left, drafts and a prompt on the right. Click a thumbnail for a full preview. It talks to local-cli HTTP (`/api/work`, `/api/artifacts` on the same server as `/mcp`).

Shared `Column`, `PromptComposer`, and `NumberedQuestion` live in the design system (`@buildautomaton/ui/design`).

Start the CLI first (port 3333), then:

```bash
pnpm --filter @buildautomaton/ui dev
```
