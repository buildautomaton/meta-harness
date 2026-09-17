import type { PluginKind } from '../plugin.js';

/** Mount a plugin kind on a transport. `path` is the root; the transport fills routes. */
export type TransportEndpoint = {
  path: string;
  kind: PluginKind;
  /** Destination plugin `name`. Required for work; omit for merged tools. */
  plugin?: string;
  /** Work route segments under `path` (defaults `work`, `artifacts`, and `assets`). */
  routes?: { work?: string; artifacts?: string; assets?: string };
};
