import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthToken } from './authToken.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findOneByEmail(email);

      if (!(await verify(user.password, password))) {
        throw new UnauthorizedException();
        // TODO: Use some proper exception handling (handlers/interceptors?)
      }

      return user;
    } catch (e) {
      throw new UnauthorizedException();
      // TODO: Use some proper exception handling (handlers/interceptors?)
    }
  }

  async generateToken(user: User): Promise<AuthToken> {
    const payload = { sub: user.id };

    return new AuthToken(this.jwtService.sign(payload));
  }
}
