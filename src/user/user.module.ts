import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BalanceService } from 'src/balance/balance.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Module({
  providers: [UserService, BalanceService, TransactionService],
  controllers: [UserController]
})
export class UserModule { }
