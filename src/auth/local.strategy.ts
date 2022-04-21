import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  // NOTE: LocalStrategy requires the parameters to be named `username` and `password`
  //       `username` is actually `email` in this project's logic
  async validate(username: string, password: string): Promise<User> {
    try {
      return await this.authService.validateUser(username, password);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
