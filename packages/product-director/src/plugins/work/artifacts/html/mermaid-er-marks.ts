/** Shrink ER cardinality markers into user space so CSS px strokes cannot inflate them. */
export const mermaidErMarksJs = `
function scaleErMarks(svg) {
  const ids = /_er-|ONLY_ONE|ZERO_OR_ONE|ONE_OR_MORE|ZERO_OR_MORE|MD_PARENT/;
  for (const m of svg.querySelectorAll('marker')) {
    if (!ids.test(m.id || '') || m.getAttribute('data-mh-er-mk')) continue;
    m.setAttribute('data-mh-er-mk', '1');
    m.setAttribute('markerUnits', 'userSpaceOnUse');
    const w = +m.getAttribute('markerWidth') || 0;
    const h = +m.getAttribute('markerHeight') || 0;
    if (w && h) {
      m.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      m.setAttribute('markerWidth', String(Math.max(8, w * 0.6)));
      m.setAttribute('markerHeight', String(Math.max(8, h * 0.6)));
    }
    const fill = /mdParent|MD_PARENT/.test(m.id) ? '#101218' : 'none';
    for (const p of m.querySelectorAll('path')) {
      p.style.setProperty('fill', fill, 'important');
      p.style.setProperty('stroke', '#8ec0ff', 'important');
      p.style.setProperty('stroke-width', '2.4', 'important');
    }
    for (const c of m.querySelectorAll('circle')) {
      c.style.setProperty('fill', '#101218', 'important');
      c.style.setProperty('stroke', '#8ec0ff', 'important');
      c.style.setProperty('stroke-width', '2.4', 'important');
    }
  }
}
(function watchErMarks() {
  const tick = () => {
    const svg = (document.getElementById('diagram') || document.querySelector('.mermaid') || document).querySelector('svg');
    if (svg) scaleErMarks(svg);
  };
  tick();
  const obs = new MutationObserver(tick);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(() => obs.disconnect(), 4000);
})();
`.trim();
