import { Body, Controller, Post } from '@nestjs/common';
import { PlayRequestDto } from './dto/play-request.dto';
import { PlayRequestResponseDto } from './dto/play-request.response.dto';
import { BalanceService } from 'src/balance/balance.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { TransactionDto } from 'src/transaction/dto/transaction.dto';

@Controller('')
export class AllinGameController {
  constructor(
    private readonly balanceService: BalanceService,
    private readonly transactionService: TransactionService,
    private readonly websocketGateway: WebsocketGateway
  ) { }

  @Post('play')
  async playRequest(@Body() body: PlayRequestDto): Promise<PlayRequestResponseDto> {
    const { user_id, actions = [] } = body;

    const transactions: TransactionDto[] = []
    const initialBalance = await this.balanceService.getBalance(user_id)
    let totalDelta = 0

    for (const action of actions) {
      let delta = 0

      if (action.action === 'bet') delta = -action.amount
      if (action.action === 'win') delta = action.amount

      totalDelta += delta

      const transaction = {
        action_id: action.action_id,
        action: action.action,
        amount: action.amount,
        processed_at: new Date().toISOString(),
      }
      this.transactionService.addTransaction(user_id, transaction)
      transactions.push(transaction)
    }

    const finalBalance = initialBalance + totalDelta

    await this.balanceService.setBalance(user_id, finalBalance)
    this.websocketGateway.sendBalanceUpdate(user_id, finalBalance)

    return {
      ...body,
      balance: finalBalance,
      transactions,
    }
  }
}
