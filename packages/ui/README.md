# @buildautomaton/ui

Dashboard app. Thin host, like [`@buildautomaton/local-cli`](../local-cli): it starts `createUi()` with product-director UI plugins.

```text
ui
  ├── ui-runtime            kernel, design system, dashboard shells
  └── product-director      work surfaces
         ↓
      createUi → Vite app
```

```ts
import { createUi } from '@buildautomaton/ui-runtime';
import { productDirectorUiSet } from '@buildautomaton/product-director/ui';

const { App } = createUi({ plugins: productDirectorUiSet() });
```

The work plugin uses **columns**: completed artifacts on the left, drafts and a prompt on the right. It talks to local-cli HTTP (`/api/work`, `/api/artifacts` on the same server as `/mcp`).

Start the CLI first (port 3333), then:

```bash
pnpm --filter @buildautomaton/ui dev
```
