import type { ComponentType, ReactNode } from 'react';

export type UiPluginKind = 'theme' | 'provider' | 'surface';

export type SurfaceProps = {
  panel: string;
};

export type UiSurface = {
  id: string;
  title: string;
  /** Panel id defined by the dashboard shell (`nav`, `main`). */
  panel: string;
  order?: number;
  component: ComponentType<SurfaceProps>;
};

export type UiProviderContribution = {
  id: string;
  order?: number;
  component: ComponentType<{ children: ReactNode }>;
};

export type UiHooks = {
  onReady?: () => void;
};

export type UiPlugin = {
  name: string;
  kind: UiPluginKind;
  hooks?: UiHooks;
  implementation?: {
    surfaces?: UiSurface[];
    providers?: UiProviderContribution[];
  };
};
