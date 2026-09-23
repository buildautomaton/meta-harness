# Tools

Tools plugins expose functions agents can call (usually over MCP). You can register many; their tool lists are merged.

## Minion tools

`minionToolsPlugin` is the built-in tools pack. It lets a parent agent start and watch other agent runs (“minions”).

| Tool | What it does |
| --- | --- |
| `spawn_minion` | Start a harness with a prompt; waits until that run finishes |
| `await_minion` | Wait on a minion that already returned |
| `get_minion` | Status for a minion |
| `get_minion_transcript` | Messages from that run |
| `get_minion_context` | Working directory and available harnesses |
| `resolve_minion_request` | Answer a permission or auth prompt |

Spawn already waits, so you do not need to poll. Permission prompts show up on the same open tool call.

```ts
minionToolsPlugin()
```

Skip them in `coreSet()` with `minionTools: false`.

Other packages (for example [product-director](../product-director/runtime.md)) can add more tools plugins beside this one.
