import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
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
    if (await this.existsByEmail(createUserDto.email)) {
      throw new BadRequestException(
        'This email is already in use by another user.',
      );
    }

    const passwordHash = await hash(createUserDto.password, {
      type: argon2id,
      parallelism: 4,
    });

    return this.usersRepository.save({
      email: createUserDto.email,
      password: passwordHash,
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({
        where: { email: email },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }
      throw e;
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail(id);
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }
      throw e;
    }
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.usersRepository.count({ where: { id: id } });
    return count != 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.usersRepository.count({
      where: { email: email },
    });
    return count != 0;
  }

  async bumpVersion(id: string): Promise<void> {
    await this.usersRepository.increment({ id: id }, 'version', 1);
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (
      updateUserDto.email &&
      (await this.existsByEmail(updateUserDto.email))
    ) {
      throw new BadRequestException(
        'A user with this email address already exists.',
      );
    }

    const user = await this.findOne(userId);

    if (updateUserDto.password) {
      user.password = await hash(updateUserDto.password, {
        type: argon2id,
        parallelism: 4,
      });
    }
    if (updateUserDto.email) user.email = updateUserDto.email;

    return this.usersRepository.save(user);
  }
}
