import { describe, expect, it } from 'vitest';
import { QUESTIONS_SCHEMA } from './questions-schema.js';
import { CHOICE_KIND_SCHEMA } from './choice-schema.js';

describe('QUESTIONS_SCHEMA', () => {
  it('asks for important decisions and a status_quo kind', () => {
    expect(QUESTIONS_SCHEMA.description).toMatch(/about 10/i);
    expect(QUESTIONS_SCHEMA.description).toMatch(/important decisions/i);
    expect(QUESTIONS_SCHEMA.description).toMatch(/preferring fewer/i);
    expect(QUESTIONS_SCHEMA.description).toMatch(/status_quo/i);
    expect(QUESTIONS_SCHEMA.description).toMatch(/No changes badge/i);
    expect(CHOICE_KIND_SCHEMA.enum).toEqual(['status_quo', 'change']);
    expect(CHOICE_KIND_SCHEMA.description).toMatch(/No changes/i);
    expect(CHOICE_KIND_SCHEMA.description).toMatch(/aggressive/i);
    const overview = QUESTIONS_SCHEMA.properties.overview as { maxItems?: number };
    expect(overview.maxItems).toBeUndefined();
  });
});
