import { ApiProperty } from '@nestjs/swagger';

export class AuthToken {
  constructor(token: string) {
    this.token = token;
  }

  @ApiProperty()
  token: string;
}
