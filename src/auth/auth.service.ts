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
    // TODO: Find a way to save the version without using a custom field
    const payload = { sub: user.id, ver: user.version };

    return new AuthToken(this.jwtService.sign(payload));
  }

  async logout(user: User): Promise<{ message: string }> {
    await this.usersService.bumpVersion(user.id);

    return { message: 'Logged out' };
  }
}
