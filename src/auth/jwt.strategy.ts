import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'process';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

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
  // TODO: Type `payload`
  async validate(payload: any): Promise<User | null> {
    let user: User;

    try {
      user = await this.usersService.findOne(payload.sub);
    } catch (_) {
      return null;
    }

    if (user.version !== payload.ver) {
      return null;
    }

    return user;
  }
}
