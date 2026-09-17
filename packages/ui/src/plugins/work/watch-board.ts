function eventsUrl(): string {
  const explicit = import.meta.env.VITE_WORK_EVENTS_URL;
  if (explicit) return explicit;
  if (import.meta.env.DEV) return 'ws://127.0.0.1:3333/api/work/events';
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${window.location.host}/api/work/events`;
}

export function watchBoard(reload: () => void): () => void {
  let cancelled = false;
  let socket: WebSocket | undefined;
  let timer = 0;
  const ping = () => {
    if (!cancelled) reload();
  };
  const startPoll = () => {
    if (!timer && !cancelled) timer = window.setInterval(ping, 2500);
  };
  const connect = () => {
    socket = new WebSocket(eventsUrl());
    socket.onmessage = ping;
    socket.onopen = ping;
    socket.onerror = startPoll;
    socket.onclose = startPoll;
  };
  ping();
  connect();
  return () => {
    cancelled = true;
    socket?.close();
    if (timer) window.clearInterval(timer);
  };
}
