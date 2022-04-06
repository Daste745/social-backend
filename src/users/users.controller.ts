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
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getLoggedInUser(@Request() req): Promise<User> {
    return req.user;
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    // TODO: Validate if `id` is an UUID

    try {
      return await this.usersService.findOne(id);
    } catch (e) {
      throw new NotFoundException();
      // TODO: Use some proper exception handling (handlers/interceptors?)
    }
  }

  // TODO: PATCH /users

  // TODO: DELETE /users
}
