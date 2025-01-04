import {WebSocket} from 'ws';
import {EVENTS_TO} from '../events';
import sendEvent from '../sendEvent';
import prepareMessages from './utils/prepareMessages';
import {ChatHistory} from '../types';

export default async function handleChatJoining(
  conn: WebSocket,
  {chatId}: {chatId: number},
  chats: Map<number, WebSocket[]>,
  _: unknown,
  db: unknown,
): Promise<void> {
  if (!chats.has(chatId)) chats.set(chatId, []);
  chats.get(chatId)?.push(conn);

  // @ts-ignore
  const chat = await db.chat.get(chatId);
  const history: ChatHistory = {
    ...chat,
    messages: await prepareMessages(chatId, db),
  };

  sendEvent(conn, EVENTS_TO.chatHistory, {history});
}
