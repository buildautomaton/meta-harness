import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { UiSlots } from '../core/slots.js';
import type { UiSurface } from '../core/plugin.js';

export type UiHostValue = {
  slots: UiSlots;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  surfacesIn: (panel: string) => UiSurface[];
};

const UiHostContext = createContext<UiHostValue | null>(null);

export function UiHostProvider(props: { slots: UiSlots; children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const value = useMemo<UiHostValue>(
    () => ({
      slots: props.slots,
      selectedId,
      setSelectedId,
      surfacesIn: (panel) => props.slots.surfaces.filter((s) => s.panel === panel),
    }),
    [props.slots, selectedId],
  );
  return <UiHostContext.Provider value={value}>{props.children}</UiHostContext.Provider>;
}

export function useUiHost(): UiHostValue {
  const value = useContext(UiHostContext);
  if (!value) throw new Error('useUiHost must be used within UiHostProvider');
  return value;
}
