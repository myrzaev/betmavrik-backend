import { Test, TestingModule } from '@nestjs/testing';
import { AllinGameController } from './allin-game.controller';
import { BalanceService } from '../balance/balance.service';
import { TransactionService } from '../transaction/transaction.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { PlayRequestDto } from './dto/play-request.dto';

describe('AllinGameController', () => {
  let controller: AllinGameController;
  let balanceService: BalanceService;
  let transactionService: TransactionService;
  let websocketGateway: WebsocketGateway;

  beforeEach(async () => {
    const mockBalanceService = {
      getBalance: jest.fn(),
      setBalance: jest.fn(),
    };

    const mockTransactionService = {
      addTransaction: jest.fn(),
    };

    const mockWebsocketGateway = {
      sendBalanceUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllinGameController],
      providers: [
        { provide: BalanceService, useValue: mockBalanceService },
        { provide: TransactionService, useValue: mockTransactionService },
        { provide: WebsocketGateway, useValue: mockWebsocketGateway },
      ],
    }).compile();

    controller = module.get<AllinGameController>(AllinGameController);
    balanceService = module.get<BalanceService>(BalanceService);
    transactionService = module.get<TransactionService>(TransactionService);
    websocketGateway = module.get<WebsocketGateway>(WebsocketGateway);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle playRequest and return updated balance with transactions', async () => {
    const mockUserId = 'user-123';
    const mockInitialBalance = 1000;

    const body: PlayRequestDto = {
      user_id: mockUserId,
      currency: 'EUR',
      actions: [
        { action: 'bet', amount: 100, action_id: 'a1' },
        { action: 'win', amount: 200, action_id: 'a2' },
      ],
    };

    (balanceService.getBalance as jest.Mock).mockResolvedValue(mockInitialBalance);
    (transactionService.addTransaction as jest.Mock).mockResolvedValue(undefined);

    const result = await controller.playRequest(body);

    expect(balanceService.getBalance).toHaveBeenCalledWith(mockUserId);
    expect(transactionService.addTransaction).toHaveBeenCalledTimes(2);
    expect(balanceService.setBalance).toHaveBeenCalledWith(mockUserId, 1100); // 1000 - 100 + 200
    expect(websocketGateway.sendBalanceUpdate).toHaveBeenCalledWith(mockUserId, 1100);

    expect(result.balance).toBe(1100);
    expect(result.transactions).toBeDefined();
    expect(result.transactions).toHaveLength(2);
    expect(result.transactions?.[0]).toEqual(
      expect.objectContaining({
        action_id: 'a1',
        action: 'bet',
        amount: 100,
        processed_at: expect.any(String),
      }),
    );
    expect(result.transactions?.[1]).toEqual(
      expect.objectContaining({
        action_id: 'a2',
        action: 'win',
        amount: 200,
        processed_at: expect.any(String),
      }),
    );
  });
});
