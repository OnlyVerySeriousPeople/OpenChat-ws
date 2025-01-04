import {WebSocket} from 'ws';

export default function handleNewChat(
  conn: WebSocket,
  {chatId}: {chatId: number},
  chats: Map<number, WebSocket[]>,
): void {
  chats.set(chatId, [conn]);
}
