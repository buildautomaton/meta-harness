export type ChoiceKind = 'status_quo' | 'change';
export type ChoiceOption = { id: string; label: string; kind?: ChoiceKind };

export function choiceHint(choice: Pick<ChoiceOption, 'kind'>): string | undefined {
  return choice.kind === 'status_quo' ? 'No changes' : undefined;
}
