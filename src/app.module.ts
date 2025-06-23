import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { BalanceModule } from './balance/balance.module';
import { TransactionModule } from './transaction/transaction.module';
import { GamesModule } from './games/games.module';
import { AllinGameModule } from './allin-game/allin-game.module';
import { WebsocketModule } from './websocket/websocket.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import config from './config/main.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    UserModule,
    BalanceModule,
    TransactionModule,
    GamesModule,
    AllinGameModule,
    WebsocketModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
