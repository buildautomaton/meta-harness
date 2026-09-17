import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { WorkArtifact, WorkClient, WorkItem } from './types.js';
import { createHttpWorkClient } from './http-client.js';
import { loadBoard } from './load-board.js';
import { watchBoard } from './watch-board.js';
import { dropById, mergeItems } from './merge-items.js';

type WorkState = {
  client: WorkClient;
  artifacts: WorkArtifact[];
  items: WorkItem[];
  reload: () => Promise<void>;
  ingestItems: (incoming: WorkItem[]) => void;
  dropItems: (ids: string[]) => void;
};

const WorkContext = createContext<WorkState | null>(null);

export function WorkProvider({ children, client }: { children: ReactNode; client?: WorkClient }) {
  const resolved = useMemo(() => client ?? createHttpWorkClient(), [client]);
  const seq = useRef(0);
  const [artifacts, setArtifacts] = useState<WorkArtifact[]>([]);
  const [items, setItems] = useState<WorkItem[]>([]);
  const reload = async () => {
    const mine = ++seq.current;
    try {
      const next = await loadBoard(resolved);
      if (mine !== seq.current) return;
      setArtifacts(next.artifacts);
      setItems(next.items);
    } catch {
      return;
    }
  };
  const ingestItems = (incoming: WorkItem[]) => {
    if (incoming.length) setItems((current) => mergeItems(current, incoming));
  };
  const dropItems = (ids: string[]) => {
    if (ids.length) setItems((current) => dropById(current, ids));
  };
  const reloadRef = useRef(reload);
  reloadRef.current = reload;
  useEffect(() => watchBoard(() => void reloadRef.current()), [resolved]);
  return (
    <WorkContext.Provider value={{ client: resolved, artifacts, items, reload, ingestItems, dropItems }}>
      {children}
    </WorkContext.Provider>
  );
}

export function useWork(): WorkState {
  const value = useContext(WorkContext);
  if (!value) throw new Error('useWork must be used within WorkProvider');
  return value;
}
