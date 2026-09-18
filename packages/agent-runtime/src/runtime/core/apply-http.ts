import type { PluginSlots } from './plugin-slots.js';
import type { HttpPlugin } from '@/types/http/plugin.js';
import { addHooksOnce, mergeOptional } from './merge-hooks.js';

const seenHttp = new WeakMap<PluginSlots, WeakSet<object>>();

function seenFor(slots: PluginSlots): WeakSet<object> {
  let set = seenHttp.get(slots);
  if (!set) {
    set = new WeakSet();
    seenHttp.set(slots, set);
  }
  return set;
}

export function applyHttpPlugin(slots: PluginSlots, plugin: HttpPlugin): void {
  slots.http = plugin.registry;
  slots.httpEndpoints = plugin.options.endpoints ?? [];
  slots.transport = {
    id: plugin.options.id ?? 'http',
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
