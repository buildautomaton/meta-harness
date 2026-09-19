export function childScrollTop(
  elTop: number,
  parentTop: number,
  parentScrollTop: number,
  pad = 8,
): number {
  return Math.max(0, elTop - parentTop + parentScrollTop - pad);
}

export function isYScrollable(el: HTMLElement): boolean {
  const { overflowY } = getComputedStyle(el);
  return el.scrollHeight - el.clientHeight > 1 && (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay');
}

export function revealElement(el: HTMLElement): void {
  const parents: HTMLElement[] = [];
  let node = el.parentElement;
  while (node) {
    if (isYScrollable(node)) parents.push(node);
    node = node.parentElement;
  }
  for (const parent of parents) {
    parent.scrollTop = childScrollTop(
      el.getBoundingClientRect().top,
      parent.getBoundingClientRect().top,
      parent.scrollTop,
    );
  }
}
