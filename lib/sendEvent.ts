import {WebSocket} from 'ws';

export default function sendEvent(
  conn: WebSocket,
  event: string,
  data: unknown,
): void {
  conn.send(JSON.stringify({event, data}), {binary: false});
}
