import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BalanceService } from '../balance/balance.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { UserCreationDto } from './dto/user-creation.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let balanceService: BalanceService;
  let transactionService: TransactionService;

  const mockUserService = {
    getUser: jest.fn(),
    createUser: jest.fn(),
  };

  const mockBalanceService = {
    getBalance: jest.fn(),
  };

  const mockTransactionService = {
    getTransactions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: BalanceService, useValue: mockBalanceService },
        { provide: TransactionService, useValue: mockTransactionService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    balanceService = module.get<BalanceService>(BalanceService);
    transactionService = module.get<TransactionService>(TransactionService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should return user data with balance', async () => {
      const userId = 'user-1';
      const user = { id: userId, name: 'John' };
      mockUserService.getUser.mockReturnValue(user);
      mockBalanceService.getBalance.mockResolvedValue(1234);

      const result = await controller.getMe(userId);

      expect(userService.getUser).toHaveBeenCalledWith(userId);
      expect(balanceService.getBalance).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ id: userId, name: 'John', balance: 1234 });
    });

    it('should throw error if user not found', async () => {
      mockUserService.getUser.mockReturnValue(null);

      await expect(controller.getMe('missing-id')).rejects.toThrow('User not found');
    });
  });

  describe('getTransactions', () => {
    it('should return transactions for user', async () => {
      const userId = 'user-2';
      const user = { id: userId, name: 'Jane' };
      const transactions = [{ txId: 'tx1' }, { txId: 'tx2' }];

      mockUserService.getUser.mockReturnValue(user);
      mockTransactionService.getTransactions.mockResolvedValue(transactions);

      const result = await controller.getTransactions(userId);

      expect(userService.getUser).toHaveBeenCalledWith(userId);
      expect(transactionService.getTransactions).toHaveBeenCalledWith(userId);
      expect(result).toEqual(transactions);
    });

    it('should throw error if user not found', async () => {
      mockUserService.getUser.mockReturnValue(null);

      await expect(controller.getTransactions('no-user')).rejects.toThrow('User not found');
    });
  });

  describe('createUser', () => {
    it('should create a user and return it', async () => {
      const userData: UserCreationDto = { name: 'Alice' };
      const createdUser = { id: 'uuid-123', name: 'Alice' };
      mockUserService.createUser.mockResolvedValue(createdUser);

      const result = await controller.createUser(userData);

      expect(userService.createUser).toHaveBeenCalledWith(expect.any(String), userData.name);
      expect(result).toEqual(createdUser);
    });
  });
});
