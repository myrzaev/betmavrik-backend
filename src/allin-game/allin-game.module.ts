import { Module } from '@nestjs/common';
import { AllinGameService } from './allin-game.service';
import { AllinGameController } from './allin-game.controller';
import { BalanceService } from 'src/balance/balance.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { BalanceModule } from 'src/balance/balance.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    BalanceModule,
    TransactionModule,
    WebsocketModule,
  ],
  providers: [AllinGameService, BalanceService, TransactionService, WebsocketGateway],
  controllers: [AllinGameController]
})
export class AllinGameModule { }
