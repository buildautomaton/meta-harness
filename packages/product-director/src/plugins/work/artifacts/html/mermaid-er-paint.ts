import { mermaidErMarksJs } from './mermaid-er-marks.js';

export const mermaidErPaintJs = `(function () {
  ${mermaidErMarksJs}
  const root = document.getElementById('diagram') || document.querySelector('.mermaid');
  if (!root) return;
  const ns = 'http://www.w3.org/2000/svg';
  function ensureFill(svg, defs) {
    if (svg.querySelector('#mhNodeFill')) return;
    defs.insertAdjacentHTML('beforeend', '<linearGradient id="mhNodeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a3142"/><stop offset="48%" stop-color="#1c2230"/><stop offset="100%" stop-color="#151922"/></linearGradient>');
  }
  function paint(svg) {
    let defs = svg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS(ns, 'defs');
      svg.insertBefore(defs, svg.firstChild);
    }
    ensureFill(svg, defs);
    if (!svg.querySelector('#mhNodeShadow')) {
      defs.insertAdjacentHTML('beforeend', '<filter id="mhNodeShadow" x="-25%" y="-25%" width="150%" height="150%"><feDropShadow dx="0" dy="4" stdDeviation="4.5" flood-color="#000" flood-opacity="0.45"/></filter>');
    }
    for (const node of svg.querySelectorAll('g.node')) {
      const outer = node.querySelector('.outer-path');
      if (!outer || node.getAttribute('data-mh-er')) continue;
      const b = outer.getBBox();
      if (!(b.width > 1 && b.height > 1)) continue;
      node.setAttribute('data-mh-er', '1');
      const id = ('mhErClip-' + (node.id || Math.random().toString(36).slice(2))).replace(/[^a-zA-Z0-9_-]/g, '');
      defs.insertAdjacentHTML('beforeend', '<clipPath id="' + id + '"><rect x="' + b.x + '" y="' + b.y + '" width="' + b.width + '" height="' + b.height + '" rx="14" ry="14"/></clipPath>');
      const shadow = document.createElementNS(ns, 'rect');
      ['x','y','width','height'].forEach((k, i) => shadow.setAttribute(k, String([b.x, b.y, b.width, b.height][i])));
      shadow.setAttribute('rx', '14');
      shadow.setAttribute('ry', '14');
      shadow.setAttribute('fill', 'url(#mhNodeFill)');
      shadow.setAttribute('filter', 'url(#mhNodeShadow)');
      const t = node.getAttribute('transform');
      if (t) shadow.setAttribute('transform', t);
      node.parentNode.insertBefore(shadow, node);
      node.setAttribute('clip-path', 'url(#' + id + ')');
      for (const p of node.querySelectorAll('.outer-path path')) p.style.setProperty('fill', 'url(#mhNodeFill)', 'important');
      for (const p of node.querySelectorAll('.row-rect-even path')) p.style.setProperty('fill', '#1c2230', 'important');
      for (const p of node.querySelectorAll('.row-rect-odd path')) p.style.setProperty('fill', '#151922', 'important');
    }
    scaleErMarks(svg);
  }
  const ready = (document.getElementById('diagram') || document.querySelector('.mermaid') || document).querySelector('svg');
  if (ready) return paint(ready);
  const obs = new MutationObserver(() => {
    const svg = (document.getElementById('diagram') || document.querySelector('.mermaid'))?.querySelector('svg');
    if (!svg) return;
    obs.disconnect();
    requestAnimationFrame(() => requestAnimationFrame(() => paint(svg)));
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
})();`;
