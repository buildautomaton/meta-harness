export { createUi } from './core/create-ui.js';
export { applyUiPlugins } from './core/apply.js';
export { DEFAULT_PANELS } from './core/slots.js';
export type { UiPlugin, UiSurface, UiProviderContribution, UiHooks, SurfaceProps } from './core/plugin.js';
export type { UiHost, CreateUiOptions } from './core/create-ui.js';
export { DashboardShell } from './dashboard/shell.js';
export { workUiPlugin, createHttpWorkClient } from './plugins/index.js';
export type { HttpWorkClientOptions, WorkClient, WorkItem, WorkArtifact } from './plugins/index.js';
export * from './design/index.js';
