# Sessions

Session plugins record what happened in an agent run. You need one session plugin (you can wrap it with another).

## Disk sessions

`diskSessionPlugin` (`kind: 'session'`) is the default. While a run is live it appends to `{id}.jsonl`. When the run finishes it packs that into `{id}.json` and `{id}.md`.

Default folder: `<cwd>/.harness/sessions`. It uses the file store, can mirror into SQLite, and can serve `/api/sessions` when HTTP is up.

```ts
diskSessionPlugin({ options: { dir: '.harness/sessions' } })
```

## Stream sessions

`streamSessionPlugin` wraps an existing session so callers can `subscribe()` in memory. It does not replace disk storage. Turn it on in `coreSet()` with `backend: 'stream'`.

## Ids you will see

| Id | Who owns it | Meaning |
| --- | --- | --- |
| `runId` | you | One prompt turn; use it to cancel |
| `sessionId` | you | Your session record |
| `acpSessionId` | the agent | The agent’s own session id |
