import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { AllinGameService } from 'src/allin-game/allin-game.service';
import { StartGameDto } from './dto/start-game.dto';

describe('GamesService', () => {
  let service: GamesService;
  let allinGameService: AllinGameService;

  const mockAllinGameService = {
    fetchGames: jest.fn(),
    startGame: jest.fn(),
  };

  const mockGamesList = [
    { id: 1, name: 'Blackjack' },
    { id: 2, name: 'Roulette' },
  ];

  const startGameDto: StartGameDto = {
    game_id: 1,
    currency: 'EUR',
    locale: 'en',
    client_type: 'desktop',
    ip: '127.0.0.1',
    rtp: 95,
    url: {
      deposit_url: 'https://casino.com/deposit',
      return_url: 'https://casino.com/return',
    },
    user: {
      user_id: 'user-1',
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

  beforeEach(async () => {
    jest.useFakeTimers();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: AllinGameService,
          useValue: mockAllinGameService,
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    allinGameService = module.get<AllinGameService>(AllinGameService);

    jest.clearAllMocks();
    service['cache'] = [];
    service['lastFetch'] = 0;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getGames', () => {
    it('should fetch and cache games if cache is empty', async () => {
      mockAllinGameService.fetchGames.mockResolvedValueOnce(mockGamesList);

      const result = await service.getGames();
      expect(mockAllinGameService.fetchGames).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockGamesList);
    });

    it('should return cached games if called again within 60 seconds', async () => {
      mockAllinGameService.fetchGames.mockResolvedValueOnce(mockGamesList);
      await service.getGames();

      jest.advanceTimersByTime(10_000);

      const result = await service.getGames();
      expect(mockAllinGameService.fetchGames).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockGamesList);
    });

    it('should refetch games if 60 seconds have passed', async () => {
      mockAllinGameService.fetchGames
        .mockResolvedValueOnce(mockGamesList)
        .mockResolvedValueOnce([{ id: 3, name: 'Poker' }]);

      await service.getGames();
      jest.advanceTimersByTime(61_000);

      const result = await service.getGames();
      expect(mockAllinGameService.fetchGames).toHaveBeenCalledTimes(2);
      expect(result).toEqual([{ id: 3, name: 'Poker' }]);
    });
  });

  describe('startGameSession', () => {
    it('should call allinGameService.startGame with dto', async () => {
      const sessionResult = { url: 'https://session.com/play' };
      mockAllinGameService.startGame.mockResolvedValueOnce(sessionResult);

      const result = await service.startGameSession(startGameDto);
      expect(mockAllinGameService.startGame).toHaveBeenCalledWith(startGameDto);
      expect(result).toEqual(sessionResult);
    });
  });
});
