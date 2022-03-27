import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

export type User = {
  id: number;
  username: string;
  password: string;
};

@Injectable()
export class UsersService {
  // TODO: Use a real database
  private users: User[] = [
    { id: 0, username: 'stefan@daste.cloud', password: 'test' },
    { id: 1, username: 'test@mail.com', password: 'supersecret' },
  ];

  // TODO: Generalize these methods into a repository

  async create(createUserDto: CreateUserDto): Promise<User | undefined> {
    if (await this.findOneByUsername(createUserDto?.username)) {
      return undefined;
    }

    const user: User = {
      id: this.users.at(-1).id + 1, // TODO: Use UUID -> can always return an user
      username: createUserDto?.username,
      password: createUserDto?.password, // TODO: Encrypt the password
    };
    this.users.push(user);

    console.log(this.users);

    return user;
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async findOne(id: number): Promise<User | undefined> {
    const user = this.users.find((user) => user.id === id);
    return user;
  }
}
