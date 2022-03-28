import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.usersService.findOneByEmail(email);

    if (user?.password !== password) return undefined;

    return user;
  }

  async generateToken(user: User): Promise<{ accessToken: string }> {
    const payload = { sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
