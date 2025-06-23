import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketGateway } from './websocket.gateway';

describe('WebsocketGateway', () => {
  let gateway: WebsocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsocketGateway],
    }).compile();

    gateway = module.get<WebsocketGateway>(WebsocketGateway);

    gateway.server = {
      emit: jest.fn(),
    } as any;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('sendBalanceUpdate', () => {
    it('should emit balance update event with correct arguments', () => {
      const userId = 'user123';
      const balance = 456;

      gateway.sendBalanceUpdate(userId, balance);

      expect(gateway.server.emit).toHaveBeenCalledWith(
        `balance:${userId}`,
        { balance }
      );
    });
  });
});
