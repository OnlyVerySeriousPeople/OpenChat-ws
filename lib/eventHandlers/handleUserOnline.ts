import {WebSocket} from 'ws';
import {EVENTS_TO} from '../events';
import sendEvent from '../sendEvent';
import prepareMessages from './utils/prepareMessages';
import {ChatHistory, User} from '../types';

export default async function handleUserOnline(
  conn: WebSocket,
  {user}: {user: User} | {user: null},
  chats: Map<number, WebSocket[]>,
  users: Map<WebSocket, User>,
  db: unknown,
): Promise<void> {
  if (user) {
    users.set(conn, user);
  }
  // @ts-ignore
  const chatIds = await db.user.getChatIds(user.id);
  chatIds.forEach((id: number) => {
    if (!chats.has(id)) chats.set(id, []);
    chats.get(id)?.push(conn);
  });

  const history: Record<string, ChatHistory> = Object.fromEntries(
    await Promise.all(
      chatIds.map(async (id: number) => {
        // @ts-ignore
        const chat = await db.chat.get(id);
        return [id, {...chat, messages: await prepareMessages(id, db)}];
      }),
    ),
  );

  sendEvent(conn, EVENTS_TO.chatsHistory, {history});
}
