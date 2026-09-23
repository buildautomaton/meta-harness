# Product director: runtime plugins

These plugins run inside [`@buildautomaton/runtime`](../runtime/). `productDirectorSet()` installs all of them. They need the shared SQL store and HTTP server (not the file store).

## Artifact plugins

Each artifact plugin teaches agents (and the tell tool) about one kind of review output. Add or remove a plugin and the tell tool grows or shrinks with it.

| Plugin | Kind | What it captures |
| --- | --- | --- |
| `summaryArtifactPlugin` | `summary` | Short plain-language blurbs of what changed by area |
| `changesOverviewArtifactPlugin` | `changesOverview` | A structured overview of the change set |
| `apiArtifactPlugin` | `api` | API surfaces that changed |
| `dataModelArtifactPlugin` | `dataModel` | Data model / schema changes |
| `uiArtifactPlugin` | `ui` | UI screens and flows |
| `algorithmArtifactPlugin` | `algorithm` | Non-trivial logic / algorithms |

## Work plugin

`sqliteWorkPlugin` (`kind: 'work'`) owns the queue itself: drafts, queued items, completed work, answers, and artifacts in SQLite. It also mounts HTTP under `/api` (work, artifacts, assets, and a websocket for live updates).

There is also `memoryWorkPlugin` for in-memory use (tests and light embeds).

## Director tools

`workToolsPlugin` (`kind: 'tools'`) adds three tools beside the runtime’s minion tools:

| Tool | What it does |
| --- | --- |
| `ask_product_director_what_to_build_next` | Hand the agent the next queued item |
| `tell_product_director_what_was_built` | Save artifacts from the registered artifact plugins |
| `ask_product_director_interview_questions` | Ask follow-up questions about a draft |

The tell tool’s fields and instructions are built from the artifact plugins you registered.

## HTTP paths

Default mounts on the shared server: `/api/work`, `/api/artifacts`, `/api/assets`, `/api/work/events`.
