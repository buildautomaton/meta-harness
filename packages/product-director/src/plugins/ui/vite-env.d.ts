interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly VITE_WORK_EVENTS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
