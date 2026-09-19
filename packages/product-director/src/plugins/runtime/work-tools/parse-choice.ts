import type { ChoiceKind, DesignChoice } from '@/types/work/questions.js';
import { obj, str } from './parse-value.js';

export function parseChoice(value: unknown): DesignChoice | undefined {
  const choice = obj(value);
  const id = str(choice?.id);
  const label = str(choice?.label);
  if (!id || !label) return undefined;
  const kind = parseKind(choice?.kind);
  const prompt = str(choice?.prompt);
  const context = str(choice?.context);
  return {
    id,
    label,
    ...(kind ? { kind } : {}),
    ...(prompt ? { prompt } : {}),
    ...(context ? { context } : {}),
  };
}

function parseKind(value: unknown): ChoiceKind | undefined {
  return value === 'status_quo' || value === 'change' ? value : undefined;
}
