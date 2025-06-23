import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { TransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(@Inject('REDIS') private redis: Redis) { }

  async addTransaction(userId: string, tx: TransactionDto): Promise<void> {
    await this.redis.lpush(`tx:${userId}`, JSON.stringify(tx));
  }

  async getTransactions(userId: string): Promise<TransactionDto[]> {
    const txs = await this.redis.lrange(`tx:${userId}`, 0, 20);
    return txs.map(tx => JSON.parse(tx));
  }
}
