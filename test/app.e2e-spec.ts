import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import Redis from 'ioredis';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let redis: Redis;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    redis = new Redis({ host: 'localhost', port: 6379 });

    await redis.set('balance:test-user', '100');
    await redis.lpush(
      'tx:test-user',
      JSON.stringify({ id: 'tx1', type: 'credit', amount: 100, timestamp: new Date().toISOString() })
    );
  });

  afterAll(async () => {
    await redis.del('balance:test-user');
    await redis.del('tx:test-user');
    await redis.quit();
    await app.close();
  });

  describe('/me (GET)', () => {
    it('should return user info with balance', async () => {
      const userService = app.get('UserService');
      userService.createUser('test-user', 'Test User');

      const res = await request(app.getHttpServer())
        .get('/me')
        .query({ userId: 'test-user' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        user_id: 'test-user',
        name: 'Test User',
        balance: 100,
      });
    });

    it('should return error for unknown user', async () => {
      const res = await request(app.getHttpServer())
        .get('/me')
        .query({ userId: 'nonexistent' });

      expect(res.status).toBe(500);
    });
  });

  describe('/transactions (GET)', () => {
    it('should return transactions for user', async () => {
      const userService = app.get('UserService');
      userService.createUser('test-user', 'Test User');

      const res = await request(app.getHttpServer())
        .get('/transactions')
        .query({ userId: 'test-user' });

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body[0]).toHaveProperty('id', 'tx1');
    });
  });

  describe('/games (GET)', () => {
    it('should return cached games list', async () => {
      const res = await request(app.getHttpServer()).get('/games');
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body[0]).toHaveProperty('name');
    });
  });

  describe('/games (POST)', () => {
    it('should start a new game session', async () => {
      const res = await request(app.getHttpServer())
        .post('/games')
        .send({ userId: 'test-user', gameId: '1' });

      expect(res.status).toBe(201 || 200);
      expect(res.body).toHaveProperty('sessionId');
    });
  });
});
