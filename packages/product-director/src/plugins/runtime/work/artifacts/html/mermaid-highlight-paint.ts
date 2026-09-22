/** Color ER entities, attribute rows, and relationships from highlights JSON. */
export const mermaidHighlightPaintJs = `(function () {
  const raw = document.getElementById('diagram-highlights');
  if (!raw) return;
  let marks = [];
  try { marks = JSON.parse(raw.textContent || '[]'); } catch { return; }
  if (!marks.length) return;
  const stroke = { added: '#8ee09a', modified: '#f0d080', removed: '#f0a0a0' };
  const fill = { added: 'rgba(142,224,154,.22)', modified: 'rgba(240,208,128,.22)', removed: 'rgba(240,160,160,.22)' };
  const textOf = (el) => (el.textContent || '').replace(/\\s+/g, ' ').trim();
  function nodeName(node) {
    const label = node.querySelector('.er.entityLabel, .nodeLabel, .label, title');
    return textOf(label || node).split(/\\s/)[0] || '';
  }
  function paint(svg) {
    for (const mark of marks) {
      const change = mark.change;
      const ref = String(mark.ref || '');
      if (!change || !ref || !stroke[change]) continue;
      if (ref.includes('.')) {
        const [entity, field] = ref.split('.');
        for (const node of svg.querySelectorAll('g.node')) {
          if (nodeName(node).toLowerCase() !== entity.toLowerCase()) continue;
          for (const row of node.querySelectorAll('g[class*="row"], .row-rect-even, .row-rect-odd, text, tspan, foreignObject')) {
            if (!textOf(row).toLowerCase().includes(field.toLowerCase())) continue;
            const target = row.closest('g') || row;
            target.setAttribute('data-mh-hl', change);
            for (const p of target.querySelectorAll('path, rect')) {
              p.style.setProperty('fill', fill[change], 'important');
              p.style.setProperty('stroke', stroke[change], 'important');
            }
            for (const t of target.querySelectorAll('text, tspan')) t.style.setProperty('fill', stroke[change], 'important');
          }
        }
        continue;
      }
      if (ref.includes('--')) {
        const [a, b] = ref.split('--').map((s) => s.trim().toLowerCase());
        for (const edge of svg.querySelectorAll('.er.relationshipLine, path.er.relationshipLine, .edgePath path, .relation')) {
          const g = edge.closest('g') || edge;
          const label = textOf(g);
          const id = (g.id || edge.id || '').toLowerCase();
          if ((a && b && id.includes(a) && id.includes(b)) || label.toLowerCase().includes(a)) {
            edge.style.setProperty('stroke', stroke[change], 'important');
            edge.setAttribute('data-mh-hl', change);
          }
        }
        continue;
      }
      for (const node of svg.querySelectorAll('g.node')) {
        if (nodeName(node).toLowerCase() !== ref.toLowerCase()) continue;
        node.setAttribute('data-mh-hl', change);
        for (const p of node.querySelectorAll('.outer-path path, rect.er.entityBox, .entityBox path, rect')) {
          p.style.setProperty('stroke', stroke[change], 'important');
          p.style.setProperty('stroke-width', '2.4px', 'important');
        }
        for (const t of node.querySelectorAll('.er.entityLabel tspan, .nodeLabel, text')) {
          t.style.setProperty('fill', stroke[change], 'important');
        }
      }
    }
  }
  const ready = (document.getElementById('diagram') || document.querySelector('.mermaid') || document).querySelector('svg');
  if (ready) return paint(ready);
  const obs = new MutationObserver(() => {
    const svg = (document.getElementById('diagram') || document.querySelector('.mermaid'))?.querySelector('svg');
    if (!svg) return;
    obs.disconnect();
    requestAnimationFrame(() => paint(svg));
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
})();`;
