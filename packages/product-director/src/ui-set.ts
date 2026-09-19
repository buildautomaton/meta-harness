import type { UiPlugin } from '@buildautomaton/ui-runtime';
import { workUiPlugin } from './plugins/ui/work/plugin.js';
import type { WorkClient } from './plugins/ui/work/types.js';

export type ProductDirectorUiOptions = {
  client?: WorkClient;
};

export function productDirectorUiSet(options: ProductDirectorUiOptions = {}): UiPlugin[] {
  return [workUiPlugin(options.client)];
}
