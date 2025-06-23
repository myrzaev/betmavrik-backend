import { Injectable } from '@nestjs/common';
import { AllinGameService } from '../allin-game/allin-game.service';
import { StartGameDto } from './dto/start-game.dto';
import { GameDto } from 'src/allin-game/dto/game.dto';

@Injectable()
export class GamesService {
  private cache: GameDto[] = [];
  private lastFetch = 0;

  constructor(
    private readonly allinGameService: AllinGameService,
  ) { }

  async getGames() {
    if (Date.now() - this.lastFetch > 60_000 || !this.cache.length) {
      this.cache = await this.allinGameService.fetchGames();
      this.lastFetch = Date.now();
    }
    return this.cache;
  }

  async startGameSession(dto: StartGameDto) {
    return this.allinGameService.startGame(dto);
  }
}

