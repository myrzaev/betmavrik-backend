import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create and store a new user', () => {
      const user_id = 'user-123';
      const name = 'John Doe';

      const user = service.createUser(user_id, name);

      expect(user).toMatchObject({
        user_id,
        name,
        nickname: name,
        firstname: name,
        lastname: name,
      });

      expect(service.getUser(user_id)).toEqual(user);
    });
  });

  describe('getUser', () => {
    it('should return existing user by id', () => {
      const existingUserId = 'f4b34954-572b-4cc6-b483-4f424d64f61f';
      const user = service.getUser(existingUserId);

      expect(user).toBeDefined();
      expect(user?.user_id).toBe(existingUserId);
    });

    it('should return undefined for unknown user', () => {
      expect(service.getUser('non-existent-id')).toBeUndefined();
    });
  });
});
