/** Changes-overview table: equal columns, fixed change marks, scrollable path lists. */
export const CHANGES_OVERVIEW_CSS = `
.changes-overview { table-layout: fixed; width: 100%; }
.changes-overview th, .changes-overview td { width: 50%; }
.changes-overview .path-scroll { max-height: 7.5em; overflow: auto; }
.changes-overview td .path-list li { padding: 2px 0; border-bottom: 0; min-width: 0; }
.changes-overview td .path-list .change {
  flex: 0 0 18px; width: 18px; height: 18px; min-width: 18px; min-height: 18px;
}
.changes-overview td .path-list code { min-width: 0; overflow-wrap: anywhere; }
.path-added { color: #8ee09a; }
.path-modified { color: #f0d080; }
.path-removed { color: #f0a0a0; }
`.trim();
