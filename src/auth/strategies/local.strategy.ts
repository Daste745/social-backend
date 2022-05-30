import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/users/entities';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  // NOTE: LocalStrategy requires the parameters to be named `username` and `password`
  //       `username` is actually `email` in this project's logic
  async validate(username: string, password: string): Promise<User> {
    return this.authService.validateUser(username, password);
  }
}
