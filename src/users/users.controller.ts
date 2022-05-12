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
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ReadUserDto> {
    try {
      const user = await this.usersService.create(createUserDto);
      return plainToInstance(ReadUserDto, user);
    } catch (e) {
      throw new BadRequestException(
        'A user with this email address already exists.',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getLoggedInUser(@Request() req): Promise<ReadUserDto> {
    return plainToInstance(ReadUserDto, req.user);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<ReadUserDto> {
    try {
      const user = await this.usersService.findOne(id);
      return plainToInstance(ReadUserDto, user);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateUser(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    try {
      const user = await this.usersService.update(
        req.user,
        plainToInstance(UpdateUserDto, updateUserDto),
      );
      return plainToInstance(ReadUserDto, user);
    } catch (e) {
      throw new BadRequestException(
        'A user with this email address already exists.',
      );
    }
  }

  // TODO: DELETE /users
}
