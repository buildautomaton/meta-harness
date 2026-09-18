export type SqlStoreOptions = {
  /** SQLite file path. Default: `<cwd>/.harness/work.sqlite`. Use `:memory:` for tests. */
  file?: string;
  id?: string;
};
