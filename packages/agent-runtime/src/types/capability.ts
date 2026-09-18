export type StoreKind = 'file-store' | 'sql-store';
export type TransportCapability = 'http';

/** Feature plugins declare which store and transport plugins they can use. */
export type PluginSupport = {
  stores?: StoreKind[];
  transports?: TransportCapability[];
};
