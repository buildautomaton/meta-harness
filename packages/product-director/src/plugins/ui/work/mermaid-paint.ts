export const mermaidBoxSelector =
  '.node rect,.basic.label-container,.label-container,rect.er.entityBox,.er.entityBox rect,g.er.entityBox > rect,.classGroup > rect,rect.actor,.statediagram-state rect';

/** Wait for Mermaid's SVG, then fill flowchart and data-diagram boxes. */
export const mermaidPaintJs = `(function () {
  const root = document.getElementById('diagram') || document.querySelector('.mermaid');
  if (!root) return;
  const ns = 'http://www.w3.org/2000/svg';
  const boxes = '${mermaidBoxSelector}';
  function paint(svg) {
    svg.style.overflow = 'visible';
    let defs = svg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS(ns, 'defs');
      svg.insertBefore(defs, svg.firstChild);
    }
    if (!svg.querySelector('#mhNodeFill')) {
      defs.insertAdjacentHTML('beforeend', [
        '<linearGradient id="mhNodeFill" x1="0" y1="0" x2="0" y2="1">',
        '<stop offset="0%" stop-color="#2a3142"/>',
        '<stop offset="48%" stop-color="#1c2230"/>',
        '<stop offset="100%" stop-color="#151922"/>',
        '</linearGradient>',
        '<linearGradient id="mhClusterFill" x1="0" y1="0" x2="0" y2="1">',
        '<stop offset="0%" stop-color="#1c2230"/>',
        '<stop offset="100%" stop-color="#101218"/>',
        '</linearGradient>',
      ].join(''));
    }
    for (const el of svg.querySelectorAll(boxes)) {
      el.setAttribute('rx', '14');
      el.setAttribute('ry', '14');
      el.style.setProperty('fill', 'url(#mhNodeFill)', 'important');
    }
    for (const el of svg.querySelectorAll('.cluster rect')) {
      el.setAttribute('rx', '18');
      el.setAttribute('ry', '18');
      el.style.setProperty('fill', 'url(#mhClusterFill)', 'important');
    }
    for (const el of svg.querySelectorAll('.outer-path path')) {
      el.style.setProperty('fill', 'url(#mhNodeFill)', 'important');
    }
    for (const fo of svg.querySelectorAll('foreignObject')) {
      if (fo.closest('g.node')) continue;
      for (const el of [fo, ...fo.querySelectorAll('*')]) {
        el.style.setProperty('background', '#171b24', 'important');
        el.style.setProperty('background-color', '#171b24', 'important');
        el.style.setProperty('color', '#e8eaed', 'important');
      }
    }
    for (const el of svg.querySelectorAll('.edgeLabel rect,.edgeLabels rect')) {
      el.style.setProperty('fill', '#171b24', 'important');
    }
  }
  const ready = (document.getElementById('diagram') || document.querySelector('.mermaid') || document).querySelector('svg');
  if (ready) return paint(ready);
  const obs = new MutationObserver(() => {
    const svg = (document.getElementById('diagram') || document.querySelector('.mermaid'))?.querySelector('svg');
    if (!svg) return;
    obs.disconnect();
    paint(svg);
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
})();`;
