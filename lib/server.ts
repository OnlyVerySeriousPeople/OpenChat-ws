import 'dotenv/config';
import {WebSocket, WebSocketServer} from 'ws';
import handleConn from './handleConn';
import {User} from './types';

const HOST = process.env.WS_HOST || 'localhost';
const PORT = parseInt(process.env.WS_PORT || '8001');
const SHUTDOWN_TIME = 5;

const close = async (
  server: WebSocketServer,
  db: unknown,
  log: any,
): Promise<void> => {
  try {
    await new Promise<void>((resolve, reject) => {
      server.clients.forEach(client => {
        client.close(1000, 'server is shutting down');
      });
      setTimeout(() => {
        server.close(err => {
          if (err) reject(err);
          resolve();
        });
      }, SHUTDOWN_TIME);
    });
    // @ts-ignore
    await db.close();
    log.info('WebSocket server has been shut down successfully');
    log.close();
  } catch (err: any) {
    log.error(`WebSocket server shutdown failed: ${err.message}`);
    throw err;
  }
};

export default (db: unknown, log: any): void => {
  const server = new WebSocketServer({host: HOST, port: PORT});
  log.info(`WebSocket server running at ws://${HOST}:${PORT}`);

  const users = new Map<WebSocket, User>();
  const chats = new Map<number, WebSocket[]>();

  server.on('connection', conn => handleConn(conn, chats, users, db));

  const shutdown = () => close(server, db, log);
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};
