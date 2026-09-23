# Product director: UI plugins

These plugins run inside [`@buildautomaton/ui-runtime`](../ui-runtime/). `productDirectorUiSet()` installs them. The ready-made [UI](../ui/) app already does that for you.

## Work surface

`workUiPlugin` (`kind: 'surface'`) is the main UI pack. It asks for a **columns** layout and fills it with:

| Surface | Panel | What you see |
| --- | --- | --- |
| Projects | header | Project tabs / filter |
| Completed | column | Finished artifacts you can review |
| Draft work | column | Work still being shaped |
| Queued work | column | Items waiting for an agent, plus a prompt composer |

It also installs a React provider so those views can talk to the work API (usually the local CLI on port 3333).

```ts
import { createUi } from '@buildautomaton/ui-runtime';
import { productDirectorUiSet } from '@buildautomaton/product-director/ui';

const { App } = createUi({ plugins: productDirectorUiSet() });
```

Pass a custom `client` if you need a different HTTP base URL or auth.
