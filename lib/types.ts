export type Message = {
  id: number;
  body: string;
  timestamp: number;
  chatId: number;
  userId: number;
};

export type Chat = {
  id: number;
  tag: string;
  name: string;
};

export type ChatHistory = {
  chat: Chat;
  messages: Message[];
};

export type User = {
  id: number;
  tag: string;
  firstName: string;
  lastName: string;
};
