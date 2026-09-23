# @buildautomaton/ui

The **UI** is the other ready-to-run app (alongside the [Local CLI](../local-cli/)).

It is a thin Vite host: it starts [`createUi`](../ui-runtime/) with [product-director UI plugins](../product-director/ui.md) and talks to the CLI over HTTP.

```text
ui  (runnable app)
  ├── ui-runtime           framework: layout, design system, shells
  └── product-director     UI plugins: work columns
         ↓
      createUi → Vite app
```

```ts
import { createUi } from '@buildautomaton/ui-runtime';
import { productDirectorUiSet } from '@buildautomaton/product-director/ui';

const { App } = createUi({ plugins: productDirectorUiSet() });
```

The work UI uses columns: finished artifacts on the left, drafts and a prompt on the right. It calls `/api/work` and `/api/artifacts` on the same server as `/mcp`.

Start the CLI first (port 3333), then:

```bash
pnpm --filter @buildautomaton/ui dev
```
