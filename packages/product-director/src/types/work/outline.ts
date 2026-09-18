export const OUTLINE_VIEW_KINDS = [
  'component-tree',
  'file-tree',
  'call-tree',
  'pseudocode',
  'flow',
  'diff',
] as const;

export type OutlineViewKind = (typeof OUTLINE_VIEW_KINDS)[number];

export type OutlineViewInput = {
  kind: OutlineViewKind;
  title: string;
  content: string;
};

export type OutlineArtifactInput = {
  whatChanged: string;
  views: OutlineViewInput[];
};
