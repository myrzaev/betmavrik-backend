import { Injectable } from '@nestjs/common';
import { User } from './dto/user.dto';
import { mockUserData } from './mocks';
import { userSeed } from './seeds/user.seed';

@Injectable()
export class UserService {
  private users = new Map<string, User>([
    [
      'f4b34954-572b-4cc6-b483-4f424d64f61f',
      userSeed
    ],
  ]);

  createUser(user_id: string, name: string): User {
    const user = { user_id, name, nickname: name, firstname: name, lastname: name, ...mockUserData };
    this.users.set(user_id, user);
    return user;
  }

  getUser(user_id: string): User | undefined {
    return this.users.get(user_id);
  }

  getAll(): User[] {
    return Array.from(this.users.values());
  }
}
