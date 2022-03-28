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

  create(createUserDto: CreateUserDto): User {
    const user = this.usersRepository.create({
      email: createUserDto.email,
      password: createUserDto.password,
    });
    this.usersRepository.save(user);

    return user;
  }

  findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email: email } });
  }

  findOne(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne(id);
  }
}
