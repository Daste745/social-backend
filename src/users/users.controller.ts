import {
  Controller,
  Param,
  Get,
  NotFoundException,
  UseGuards,
  Request,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ShowUserDto } from './dto/show-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ShowUserDto> {
    const user = await this.usersService.create(createUserDto);
    return plainToInstance(ShowUserDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getLoggedInUser(@Request() req): Promise<ShowUserDto> {
    return plainToInstance(ShowUserDto, req.user);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<ShowUserDto> {
    // TODO: Validate if `id` is an UUID

    try {
      const user = await this.usersService.findOne(id);
      return plainToInstance(ShowUserDto, user);
    } catch (e) {
      throw new NotFoundException();
      // TODO: Use some proper exception handling (handlers/interceptors?)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateUser(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ShowUserDto> {
    const user = await this.usersService.update(req.user, updateUserDto);
    return plainToInstance(ShowUserDto, user);
  }

  // TODO: DELETE /users
}
