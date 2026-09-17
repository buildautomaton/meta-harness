import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { WorkArtifact, WorkClient, WorkItem } from './types.js';
import { createHttpWorkClient } from './http-client.js';
import { loadBoard } from './load-board.js';
import { watchBoard } from './watch-board.js';

type WorkState = {
  client: WorkClient;
  artifacts: WorkArtifact[];
  items: WorkItem[];
  reload: () => Promise<void>;
};

const WorkContext = createContext<WorkState | null>(null);

export function WorkProvider({ children, client }: { children: ReactNode; client?: WorkClient }) {
  const resolved = useMemo(() => client ?? createHttpWorkClient(), [client]);
  const [artifacts, setArtifacts] = useState<WorkArtifact[]>([]);
  const [items, setItems] = useState<WorkItem[]>([]);
  const reload = async () => {
    const next = await loadBoard(resolved);
    setArtifacts(next.artifacts);
    setItems(next.items);
  };
  useEffect(() => watchBoard(resolved, (next) => {
    setArtifacts(next.artifacts);
    setItems(next.items);
  }), [resolved]);
  return (
    <WorkContext.Provider value={{ client: resolved, artifacts, items, reload }}>
      {children}
    </WorkContext.Provider>
  );
}

export function useWork(): WorkState {
  const value = useContext(WorkContext);
  if (!value) throw new Error('useWork must be used within WorkProvider');
  return value;
}
