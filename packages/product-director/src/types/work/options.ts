export type WorkOptions = {
  /** SQLite database path. Default: `<cwd>/.harness/work.sqlite`. */
  file?: string;
  id?: string;
};

export type WorkBackendKind = 'sqlite' | 'memory' | 'remote';
