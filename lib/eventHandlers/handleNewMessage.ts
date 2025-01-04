import {WebSocket} from 'ws';
import {EVENTS_TO} from '../events';
import sendEvent from '../sendEvent';
import prepareMessage from './utils/prepareMessage';
import {User} from '../types';

export default async function handleNewMessage(
  conn: WebSocket,
  {message: {body, chatId}}: {message: {body: string; chatId: number}},
  chats: Map<number, WebSocket[]>,
  users: Map<WebSocket, User>,
  db: unknown,
): Promise<void> {
  const user = users.get(conn);
  if (!user) return;

  const timestamp = Date.now();
  // @ts-ignore
  const messageId = await db.message.create({
    body,
    timestamp,
    chatId,
    userId: user.id,
  });

  // @ts-ignore
  const message = await db.message.get(messageId);
  const preparedMessage = await prepareMessage(message, db);

  chats.get(chatId)?.forEach(chatConn => {
    if (chatConn.readyState === WebSocket.OPEN) {
      sendEvent(chatConn, EVENTS_TO.newMessage, {message: preparedMessage});
    }
  });
}
