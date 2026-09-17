import type { PluginSlots } from './plugin-slots.js';
import type { WorkPlugin } from '@/types/work/plugin.js';
import { addHooksOnce, mergeOptional } from './merge-hooks.js';

const seenWork = new WeakMap<PluginSlots, WeakSet<object>>();

function seenFor(slots: PluginSlots): WeakSet<object> {
  let set = seenWork.get(slots);
  if (!set) {
    set = new WeakSet();
    seenWork.set(slots, set);
  }
  return set;
}

export function applyWorkPlugin(slots: PluginSlots, plugin: WorkPlugin): void {
  if (plugin.wrapBackend) {
    slots.workWraps.push(plugin.wrapBackend);
  } else if (plugin.implementation) {
    const backend = { id: plugin.options?.id ?? 'work', ...plugin.implementation };
    slots.works[plugin.name] = backend;
    slots.work = backend;
    slots.workName = plugin.name;
  }
  if (plugin.hooks) {
    slots.workHooks = addHooksOnce(seenFor(slots), slots.workHooks, plugin.hooks, (a, b) =>
      mergeOptional(a, b)!,
    );
  }
}
