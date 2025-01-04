import handleChatExit from './handleChatExit';
import {WebSocket} from 'ws';
import {User} from '../types';

export default function handleUserOffline(
  conn: WebSocket,
  _data: unknown,
  chats: Map<number, WebSocket[]>,
  users: Map<WebSocket, User>,
): void {
  chats.forEach((_chatConns, chatId) => handleChatExit(conn, {chatId}, chats));
  users.delete(conn);
}
