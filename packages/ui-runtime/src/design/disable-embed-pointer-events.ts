/** Iframes steal pointer events; disable them while a split handle is dragged. */
export function disableEmbedPointerEvents(): () => void {
  const style = document.createElement('style');
  style.setAttribute('data-split-resize-embeds', 'true');
  style.textContent = 'iframe, embed, object { pointer-events: none !important; }';
  document.head.appendChild(style);
  return () => style.remove();
}
