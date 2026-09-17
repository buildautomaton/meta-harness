import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { WorkArtifact, WorkClient } from './types.js';
import { createHttpWorkClient } from './http-client.js';
import { loadArtifacts } from './load-artifacts.js';

type WorkState = {
  client: WorkClient;
  artifacts: WorkArtifact[];
  reload: () => Promise<void>;
};

const WorkContext = createContext<WorkState | null>(null);

export function WorkProvider({ children, client }: { children: ReactNode; client?: WorkClient }) {
  const resolved = useMemo(() => client ?? createHttpWorkClient(), [client]);
  const [artifacts, setArtifacts] = useState<WorkArtifact[]>([]);
  const reload = async () => setArtifacts(await loadArtifacts(resolved));
  useEffect(() => {
    let cancelled = false;
    const load = () =>
      loadArtifacts(resolved).then(
        (next) => {
          if (!cancelled) setArtifacts(next);
        },
        () => {
          if (!cancelled) setArtifacts([]);
        },
      );
    void load();
    const timer = window.setInterval(() => void load(), 2500);
    const onFocus = () => void load();
    window.addEventListener('focus', onFocus);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener('focus', onFocus);
    };
  }, [resolved]);
  return <WorkContext.Provider value={{ client: resolved, artifacts, reload }}>{children}</WorkContext.Provider>;
}

export function useWork(): WorkState {
  const value = useContext(WorkContext);
  if (!value) throw new Error('useWork must be used within WorkProvider');
  return value;
}
