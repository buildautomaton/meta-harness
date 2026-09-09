/** Auto-discovery of local ACP agents via registered providers. */

export type DiscoveredAgent = {
  type: string;
  displayName: string;
};

export type AgentDiscovery = {
  /** PATH / presence probes for providers that implement detectPresence. */
  discoverAgents(): Promise<DiscoveredAgent[]>;
};
