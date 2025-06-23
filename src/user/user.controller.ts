import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { BalanceService } from '../balance/balance.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { UserCreationDto } from './dto/user-creation.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private balanceService: BalanceService,
    private transactionService: TransactionService
  ) { }

  @Get('me')
  async getMe(@Query('userId') userId: string): Promise<User> {
    const user = this.userService.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const balance = await this.balanceService.getBalance(userId);
    return {
      ...user,
      balance,
    };
  }

  @Get('transactions')
  async getTransactions(@Query('userId') userId: string): Promise<any[]> {
    const user = this.userService.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return this.transactionService.getTransactions(userId);
  }

  @Post('create')
  async createUser(@Body() userData: UserCreationDto): Promise<User> {
    const userId = uuidv4()
    return this.userService.createUser(userId, userData.name);
  }
}
