import { describe, expect, it } from 'vitest';
import { wrapMermaidPage } from './wrap-mermaid.js';

describe('wrapMermaidPage', () => {
  it('includes rounded boxes, shadows, and arrow colors', () => {
    const html = wrapMermaidPage({
      title: 'Modules',
      kicker: 'Module structure',
      whatChanged: 'Split cover editor',
      mermaid: 'flowchart TD\n  A --> B',
    });
    expect(html).toContain('drop-shadow');
    expect(html).toContain('mhNodeFill');
    expect(html).toContain('#7eb6ff');
    expect(html).toContain('g.er.entityBox');
    expect(html).toContain('outer-path');
    expect(html).toContain('mhErClip');
    expect(html).toContain('#101218');
    expect(html).toContain('labelBkg');
    expect(html).toContain('#171b24');
    expect(html).toContain('::-webkit-scrollbar-thumb');
    expect(html).toContain('scaleErMarks');
    expect(html).toContain('_er-');
    expect(html).toContain('ONLY_ONE');
  });
});
