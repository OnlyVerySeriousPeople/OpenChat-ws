import {EVENTS_FROM as events} from '../events';
import handleChatExit from './handleChatExit';
import handleChatJoining from './handleChatJoining';
import handleNewChat from './handleNewChat';
import handleNewMessage from './handleNewMessage';
import handleUserOffline from './handleUserOffline';
import handleUserOnline from './handleUserOnline';

// @ts-ignore
export default new Map([
  [events.userOnline, handleUserOnline],
  [events.userOffline, handleUserOffline],
  [events.newChat, handleNewChat],
  [events.chatJoining, handleChatJoining],
  [events.chatExit, handleChatExit],
  [events.newMessage, handleNewMessage],
]);
