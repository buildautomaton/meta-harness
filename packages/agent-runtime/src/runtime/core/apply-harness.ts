import type { PluginSlots } from './plugin-slots.js';
import type { HarnessPlugin } from '../../types/harness/plugin.js';
import type { AgentHarness } from '../harnesses/types.js';
import { addHooksOnce, mergeHarnessHooks, mergeHarnessHost } from './merge-hooks.js';
import { hasHostMethods, hostSkipKey, pickHarnessHost } from './pick-harness-host.js';

const seenHarness = new WeakMap<PluginSlots, WeakSet<object>>();
const seenHost = new WeakMap<PluginSlots, WeakSet<object>>();

function seen(map: WeakMap<PluginSlots, WeakSet<object>>, slots: PluginSlots): WeakSet<object> {
  let set = map.get(slots);
  if (!set) {
    set = new WeakSet();
    map.set(slots, set);
  }
  return set;
}

export function applyHarnessPlugin(slots: PluginSlots, plugin: HarnessPlugin): void {
  const harness: AgentHarness = { ...plugin.options, ...plugin.implementation };
  slots.harnesses.push(harness);
  if (plugin.hooks) {
    slots.harnessHooks = addHooksOnce(
      seen(seenHarness, slots),
      slots.harnessHooks,
      plugin.hooks,
      mergeHarnessHooks,
    );
  }
  const impl = plugin.implementation;
  const key = hostSkipKey(impl);
  if (key && seen(seenHost, slots).has(key)) return;
  if (key) seen(seenHost, slots).add(key);
  const host = pickHarnessHost(impl);
  if (!hasHostMethods(host)) return;
  slots.harnessHost = slots.harnessHost ? mergeHarnessHost(slots.harnessHost, host) : host;
}
