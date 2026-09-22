export const CHANGE_KINDS = ['added', 'modified', 'removed'] as const;

export type ChangeKind = (typeof CHANGE_KINDS)[number];
