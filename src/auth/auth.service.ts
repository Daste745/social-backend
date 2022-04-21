import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthToken } from './authToken.entity';
import { JWTPayload } from './jwtPayload.entity';

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
      }

      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async generateToken(user: User): Promise<AuthToken> {
    // TODO: Find a way to save the version without using a custom field
    const payload: JWTPayload = { sub: user.id, ver: user.version };

    return new AuthToken(this.jwtService.sign(payload));
  }

  async logout(user: User): Promise<{ message: string }> {
    await this.usersService.bumpVersion(user.id);

    return { message: 'Logged out' };
  }
}
