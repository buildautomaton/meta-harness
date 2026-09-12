import type { PluginSlots } from './plugin-slots.js';
import type { SessionPlugin } from '../../types/session/plugin.js';
import type { SessionBackendWrap } from '../session/types.js';
import { addHooksOnce, mergeOptional } from './merge-hooks.js';

const seenSession = new WeakMap<PluginSlots, WeakSet<object>>();

function seenFor(slots: PluginSlots): WeakSet<object> {
  let set = seenSession.get(slots);
  if (!set) {
    set = new WeakSet();
    seenSession.set(slots, set);
  }
  return set;
}

export type SessionPluginRecord = SessionPlugin & {
  wrapBackend?: SessionBackendWrap;
};

export function applySessionPlugin(slots: PluginSlots, plugin: SessionPluginRecord): void {
  if (plugin.wrapBackend) {
    slots.backendWraps.push(plugin.wrapBackend);
  } else if (plugin.implementation) {
    slots.backend = {
      id: plugin.options.id ?? 'disk',
      ...plugin.implementation,
    };
  }
  if (plugin.hooks) {
    slots.sessionHooks = addHooksOnce(seenFor(slots), slots.sessionHooks, plugin.hooks, (a, b) =>
      mergeOptional(a, b)!,
    );
  }
}
