import type { RuntimePlugin, KernelPluginKind } from '@/types/plugin.js';
import type { HarnessPlugin } from '@/types/harness/plugin.js';
import type { ToolsPlugin } from '@/types/tools/plugin.js';
import type { TransportPlugin } from '@/types/transport/plugin.js';
import type { SessionPlugin } from '@/types/session/plugin.js';
import type { FileStorePlugin } from '@/types/file-store/plugin.js';
import type { SqlStorePlugin } from '@/types/sql-store/plugin.js';
import type { HttpPlugin } from '@/types/http/plugin.js';
import type { LogFn } from '@/types/log.js';
import { KERNEL_PLUGIN_KINDS } from '@/types/plugin.js';
import { createPluginSlots, type PluginSlots } from './plugin-slots.js';
import { applyHarnessPlugin } from './apply-harness.js';
import { applySessionPlugin } from './apply-session.js';
import { applyTransportPlugin } from './apply-transport.js';
import { applyToolsPlugin } from './apply-tools.js';
import { applyFileStorePlugin } from './apply-file-store.js';
import { applySqlStorePlugin } from './apply-sql-store.js';
import { applyHttpPlugin } from './apply-http.js';
import { applyExtensionPlugin } from './apply-extension.js';

const KERNEL_ORDER: readonly KernelPluginKind[] = [
  'file-store',
  'sql-store',
  'http',
  'session',
  'harness',
  'tools',
  'transport',
];

const KERNEL = new Set<string>(KERNEL_PLUGIN_KINDS);

/** Fill kernel slots, then apply package-defined plugin kinds. */
export function applyPlugins(
  plugins: readonly RuntimePlugin[],
  _options: { log: LogFn; cwd: string },
): PluginSlots {
  const slots = createPluginSlots();
  slots.plugins = [...plugins];
  for (const plugin of plugins) {
    const list = slots.byKind.get(plugin.kind) ?? [];
    list.push(plugin);
    slots.byKind.set(plugin.kind, list);
  }
  for (const kind of KERNEL_ORDER) {
    for (const plugin of slots.byKind.get(kind) ?? []) applyKernel(slots, plugin);
  }
  for (const plugin of plugins) {
    if (!KERNEL.has(plugin.kind)) applyExtensionPlugin(slots, plugin);
  }
  return slots;
}

function applyKernel(slots: PluginSlots, plugin: RuntimePlugin): void {
  switch (plugin.kind) {
    case 'file-store':
      applyFileStorePlugin(slots, plugin as FileStorePlugin);
      return;
    case 'sql-store':
      applySqlStorePlugin(slots, plugin as SqlStorePlugin);
      return;
    case 'http':
      applyHttpPlugin(slots, plugin as HttpPlugin);
      return;
    case 'harness':
      applyHarnessPlugin(slots, plugin as HarnessPlugin);
      return;
    case 'session':
      applySessionPlugin(slots, plugin as SessionPlugin);
      return;
    case 'transport':
      applyTransportPlugin(slots, plugin as TransportPlugin);
      return;
    case 'tools':
      applyToolsPlugin(slots, plugin as ToolsPlugin);
  }
}
