import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';

describe('BalanceController', () => {
  let controller: BalanceController;
  let balanceService: BalanceService;

  const mockBalanceService = {
    getBalance: jest.fn(),
    setBalance: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [
        {
          provide: BalanceService,
          useValue: mockBalanceService,
        },
      ],
    }).compile();

    controller = module.get<BalanceController>(BalanceController);
    balanceService = module.get<BalanceService>(BalanceService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getBalance', () => {
    it('should return balance from service', async () => {
      mockBalanceService.getBalance.mockResolvedValueOnce(500);

      const userId = 'user123';
      const result = await controller.getBalance(userId);

      expect(balanceService.getBalance).toHaveBeenCalledWith(userId);
      expect(result).toBe(500);
    });
  });

  describe('updateBalance', () => {
    it('should update and return new balance', async () => {
      const userId = 'user123';
      const newBalance = 1000;

      mockBalanceService.setBalance.mockResolvedValueOnce(newBalance);

      const result = await controller.updateBalance(userId, newBalance);

      expect(balanceService.setBalance).toHaveBeenCalledWith(userId, newBalance);
      expect(result).toBe(newBalance);
    });
  });
});
