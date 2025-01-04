import {Message} from '../../types';

export default async function prepareMessage(
  message: Message,
  db: unknown,
): Promise<any> {
  // @ts-ignore
  const user = message.userId ? await db.user.get(message.userId) : null;
  return {...message, user};
}
