/** Mount MCP tools, or customize a contributing plugin's HTTP root. */
export type TransportEndpoint = {
  path: string;
  kind?: 'tools';
  /** Destination plugin `name` whose HTTP contribution uses `path` as mount. */
  plugin?: string;
  /** Optional route segment overrides for that plugin. */
  routes?: Record<string, string>;
};
