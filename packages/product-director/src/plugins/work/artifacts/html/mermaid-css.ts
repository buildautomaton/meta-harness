import { MERMAID_ER_CSS } from './mermaid-er-css.js';

export const MERMAID_BOX_CSS = `
html, body { background: #101218 !important; color: #e8eaed !important; color-scheme: dark; --labelBkg: #171b24; }
.kicker { color: #7eb6ff !important; }
h1 { color: #e8eaed !important; }
.changed { color: #9aa3b2 !important; }
.mermaid, .mermaid svg { overflow: visible !important; --labelBkg: #171b24; }
pre.mermaid { background: transparent !important; border: 0 !important; padding: 8px 0 !important; }
.node rect, .basic.label-container, .label-container,
rect.er.entityBox, .er.entityBox rect, g.er.entityBox > rect,
.classGroup > rect, rect.actor, .statediagram-state rect {
  rx: 14px !important;
  ry: 14px !important;
  fill: #1c2230 !important;
  stroke: #3a4458 !important;
  stroke-width: 1.15px !important;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.35))
    drop-shadow(0 8px 16px rgba(0, 0, 0, 0.42));
}
.cluster rect {
  rx: 18px !important;
  ry: 18px !important;
  fill: #151922 !important;
  stroke: #2a3140 !important;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.35));
}
.nodeLabel, .classLabel, .er.entityLabel tspan {
  font-weight: 500;
  letter-spacing: -0.015em;
  color: #e8eaed !important;
  fill: #e8eaed !important;
}
.edgePath .path, .flowchart-link, .relation, .er.relationshipLine, .transition,
.messageLine0, .messageLine1 {
  stroke: #7eb6ff !important;
  stroke-width: 1.9px !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
  fill: none !important;
}
marker path, .arrowMarkerPath, .arrowheadPath, .marker {
  fill: #8ec0ff !important;
  stroke: #8ec0ff !important;
}
.edgeLabel rect, g.edgeLabel rect, .edgeLabels rect {
  rx: 8px !important;
  ry: 8px !important;
  fill: #171b24 !important;
  stroke: #2a3140 !important;
}
g.node:has(.outer-path) {
  clip-path: inset(0 round 16px);
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.35))
    drop-shadow(0 8px 16px rgba(0, 0, 0, 0.42));
}
g.node .outer-path path, g.node path.outer-path {
  fill: #1c2230 !important;
  stroke: #3a4458 !important;
  stroke-width: 1.15px !important;
}
g.node .row-rect-even path { fill: #1c2230 !important; stroke: none !important; }
g.node .row-rect-odd path { fill: #151922 !important; stroke: none !important; }
g.node .divider path { stroke: #2a3140 !important; }
g.node foreignObject div, g.node foreignObject span {
  background: transparent !important;
  color: #e8eaed !important;
}
g.node text, g.node tspan { fill: #e8eaed !important; }
.edgePaths path, .relation, .er.relationshipLine {
  stroke: #7eb6ff !important;
  stroke-width: 1.9px !important;
  fill: none !important;
}
.edgeLabel, .edgeLabel *, .labelBkg, .edgeLabels foreignObject,
.edgeLabels foreignObject div, .edgeLabels foreignObject span,
.edgeLabels foreignObject p {
  color: #e8eaed !important;
  background: #171b24 !important;
  background-color: #171b24 !important;
}
${MERMAID_ER_CSS}
`.trim();
