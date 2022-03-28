import {
  Controller,
  Param,
  Get,
  NotFoundException,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = this.usersService.create(createUserDto);

    return user;
  }

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

  // TODO: PATCH /users

  // TODO: DELETE /users
}
