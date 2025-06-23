import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { BalanceService } from 'src/balance/balance.service';

@Global()
@Module({
  providers: [
    BalanceService,
    {
      provide: 'REDIS',
      useFactory: () => {
        const host = process.env.REDIS_HOST || 'localhost';
        const port = Number(process.env.REDIS_PORT) || 6379;
        return new Redis({ host, port });
      },
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule { }
