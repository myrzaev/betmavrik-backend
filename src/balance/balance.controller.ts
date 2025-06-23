import { Controller, Get, Query, Post } from '@nestjs/common';
import { BalanceService } from './balance.service';

@Controller('balance')
export class BalanceController {
  constructor(
    private balanceService: BalanceService,
  ) { }

  @Get()
  async getBalance(@Query('userId') userId: string): Promise<number> {
    return this.balanceService.getBalance(userId);
  }

  @Post()
  async updateBalance(@Query('userId') userId: string, @Query('balance') balance: number): Promise<number> {
    return this.balanceService.setBalance(userId, balance);
  }
}
