# @buildautomaton/ui-runtime

Plugin kernel for dashboards. Same idea as `@buildautomaton/runtime`: pass plugins in, get a composed UI.

```text
Host (Vite app)
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
| `provider` | React context (work client, theme, …) |
| `surface` | A view in a named panel |
| `layout` | Which shell; last one wins |
| `theme` | Optional; tokens live in `src/design/tokens.css` |

| Layout | Panels |
| --- | --- |
| `sidebar` | `nav`, `sidebar`, `main` |
| `master-detail` | `nav`, `master`, `detail` |
| `columns` | `nav`, `column`, `header` |

Shared `Column`, `PromptComposer`, and `NumberedQuestion` live in the design system (`@buildautomaton/ui-runtime/design`).

The default dashboard app is [`@buildautomaton/ui`](../ui). Work surfaces live in [`@buildautomaton/product-director`](../product-director) as UI plugins.

## License

MIT. See [LICENSE](LICENSE).
