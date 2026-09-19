# @buildautomaton/local-cli

Thin CLI. Parses flags, then starts `coreSet()` + `productDirectorSet()`. MIT licensed.

```text
local-cli
  ├── runtime          stores, harnesses, sessions, minions, HTTP
  └── product-director       work queue, artifacts, director tools
         ↓
      createRuntime → listen
```

```bash
npx @buildautomaton/local-cli --cwd /path/to/repo
```

Default: HTTP at `http://127.0.0.1:3333`.

```text
/mcp                 MCP tools
/api/work            queue
/api/artifacts       reviews
/api/sessions        sessions
/api/work/events     websocket
```

```bash
local-cli --cwd /path/to/repo --port 3333
local-cli --transport stdio --cwd /path/to/repo
local-cli --transport remote --remote-url https://control.example
```

| Flag | Meaning |
| --- | --- |
| `--cwd <path>` | Working directory for minions |
| `--sessions-dir <path>` | Session files (default `<cwd>/.harness/sessions`) |
| `--backend disk\|stream` | Disk (default) or stream wrap |
| `--transport http\|stdio\|remote` | HTTP (default), stdio, or remote |
| `--port <n>` | HTTP port (`3333`) |
| `--mcp-path <path>` | MCP path (`/mcp`) |
| `--remote-url <url>` | Required for `--transport remote` |
| `--verbose` | Log to stderr |

On disk: sessions under `.harness/sessions`, SQLite at `.harness/work.sqlite`.

## Tools

Minion tools (from the runtime) plus product-director tools:

| Tool | Does |
| --- | --- |
| `spawn_minion` | Run a harness with a prompt; waits until done |
| `await_minion` | Wait on a minion that already returned |
| `get_minion` / `get_minion_transcript` | Status and agent messages |
| `get_minion_context` | cwd and harness list |
| `resolve_minion_request` | Permission or provider token |
| `ask_product_director_what_to_build_next` | Next queued work |
| `tell_product_director_what_was_built` | What was built, plus artifacts |
| `ask_product_director_interview_questions` | Interview a draft |

Spawn already waits. Don’t poll. Permission prompts arrive on the open tool call.

Need a different mix of plugins? Call `createRuntime` from `@buildautomaton/runtime` instead of this binary.

## License

MIT. See [LICENSE](LICENSE).
