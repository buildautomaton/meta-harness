import type { UiSlots } from '../core/slots.js';
import { UiHostProvider } from './host.js';
import { nestProviders } from './nest-providers.js';
import { DashboardShell } from './shell.js';

export function DashboardApp({ slots }: { slots: UiSlots }) {
  return (
    <UiHostProvider slots={slots}>
      {nestProviders(slots.providers, <DashboardShell />)}
    </UiHostProvider>
  );
}
