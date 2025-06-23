import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { GamesService } from './games.service';
import { StartGameDto } from './dto/start-game.dto';
import { Request } from 'express'

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) { }

  @Get()
  async getGames() {
    return await this.gamesService.getGames();
  }

  @Post()
  async startGame(@Body() dto: StartGameDto, @Req() req: Request) {
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
    return this.gamesService.startGameSession({ ...dto, ip: String(ip) });
  }
}
