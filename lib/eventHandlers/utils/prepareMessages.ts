import prepareMessage from './prepareMessage';
import {Message} from '../../types';

export default async function prepareMessages(
  chatId: number,
  db: unknown,
): Promise<Message[]> {
  // @ts-ignore
  const messages = await db.chat.getMessages(chatId);
  return Promise.all(
    messages.map(async (message: Message) => prepareMessage(message, db)),
  );
}
