import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class BalanceService {
  constructor(@Inject('REDIS') private redis: Redis) { }

  async getBalance(userId: string): Promise<number> {
    const balance = await this.redis.get(`balance:${userId}`);
    return parseFloat(balance || '1000');
  }

  async setBalance(userId: string, balance: number): Promise<number> {
    await this.redis.set(`balance:${userId}`, balance)
    return balance
  }
}
