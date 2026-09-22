export type ChoiceKind = 'status_quo' | 'change';
export type ChoiceOption = {
  id: string;
  label: string;
  kind?: ChoiceKind;
  recommended?: boolean;
};

export function choiceHints(choice: Pick<ChoiceOption, 'kind' | 'recommended'>): string[] {
  const hints: string[] = [];
  // Skip Recommended when it is also status_quo — No changes already carries that signal.
  if (choice.recommended && choice.kind !== 'status_quo') hints.push('Recommended');
  if (choice.kind === 'status_quo') hints.push('No changes');
  return hints;
}

/** @deprecated Prefer choiceHints — kept for existing call sites. */
export function choiceHint(choice: Pick<ChoiceOption, 'kind' | 'recommended'>): string | undefined {
  return choiceHints(choice)[0];
}
