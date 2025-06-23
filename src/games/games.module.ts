import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { AllinGameService } from 'src/allin-game/allin-game.service';
import { UserService } from 'src/user/user.service';
import { BalanceService } from 'src/balance/balance.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [GamesService, AllinGameService, UserService, BalanceService, TransactionService],
  controllers: [GamesController]
})
export class GamesModule { }
