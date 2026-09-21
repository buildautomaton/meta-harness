import type { ReactNode } from 'react';
import type { UiPlugin } from '@buildautomaton/ui-runtime';
import { WorkProvider } from './context.js';
import { CompletedView } from './completed-view.js';
import { DraftView } from './draft-view.js';
import { QueuedView } from './queued-view.js';
import { ProjectHeader } from './project-tabs.js';
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
        { id: 'work-projects', title: 'Projects', panel: 'header', order: 0, component: ProjectHeader },
        { id: 'work-completed', title: 'Completed', panel: 'column', order: 0, component: CompletedView },
        { id: 'work-draft', title: 'Draft work', panel: 'column', order: 1, component: DraftView },
        { id: 'work-queued', title: 'Queued work', panel: 'column', order: 2, component: QueuedView },
      ],
    },
  };
}
