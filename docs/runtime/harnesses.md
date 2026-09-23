# Harnesses

Harness plugins teach the runtime how to talk to a specific agent product. You can register many. `coreSet()` installs all of these and tries them in order when detecting what is available.

| Plugin | Type id | Notes |
| --- | --- | --- |
| `cursorHarnessPlugin` | `cursor-cli` | Needs `CURSOR_API_KEY` |
| `codexHarnessPlugin` | `codex-acp` | Needs `OPENAI_API_KEY` |
| `claudeCodeHarnessPlugin` | `claude-code` | Needs `ANTHROPIC_API_KEY` |
| `kiroHarnessPlugin` | `kiro-acp` | Detect only today |
| `opencodeHarnessPlugin` | `opencode` | Installs; prompting comes later |

```ts
import { cursorHarnessPlugin, coreHarnessPlugins } from '@buildautomaton/runtime/plugins';

coreHarnessPlugins()
// or pick one:
cursorHarnessPlugin()
```

A harness typically detects whether the agent is installed, can help install it, starts a process, and sends prompts over ACP.

## How a prompt runs

```text
prompt → pick a run → start or reuse a process → send the prompt → return the result
```

Harness plugins register agent types on the runtime handle. Session plugins remember the agent’s session id. Tools and HTTP sit next to them.
