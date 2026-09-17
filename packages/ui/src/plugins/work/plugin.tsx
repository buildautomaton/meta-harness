import type { ReactNode } from 'react';
import type { UiPlugin } from '../../core/plugin.js';
import { WorkProvider } from './context.js';
import { WorkFeedView } from './feed-view.js';
import { WorkNav } from './nav.js';
import type { WorkClient } from './types.js';

function bindProvider(client?: WorkClient) {
  return function WorkBoundProvider({ children }: { children: ReactNode }) {
    return <WorkProvider client={client}>{children}</WorkProvider>;
  };
}

export function workUiPlugin(client?: WorkClient): UiPlugin {
  return {
    name: 'work',
    kind: 'surface',
    implementation: {
      providers: [{ id: 'work', component: bindProvider(client) }],
      surfaces: [
        { id: 'work-nav', title: 'Work', panel: 'nav', order: 0, component: WorkNav },
        { id: 'work-feed', title: 'Feed', panel: 'main', order: 0, component: WorkFeedView },
      ],
    },
  };
}
