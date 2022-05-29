import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'process';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { JWTPayload } from './jwtPayload.entity';

require('dotenv').config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      secretOrKey: env.JWT_SECRET,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // NOTE: This method associates a User object from the database with the access token
  async validate(payload: JWTPayload): Promise<User | null> {
    try {
      const user = await this.usersService.findOne(payload.sub);

      if (user.version !== payload.ver) {
        return null;
      }

      return user;
    } catch (e) {
      if (e instanceof NotFoundException) {
        return null;
      }
    }
  }
}
