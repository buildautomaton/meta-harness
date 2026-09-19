import type { DesignChoice } from '@/types/work/questions.js';

export function parseStoredChoices(raw: string): DesignChoice[] {
  try {
    const parsed = JSON.parse(raw) as DesignChoice[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function choiceForId(raw: string, choiceId: string): DesignChoice | undefined {
  return parseStoredChoices(raw).find((choice) => choice.id === choiceId);
}
