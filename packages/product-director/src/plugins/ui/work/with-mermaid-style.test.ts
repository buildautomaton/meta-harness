import { describe, expect, it } from 'vitest';
import { withMermaidStyle } from './with-mermaid-style.js';

describe('withMermaidStyle', () => {
  it('injects overlay scrollbar css into any html', () => {
    const next = withMermaidStyle('<p>hello</p>');
    expect(next).toContain('data-mh-scrollbar');
    expect(next).toContain('::-webkit-scrollbar-thumb');
    expect(next).not.toContain('data-mh-mermaid-style');
  });

  it('injects rounded-box css and gradient paint', () => {
    const html = '<html><head></head><body><pre class="mermaid"></pre></body></html>';
    const next = withMermaidStyle(html);
    expect(next).toContain('data-mh-scrollbar');
    expect(next).toContain('data-mh-mermaid-style');
    expect(next).toContain('drop-shadow');
    expect(next).toContain('mhNodeFill');
    expect(next).toContain('#7eb6ff');
    expect(next).toContain('labelBkg');
    expect(next).toContain('#171b24');
    expect(next).toContain('outer-path');
    expect(next).toContain('mhErClip');
    expect(next).toContain('scaleErMarks');
    expect(next).toContain('_er-');
    expect(next).toContain('ONLY_ONE');
  });
});
