import type { PluginSlots } from './plugin-slots.js';
import type { SessionPlugin } from '@/types/session/plugin.js';
import { addHooksOnce, mergeOptional } from './merge-hooks.js';
import { storeContext } from './store-context.js';
import { runPluginMigrations } from './run-plugin-migrations.js';

const seenSession = new WeakMap<PluginSlots, WeakSet<object>>();

function seenFor(slots: PluginSlots): WeakSet<object> {
  let set = seenSession.get(slots);
  if (!set) {
    set = new WeakSet();
    seenSession.set(slots, set);
  }
  return set;
}

export function applySessionPlugin(slots: PluginSlots, plugin: SessionPlugin): void {
  slots.sessionPlugins.push(plugin);
  runPluginMigrations(slots, plugin);
  if (plugin.wrapBackend) {
    slots.backendWraps.push(plugin.wrapBackend);
  } else if (plugin.implementation) {
    setBackend(slots, plugin);
  } else if (plugin.createFromStores) {
    setBackend(slots, plugin, plugin.createFromStores(storeContext(slots)));
  }
  if (plugin.hooks) {
    slots.sessionHooks = addHooksOnce(seenFor(slots), slots.sessionHooks, plugin.hooks, (a, b) =>
      mergeOptional(a, b)!,
    );
  }
}

function setBackend(
  slots: PluginSlots,
  plugin: SessionPlugin,
  impl = plugin.implementation,
): void {
  if (!impl) return;
  slots.backend = { id: plugin.options.id ?? 'disk', ...impl };
}
