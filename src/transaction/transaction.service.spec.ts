import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionDto } from './dto/transaction.dto';

describe('TransactionService', () => {
  let service: TransactionService;

  const redisMock = {
    lpush: jest.fn(),
    lrange: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: 'REDIS',
          useValue: redisMock,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addTransaction', () => {
    it('should call redis.lpush with correct key and stringified tx', async () => {
      redisMock.lpush.mockResolvedValueOnce(1);
      const userId = 'user1';
      const tx: TransactionDto = {
        action_id: 'a1',
        action: 'deposit',
        amount: 100,
        processed_at: new Date().toISOString(),
      };

      await service.addTransaction(userId, tx);

      expect(redisMock.lpush).toHaveBeenCalledWith(
        `tx:${userId}`,
        JSON.stringify(tx),
      );
    });
  });

  describe('getTransactions', () => {
    it('should return parsed transactions from redis.lrange', async () => {
      const storedTxs = [
        JSON.stringify({
          action_id: 'a1',
          action: 'deposit',
          amount: 100,
          processed_at: '2025-06-22T18:00:00.000Z',
        }),
        JSON.stringify({
          action_id: 'a2',
          action: 'withdraw',
          amount: 200,
          processed_at: '2025-06-21T12:30:00.000Z',
        }),
      ];
      redisMock.lrange.mockResolvedValueOnce(storedTxs);

      const result = await service.getTransactions('user1');

      expect(redisMock.lrange).toHaveBeenCalledWith('tx:user1', 0, 20);
      expect(result).toEqual([
        {
          action_id: 'a1',
          action: 'deposit',
          amount: 100,
          processed_at: '2025-06-22T18:00:00.000Z',
        },
        {
          action_id: 'a2',
          action: 'withdraw',
          amount: 200,
          processed_at: '2025-06-21T12:30:00.000Z',
        },
      ]);
    });

    it('should return empty array if redis returns empty list', async () => {
      redisMock.lrange.mockResolvedValueOnce([]);

      const result = await service.getTransactions('user1');

      expect(result).toEqual([]);
    });
  });
});
