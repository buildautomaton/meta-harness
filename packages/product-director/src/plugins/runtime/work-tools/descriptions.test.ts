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
    expect(def.description).toMatch(/screen, or a changed component/i);
    expect(def.description).toMatch(/realistic mock data/i);
    expect(def.description).toMatch(/real names/i);
    expect(UI_HTML_DESCRIPTION).toMatch(/typography, color, spacing/i);
    expect(UI_HTML_DESCRIPTION).toMatch(/not an entire page/i);
    expect(UI_HTML_DESCRIPTION).toMatch(/does not need a review questionnaire/i);
    expect(def.description).toMatch(/own controls/i);
    expect(def.description).toMatch(/highlight/i);
    expect(def.description).toMatch(/assets/i);
    expect(def.description).toMatch(/about 10/i);
    expect(def.description).toMatch(/status_quo/i);
    expect(workInstructions(kinds)).toMatch(/design system/i);
    const schema = def.inputSchema as {
      properties: Record<string, { properties?: Record<string, { description?: string }> }>;
    };
    expect(schema.properties.dataModel?.properties?.mermaid?.description).toMatch(/real entities/i);
    expect(schema.properties.moduleStructure?.properties?.mermaid?.description).toMatch(/real module/i);
  });
});
