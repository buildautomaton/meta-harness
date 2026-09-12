import type { AgentRuntimePlugin } from '../../types/plugin.js';
import type { HarnessPlugin } from '../../types/harness/plugin.js';
import type { ToolsPlugin } from '../../types/tools/plugin.js';
import type { TransportPlugin } from '../../types/transport/plugin.js';
import type { LogFn } from '../../types/log.js';
import { createPluginSlots, type PluginSlots } from './plugin-slots.js';
import { applyHarnessPlugin } from './apply-harness.js';
import { applySessionPlugin, type SessionPluginRecord } from './apply-session.js';
import { applyTransportPlugin } from './apply-transport.js';
import { applyToolsPlugin } from './apply-tools.js';

export function applyPlugins(
  plugins: readonly AgentRuntimePlugin[],
  _options: { log: LogFn; cwd: string },
): PluginSlots {
  const slots = createPluginSlots();
  for (const plugin of plugins) {
    applyOne(slots, plugin);
  }
  return slots;
}

function applyOne(slots: PluginSlots, plugin: AgentRuntimePlugin): void {
  switch (plugin.kind) {
    case 'harness':
      applyHarnessPlugin(slots, plugin as HarnessPlugin);
      return;
    case 'session':
      applySessionPlugin(slots, plugin as SessionPluginRecord);
      return;
    case 'transport':
      applyTransportPlugin(slots, plugin as TransportPlugin);
      return;
    case 'tools':
      applyToolsPlugin(slots, plugin as ToolsPlugin);
      return;
  }
}
