import { describe, expect, it } from 'vitest';
import { titleFromPrompt } from './draft-title.js';

describe('titleFromPrompt', () => {
  it('uses the first line', () => {
    expect(titleFromPrompt('Ship login\nwith OAuth')).toBe('Ship login');
  });

  it('falls back when empty', () => {
    expect(titleFromPrompt('   ')).toBe('Draft');
  });
});
