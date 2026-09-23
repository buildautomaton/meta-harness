# @buildautomaton/runtime

The runtime is a **framework**: it does not ship as a finished app. You pass in plugins, it wires them together, and you get a handle you can start and stop.

[Local CLI](../local-cli/) is the out-of-the-box app built on this. You can also write your own host that calls `createRuntime` with a different mix of plugins.

```text
Your host (CLI, server, test)
  → createRuntime({ plugins })
  → plugins fill their roles
  → handle.start()
```

## Install

```bash
npm install @buildautomaton/runtime
```

```ts
import { createRuntime, coreSet } from '@buildautomaton/runtime';

const runtime = await createRuntime({
  cwd: process.cwd(),
  plugins: coreSet({ options: { cwd: process.cwd() } }),
});
await runtime.start();
```

Needs Node 18+. Built-in plugins also export from `@buildautomaton/runtime/plugins`.

`coreSet()` is the default bundle used by the CLI: both stores, five agent types, disk sessions, minion tools, and HTTP (or stdio / remote).

## Plugin categories

- [Stores](./stores.md) — files on disk and shared SQLite
- [Sessions](./sessions.md) — where agent runs are recorded
- [Harnesses](./harnesses.md) — Cursor, Codex, Claude Code, and friends
- [Tools](./tools.md) — minion tools agents can call
- [HTTP](./http.md) — one shared server plugins mount onto
- [Transports](./transports.md) — stdio and remote (HTTP is its own kind)
- [Custom plugins](./custom.md) — write your own
