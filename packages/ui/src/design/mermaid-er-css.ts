/** Crow's-foot / bar / circle marks: stroke like arrows, not filled arrowheads. */
export const MERMAID_ER_CSS = `
.er.relationshipLine { stroke-width: 1.5 !important; }
marker[id*='_er-'] path, marker[id*='ONLY_ONE'] path, marker[id*='ZERO_OR'] path, marker[id*='ONE_OR_MORE'] path {
  fill: none !important;
  stroke: #8ec0ff !important;
}
marker[id*='mdParent'] path, marker[id*='MD_PARENT'] path {
  fill: #101218 !important;
  stroke: #8ec0ff !important;
}
marker[id*='_er-'] circle, marker[id*='ZERO_OR'] circle {
  fill: #101218 !important;
  stroke: #8ec0ff !important;
}
`.trim();
