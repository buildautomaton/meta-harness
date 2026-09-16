import type { ReactNode } from 'react';
import type { UiProviderContribution } from '../core/plugin.js';

export function nestProviders(providers: UiProviderContribution[], children: ReactNode): ReactNode {
  return providers.reduceRight((inner, provider) => {
    const Comp = provider.component;
    return <Comp>{inner}</Comp>;
  }, children);
}
