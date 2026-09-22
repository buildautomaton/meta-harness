import type { ChangeKind } from '@/types/work/change.js';

const SYMBOL: Record<ChangeKind, string> = {
  added: '+',
  modified: '~',
  removed: '−',
};

const LABEL: Record<ChangeKind, string> = {
  added: 'Added',
  modified: 'Modified',
  removed: 'Removed',
};

export function changeMark(change: ChangeKind): string {
  const label = LABEL[change];
  return `<span class="change change-${change}" title="${label}" aria-label="${label}"><span class="change-icon" aria-hidden="true">${SYMBOL[change]}</span></span>`;
}

export function changeSymbol(change: ChangeKind): string {
  return SYMBOL[change];
}
