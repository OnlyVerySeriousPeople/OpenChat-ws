import {WebSocket} from 'ws';
import eventHandlers from './eventHandlers';
import {EVENTS_FROM} from './events';
import {User} from './types';

export default async function handleConn(
  conn: WebSocket,
  chats: Map<number, WebSocket[]>,
  users: Map<WebSocket, User>,
  db: unknown,
): Promise<void> {
  conn.on('message', async (json: string) => {
    try {
      const {event, data} = JSON.parse(json);

      if (eventHandlers.has(event)) {
        const handler = eventHandlers.get(event);
        if (handler) {
          // @ts-ignore
          await handler(conn, data, chats, users, db);
        }
      } else {
        throw new Error('unknown event');
      }
    } catch (err) {
      conn.send(
        JSON.stringify({type: 'error', message: (err as Error).message}),
      );
    }
  });

  conn.on('close', async () => {
    const handler = eventHandlers.get(EVENTS_FROM.userOffline);
    if (handler) {
      // @ts-ignore
      await handler(conn, {user: null}, chats, users, db);
    }
  });
}
