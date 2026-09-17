import { describe, expect, it } from 'vitest';
import { TELL_WHAT_WAS_BUILT_DESCRIPTION } from './descriptions.js';
import { TELL_WHAT_WAS_BUILT_DEFINITION } from './tell-def.js';
import { WORK_INSTRUCTIONS } from './instructions.js';
import { UI_HTML_DESCRIPTION } from './schema/ui-copy.js';

describe('tell_what_was_built copy', () => {
  it('asks for app style, component-or-screen previews, and realistic mock data', () => {
    expect(TELL_WHAT_WAS_BUILT_DESCRIPTION).toMatch(/design system/i);
    expect(TELL_WHAT_WAS_BUILT_DESCRIPTION).toMatch(/screen, or a changed component/i);
    expect(TELL_WHAT_WAS_BUILT_DESCRIPTION).toMatch(/realistic mock data/i);
    expect(TELL_WHAT_WAS_BUILT_DESCRIPTION).toMatch(/real names/i);
    expect(UI_HTML_DESCRIPTION).toMatch(/typography, color, spacing/i);
    expect(UI_HTML_DESCRIPTION).toMatch(/not an entire page/i);
    expect(UI_HTML_DESCRIPTION).toMatch(/does not need a review questionnaire/i);
    expect(UI_HTML_DESCRIPTION).not.toMatch(/do not include review questions, radios/i);
    expect(TELL_WHAT_WAS_BUILT_DESCRIPTION).toMatch(/own controls/i);
    expect(TELL_WHAT_WAS_BUILT_DESCRIPTION).toMatch(/highlight/i);
    expect(TELL_WHAT_WAS_BUILT_DESCRIPTION).toMatch(/assets/i);
    expect(WORK_INSTRUCTIONS).toMatch(/design system/i);
    const schema = TELL_WHAT_WAS_BUILT_DEFINITION.inputSchema as {
      properties: Record<string, { properties?: Record<string, { description?: string }> }>;
    };
    expect(schema.properties.dataModel?.properties?.mermaid?.description).toMatch(/real entities/i);
    expect(schema.properties.moduleStructure?.properties?.mermaid?.description).toMatch(/real module/i);
  });
});
