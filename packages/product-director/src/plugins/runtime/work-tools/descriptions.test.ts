import { describe, expect, it } from 'vitest';
import { tellWhatWasBuiltDefinition } from './tell-def.js';
import { workInstructions } from './instructions.js';
import { UI_HTML_DESCRIPTION } from './schema/ui-copy.js';
import { builtinArtifactKinds } from '../artifacts/builtins.js';

describe('tell_product_director_what_was_built copy', () => {
  it('composes param copy from registered artifact plugins', () => {
    const kinds = builtinArtifactKinds();
    const def = tellWhatWasBuiltDefinition(kinds);
    expect(def.description).toMatch(/design system/i);
    expect(def.description).toMatch(/banner:\s*\{\s*change,\s*text\s*\}/i);
    expect(def.description).toMatch(/no New badges/i);
    expect(UI_HTML_DESCRIPTION).toMatch(/typography, color, spacing/i);
    expect(UI_HTML_DESCRIPTION).toMatch(/not an entire page/i);
    expect(UI_HTML_DESCRIPTION).toMatch(/does not need a review questionnaire/i);
    expect(workInstructions(kinds)).toMatch(/design system/i);
    expect(workInstructions(kinds)).toMatch(/own controls/i);
    expect(workInstructions(kinds)).toMatch(/assets/i);
    expect(def.description).toMatch(/about 10/i);
    expect(def.description).toMatch(/status_quo/i);
    expect(def.description).toMatch(/project/i);
    expect((def.inputSchema as { required: string[] }).required).toContain('project');
    const schema = def.inputSchema as {
      properties: Record<string, { properties?: Record<string, { description?: string }> }>;
    };
    expect(schema.properties.dataModel?.properties?.mermaid?.description).toMatch(/real entities/i);
    expect(schema.properties.summary?.properties?.areas?.description).toMatch(/area/i);
    expect(def.description).toMatch(/2–3 plain-language sentences/i);
    expect(def.description).toMatch(/green\/yellow\/red/i);
  });
});
