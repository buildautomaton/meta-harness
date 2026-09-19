export function visibleChoices<T extends { id: string }>(
  choices: T[],
  selectedId: string,
  open: boolean,
): T[] {
  if (open || !selectedId) return choices;
  return choices.filter((choice) => choice.id === selectedId);
}

export function collapseAfterSelect(selectedId: string) {
  return { open: !selectedId };
}
