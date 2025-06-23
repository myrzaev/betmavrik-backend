import { Test, TestingModule } from '@nestjs/testing';
import { AllinGameService } from './allin-game.service';
import axios from 'axios';
import { StartGameDto } from '../games/dto/start-game.dto';
import { ConfigService } from '@nestjs/config';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AllinGameService', () => {
  let service: AllinGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllinGameService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'main.API_PRIVATE':
                  return 'test_secret_key';
                case 'main.API_KEY':
                  return 'test_api_key';
                case 'main.GCP_URL':
                  return 'https://papiconnector.all-ingame.com/api/casino';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AllinGameService>(AllinGameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchGames', () => {
    it('should return game list on success', async () => {
      const mockGames = [{ id: 'game1' }, { id: 'game2' }];
      mockedAxios.get.mockResolvedValueOnce({ data: mockGames });

      const result = await service.fetchGames();
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://papiconnector.all-ingame.com/api/casino/games',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-REQUEST-SIGN': expect.any(String),
            'allingame-key': expect.any(String),
          }),
        }),
      );
      expect(result).toEqual(mockGames);
    });

    it('should return empty array and log error on failure', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Request failed'));

      const result = await service.fetchGames();
      expect(result).toEqual([]);
    });
  });

  describe('startGame', () => {
    const mockPayload: StartGameDto = {
      game_id: 123,
      currency: 'EUR',
      locale: 'en',
      ip: '127.0.0.1',
      client_type: 'desktop',
      rtp: 96.5,
      url: {
        deposit_url: 'https://casino.com/deposit',
        return_url: 'https://casino.com/return',
      },
      user: {
        user_id: 'user-1',
        firstname: 'John',
        lastname: 'Doe',
        nickname: 'jdoe',
        city: 'New York',
        date_of_birth: '1990-01-01',
        registred_at: '2024-01-01',
        gender: 'm',
        country: 'US',
      },
    };

    it('should return session URL on success', async () => {
      const mockResponse = { url: 'https://session-url.com/play' };
      mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await service.startGame(mockPayload);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://papiconnector.all-ingame.com/api/casino/session',
        JSON.stringify(mockPayload),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-REQUEST-SIGN': expect.any(String),
            'allingame-key': expect.any(String),
          }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on failure', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Session failed'));

      await expect(service.startGame(mockPayload)).rejects.toThrow(
        'Game session could not be started',
      );
    });
  });
});
