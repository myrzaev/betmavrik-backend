import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { StartGameDto } from 'src/games/dto/start-game.dto';
import { GameDto } from './dto/game.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AllinGameService {
  private readonly logger = new Logger(AllinGameService.name);
  private readonly gcpUrl: string;
  private readonly apiKey: string;
  private readonly apiPrivate: string;

  constructor(private readonly configService: ConfigService) {
    this.gcpUrl = this.configService.get<string>('main.GCP_URL')!;
    this.apiKey = this.configService.get<string>('main.API_KEY')!;
    this.apiPrivate = this.configService.get<string>('main.API_PRIVATE')!;
  }

  private createSignature(body: string): string {
    return crypto.createHmac('sha256', this.apiPrivate).update(body).digest('hex');
  }

  async fetchGames(): Promise<GameDto[]> {
    const signature = this.createSignature('')

    const headers = {
      'Content-Type': 'application/json',
      'X-REQUEST-SIGN': signature,
      'allingame-key': this.apiKey,
    };

    try {
      const response = await axios.get(`${this.gcpUrl}/games`, { headers });
      return response.data;
    } catch (error) {
      this.logger.error(
        'Failed to fetch games from All-InGame API',
        error?.response?.data || error.message,
      );
      return [];
    }
  }

  async startGame(payload: StartGameDto): Promise<{ url: string }> {
    const body = JSON.stringify(payload);
    const signature = this.createSignature(body);

    const headers = {
      'Content-Type': 'application/json',
      'X-REQUEST-SIGN': signature,
      'allingame-key': this.apiKey,
    };

    try {
      const response = await axios.post(
        `${this.gcpUrl}/session`,
        body,
        { headers },
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to start game session', error?.response?.data || error.message);
      throw new Error('Game session could not be started');
    }
  }
}
