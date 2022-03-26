import {
  Controller,
  Param,
  Get,
  NotFoundException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User, UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getLoggedInUser(@Request() req): any {
    return req.user;
  }

  @Get(':id')
  async getUser(@Param() params): Promise<User | {}> {
    const id = parseInt(params.id);

    const user = await this.usersService.findOne(id);
    if (!user) return new NotFoundException();
    return user;
  }

  // TODO: POST /users

  // TODO: PATCH /users

  // TODO: DELETE /users
}
