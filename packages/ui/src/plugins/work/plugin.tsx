import type { ReactNode } from 'react';
import type { UiPlugin } from '../../core/plugin.js';
import { WorkProvider } from './context.js';
import { CompletedView } from './completed-view.js';
import { DraftView } from './draft-view.js';
import { QueuedView } from './queued-view.js';
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
      layout: 'columns',
      providers: [{ id: 'work', component: bindProvider(client) }],
      surfaces: [
        { id: 'work-nav', title: 'Work', panel: 'nav', order: 0, component: WorkNav },
        { id: 'work-completed', title: 'Completed', panel: 'column', order: 0, component: CompletedView },
        { id: 'work-draft', title: 'Draft work', panel: 'column', order: 1, component: DraftView },
        { id: 'work-queued', title: 'Queued work', panel: 'column', order: 2, component: QueuedView },
      ],
    },
  };
}
