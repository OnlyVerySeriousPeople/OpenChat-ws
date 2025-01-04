import {WebSocket} from 'ws';

export default function handleChatExit(
  conn: WebSocket,
  {chatId}: {chatId: number},
  chats: Map<number, WebSocket[]>,
): void {
  const filteredConns =
    chats.get(chatId)?.filter(chatConn => chatConn !== conn) || [];

  if (filteredConns.length) {
    chats.set(chatId, filteredConns);
  } else {
    chats.delete(chatId);
  }
}
