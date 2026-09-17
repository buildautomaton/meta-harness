import type { WorkItem } from './records.js';
import type { WorkArtifact } from './artifact.js';
import type { WorkEvent } from './events.js';

export type WorkHooks = {
  onWorkAdded?: (item: WorkItem) => void;
  onWorkUpdated?: (item: WorkItem) => void;
  onWorkPicked?: (item: WorkItem, sessionId: string) => void;
  onArtifactRecorded?: (artifact: WorkArtifact) => void;
  onWorkEvent?: (event: WorkEvent) => void;
};
