import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      email: createUserDto.email,
      password: createUserDto.password,
    });
    // TODO: Handle non-unique emails
    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneOrFail({ where: { email: email } });
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOneOrFail(id);
  }
}
