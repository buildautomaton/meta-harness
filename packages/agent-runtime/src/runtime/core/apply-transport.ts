import type { PluginSlots } from './plugin-slots.js';
import type { TransportPlugin } from '../../types/transport/plugin.js';
import { addHooksOnce, mergeOptional } from './merge-hooks.js';

const seenTransport = new WeakMap<PluginSlots, WeakSet<object>>();

function seenFor(slots: PluginSlots): WeakSet<object> {
  let set = seenTransport.get(slots);
  if (!set) {
    set = new WeakSet();
    seenTransport.set(slots, set);
  }
  return set;
}

export function applyTransportPlugin(slots: PluginSlots, plugin: TransportPlugin): void {
  slots.transport = {
    id: plugin.options.id ?? 'mcp',
    start: plugin.implementation.start,
    stop: plugin.implementation.stop,
  };
  if (plugin.hooks) {
    slots.transportHooks = addHooksOnce(
      seenFor(slots),
      slots.transportHooks,
      plugin.hooks,
      (a, b) => mergeOptional(a, b)!,
    );
  }
}
