import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { StartGameDto } from './dto/start-game.dto';
import { Request } from 'express';

describe('GamesController', () => {
  let controller: GamesController;
  let service: GamesService;

  const mockGamesService = {
    getGames: jest.fn(),
    startGameSession: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        {
          provide: GamesService,
          useValue: mockGamesService,
        },
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
    service = module.get<GamesService>(GamesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getGames', () => {
    it('should return list of games', async () => {
      const mockGames = [{ id: 1, name: 'Game A' }];
      mockGamesService.getGames.mockResolvedValueOnce(mockGames);

      const result = await controller.getGames();
      expect(result).toEqual(mockGames);
      expect(mockGamesService.getGames).toHaveBeenCalled();
    });
  });

  describe('startGame', () => {
    it('should start game session with IP from request', async () => {
      const dto: StartGameDto = {
        game_id: 1,
        currency: 'EUR',
        locale: 'en',
        client_type: 'desktop',
        ip: '',
        rtp: 95,
        url: {
          deposit_url: 'https://casino.com/deposit',
          return_url: 'https://casino.com/return',
        },
        user: {
          user_id: 'u1',
          firstname: 'John',
          lastname: 'Doe',
          nickname: 'jdoe',
          city: 'NY',
          date_of_birth: '1990-01-01',
          registred_at: '2024-01-01',
          gender: 'm',
          country: 'US',
        },
      };

      const req = {
        ip: '192.168.1.1',
      } as Request;

      const expectedResult = { url: 'https://game-session.com/play' };
      mockGamesService.startGameSession.mockResolvedValueOnce(expectedResult);

      const result = await controller.startGame(dto, req);
      expect(mockGamesService.startGameSession).toHaveBeenCalledWith({
        ...dto,
        ip: '192.168.1.1',
      });
      expect(result).toEqual(expectedResult);
    });

    it('should fallback to 127.0.0.1 if no IP found', async () => {
      const dto = { ...basicStartGameDto };
      const req = { ip: '127.0.0.1' } as Request;

      mockGamesService.startGameSession.mockResolvedValueOnce({ url: 'x' });

      await controller.startGame(dto, req);
      expect(mockGamesService.startGameSession).toHaveBeenCalledWith(
        expect.objectContaining({ ip: '127.0.0.1' }),
      );
    });
  });
});

const basicStartGameDto: StartGameDto = {
  game_id: 1,
  currency: 'EUR',
  locale: 'en',
  client_type: 'desktop',
  ip: '',
  rtp: 95,
  url: {
    deposit_url: 'https://casino.com/deposit',
    return_url: 'https://casino.com/return',
  },
  user: {
    user_id: 'u1',
    firstname: 'John',
    lastname: 'Doe',
    nickname: 'jdoe',
    city: 'NY',
    date_of_birth: '1990-01-01',
    registred_at: '2024-01-01',
    gender: 'm',
    country: 'US',
  },
};
