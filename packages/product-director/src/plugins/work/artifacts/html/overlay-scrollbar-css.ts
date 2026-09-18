/** Thumb-only overlay scrollbar: hidden until hover, no track. */
export const OVERLAY_SCROLLBAR_CSS = `
* { scrollbar-width: thin; scrollbar-color: transparent transparent; }
*:hover { scrollbar-color: rgba(154, 163, 178, 0.45) transparent; }
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track, ::-webkit-scrollbar-corner { background: transparent; }
::-webkit-scrollbar-thumb { background: transparent; border-radius: 999px; }
*:hover::-webkit-scrollbar-thumb { background: rgba(154, 163, 178, 0.45); }
`.trim();
