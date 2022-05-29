import {
  Controller,
  Param,
  Get,
  UseGuards,
  Req,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthRequest } from 'src/auth/auth-request.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: ReadUserDto })
  @ApiBadRequestResponse({
    description: 'User used an already taken email address.',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<ReadUserDto> {
    const user = await this.usersService.create(createUserDto);
    return plainToInstance(ReadUserDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOkResponse({ type: ReadUserDto })
  @ApiUnauthorizedResponse()
  async getLoggedInUser(@Req() req: AuthRequest): Promise<ReadUserDto> {
    return plainToInstance(ReadUserDto, req.user);
  }

  @Get(':id')
  @ApiOkResponse({ type: ReadUserDto })
  @ApiNotFoundResponse()
  async getUser(@Param('id') id: string): Promise<ReadUserDto> {
    const user = await this.usersService.findOne(id);
    return plainToInstance(ReadUserDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiOkResponse({ type: ReadUserDto })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse({
    description: 'User used an already taken email address.',
  })
  async updateUser(
    @Req() req: AuthRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    const user = await this.usersService.update(req.user.id, updateUserDto);
    return plainToInstance(ReadUserDto, user);
  }
}
