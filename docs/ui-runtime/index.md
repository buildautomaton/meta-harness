# @buildautomaton/ui-runtime

The UI runtime is a **framework**, like [`@buildautomaton/runtime`](../runtime/) but for dashboards. It does not ship as a finished app. You pass in UI plugins and get a composed React app.

The ready-made [UI](../ui/) package is the out-of-the-box host built on this.

```text
Your host (Vite app)
  → createUi({ plugins })
  → layout (sidebar | master-detail | columns)
  → surfaces in those panels
```

```ts
import { createUi, layoutPlugin } from '@buildautomaton/ui-runtime';

const { App } = createUi({ plugins: [layoutPlugin('columns')] });
```

| Kind | Role |
| --- | --- |
| `provider` | Shared React context (work client, theme, …) |
| `surface` | A view in a named panel |
| `layout` | Which shell to use; the last one wins |
| `theme` | Optional; tokens live in `src/design/tokens.css` |

| Layout | Panels |
| --- | --- |
| `sidebar` | `nav`, `sidebar`, `main` |
| `master-detail` | `nav`, `master`, `detail` |
| `columns` | `nav`, `column`, `header` |

Shared pieces like `Column`, `PromptComposer`, and `NumberedQuestion` live in `@buildautomaton/ui-runtime/design`.

Work surfaces for the product director queue live in [product-director UI plugins](../product-director/ui.md).
