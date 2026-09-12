import type { PluginSlots } from './plugin-slots.js';
import type { ToolsPlugin } from '../../types/tools/plugin.js';
import { addHooksOnce, mergeOptional } from './merge-hooks.js';

const seenTools = new WeakMap<PluginSlots, WeakSet<object>>();

function seenFor(slots: PluginSlots): WeakSet<object> {
  let set = seenTools.get(slots);
  if (!set) {
    set = new WeakSet();
    seenTools.set(slots, set);
  }
  return set;
}

export function applyToolsPlugin(slots: PluginSlots, plugin: ToolsPlugin): void {
  slots.tools.push(plugin.implementation);
  if (plugin.hooks) {
    slots.toolsHooks = addHooksOnce(seenFor(slots), slots.toolsHooks, plugin.hooks, (a, b) =>
      mergeOptional(a, b)!,
    );
  }
}
