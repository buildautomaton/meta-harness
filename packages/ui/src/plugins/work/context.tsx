import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { WorkClient, WorkItem } from './types.js';
import { createHttpWorkClient } from './http-client.js';

type WorkState = {
  client: WorkClient;
  items: WorkItem[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  reload: () => Promise<void>;
};

const WorkContext = createContext<WorkState | null>(null);

export function WorkProvider({ children, client }: { children: ReactNode; client?: WorkClient }) {
  const resolved = client ?? createHttpWorkClient();
  const [items, setItems] = useState<WorkItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const reload = async () => setItems(await resolved.listWork());
  useEffect(() => {
    void reload().catch(() => setItems([]));
  }, []);
  return (
    <WorkContext.Provider value={{ client: resolved, items, selectedId, setSelectedId, reload }}>
      {children}
    </WorkContext.Provider>
  );
}

export function useWork(): WorkState {
  const value = useContext(WorkContext);
  if (!value) throw new Error('useWork must be used within WorkProvider');
  return value;
}
