import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from './balance.service';

describe('BalanceService', () => {
  let service: BalanceService;

  const redisMock = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        {
          provide: 'REDIS',
          useValue: redisMock,
        },
      ],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBalance', () => {
    it('should return parsed balance from redis', async () => {
      redisMock.get.mockResolvedValueOnce('1500');
      const result = await service.getBalance('user1');
      expect(redisMock.get).toHaveBeenCalledWith('balance:user1');
      expect(result).toBe(1500);
    });

    it('should return default balance 1000 if redis returns null', async () => {
      redisMock.get.mockResolvedValueOnce(null);
      const result = await service.getBalance('user1');
      expect(result).toBe(1000);
    });
  });

  describe('setBalance', () => {
    it('should set balance in redis and return it', async () => {
      redisMock.set.mockResolvedValueOnce('OK');
      const result = await service.setBalance('user1', 2000);
      expect(redisMock.set).toHaveBeenCalledWith('balance:user1', 2000);
      expect(result).toBe(2000);
    });
  });
});
