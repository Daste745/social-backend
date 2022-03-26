import { Injectable } from '@nestjs/common';

export type User = {
  id: number;
  username: string;
  password: string;
};

@Injectable()
export class UsersService {
  // TODO: Use a real database
  private readonly users: User[] = [
    { id: 0, username: 'stefan@daste.cloud', password: 'test' },
    { id: 1, username: 'test@mail.com', password: 'supersecret' },
  ];

  // TODO: Generalize these methods into a repository

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async findOne(id: number): Promise<User | undefined> {
    const user = this.users.find((user) => user.id === id);
    return user;
  }
}
