# @buildautomaton/local-cli

The **Local CLI** is one of the two ready-to-run apps in this repo (the other is the [UI](../ui/)).

You point it at a repo folder. It starts the [runtime](../runtime/) with `coreSet()` plus [product-director](../product-director/) runtime plugins, then listens for tools and HTTP.

```text
local-cli  (runnable app)
  ├── runtime              framework: stores, agents, sessions, tools, HTTP
  └── product-director     plugins: work queue, artifacts, director tools
         ↓
      createRuntime → listen
```

```bash
npx @buildautomaton/local-cli --cwd /path/to/repo
```

By default it serves HTTP at `http://127.0.0.1:3333`:

```text
/mcp                 tools
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
| `--backend disk\|stream` | Disk (default) or in-memory stream wrap |
| `--transport http\|stdio\|remote` | How clients connect (HTTP by default) |
| `--port <n>` | HTTP port (`3333`) |
| `--mcp-path <path>` | Tools path (`/mcp`) |
| `--remote-url <url>` | Required for `--transport remote` |
| `--verbose` | Log to stderr |

On disk: sessions under `.harness/sessions`, SQLite at `.harness/work.sqlite`.

Want a different mix of plugins? Skip this binary and call `createRuntime` yourself from the [runtime](../runtime/) package.
