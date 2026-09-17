import type { WorkClient } from './types.js';
import { loadBoard, type WorkBoard } from './load-board.js';

export function watchBoard(client: WorkClient, onData: (board: WorkBoard) => void): () => void {
  let cancelled = false;
  const load = () =>
    loadBoard(client).then(
      (next) => {
        if (!cancelled) onData(next);
      },
      () => {
        if (!cancelled) onData({ artifacts: [], items: [] });
      },
    );
  void load();
  const timer = window.setInterval(() => void load(), 2500);
  const onFocus = () => void load();
  window.addEventListener('focus', onFocus);
  return () => {
    cancelled = true;
    window.clearInterval(timer);
    window.removeEventListener('focus', onFocus);
  };
}
