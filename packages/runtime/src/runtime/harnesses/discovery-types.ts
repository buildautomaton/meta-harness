/** Auto-discovery of local ACP agents via registered harnesses. */

export type DiscoveredAgent = {
  type: string;
  displayName: string;
};

export type AgentDiscovery = {
  /** PATH / presence probes for harnesses that implement detectPresence. */
  discoverAgents(): Promise<DiscoveredAgent[]>;
};
