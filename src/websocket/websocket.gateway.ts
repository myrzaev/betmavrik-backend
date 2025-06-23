import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  sendBalanceUpdate(userId: string, balance: number) {
    this.server.emit(`balance:${userId}`, { balance });
  }
}
