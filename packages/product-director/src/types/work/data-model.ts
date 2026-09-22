import type { ChangeKind } from './change.js';

export type DataModelHighlight = {
  /** Entity name, Entity.field, or Entity--Other for a relationship. */
  ref: string;
  change: ChangeKind;
};

export type DataModelInput = {
  mermaid: string;
  whatChanged: string;
  highlights?: DataModelHighlight[];
};
