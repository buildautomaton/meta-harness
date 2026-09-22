import { describe, expect, it } from 'vitest';
import { QUESTIONS_SCHEMA } from './questions-schema.js';
import { CHOICE_KIND_SCHEMA, RECOMMENDED_SCHEMA } from './choice-schema.js';

describe('QUESTIONS_SCHEMA', () => {
  it('caps review questions and requires status_quo plus recommended', () => {
    expect(QUESTIONS_SCHEMA.description).toMatch(/at most 3/i);
    expect(QUESTIONS_SCHEMA.description).toMatch(/status_quo/i);
    expect(QUESTIONS_SCHEMA.description).toMatch(/recommended/i);
    expect(QUESTIONS_SCHEMA.description).toMatch(/No changes badge/i);
    expect(CHOICE_KIND_SCHEMA.enum).toEqual(['status_quo', 'change']);
    expect(CHOICE_KIND_SCHEMA.description).toMatch(/No changes/i);
    expect(CHOICE_KIND_SCHEMA.description).toMatch(/aggressive/i);
    expect(RECOMMENDED_SCHEMA.type).toBe('boolean');
    const overview = QUESTIONS_SCHEMA.properties.overview as { maxItems?: number };
    expect(overview.maxItems).toBe(3);
  });
});
