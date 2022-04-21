import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { argon2id, hash } from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const passwordHash = await hash(createUserDto.password, {
      type: argon2id,
      parallelism: 4,
    });

    const user = this.usersRepository.create({
      email: createUserDto.email,
      password: passwordHash,
    });

    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneOrFail({ where: { email: email } });
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOneOrFail(id);
  }

  async bumpVersion(id: string): Promise<void> {
    await this.usersRepository.increment({ id: id }, 'version', 1);
  }

  async update(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    const password = updateUserDto.password;
    if (password) {
      updateUserDto.password = await hash(password, {
        type: argon2id,
        parallelism: 4,
      });
    }

    await this.usersRepository.update(user, updateUserDto);
    return this.usersRepository.findOne(user.id);
  }
}
