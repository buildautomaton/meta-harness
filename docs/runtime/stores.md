# Stores

Store plugins hold data on disk. The runtime expects at most one of each kind.

## File store

`fileStorePlugin` (`kind: 'file-store'`) reads and writes files under a root folder. Sessions and other plugins use it when they need the filesystem.

```ts
fileStorePlugin({ options: { root: process.cwd() } })
```

## SQL store

`sqlStorePlugin` (`kind: 'sql-store'`) opens one shared SQLite database. Other plugins add their own tables through migrations. Default file: `<cwd>/.harness/work.sqlite`.

```ts
sqlStorePlugin({ options: { file: '/path/to/work.sqlite' } })
```

Migrations use a `__migrations` table. Names are scoped per plugin. Order is guaranteed only inside that plugin.

## Typical layout

```text
.harness/
  sessions/     often via the file store
  work.sqlite   sql-store
```

`coreSet()` installs both stores for you.
