import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';
import { ReadProfileDto } from './dto/read-profile.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({ type: ReadProfileDto })
  @ApiBadRequestResponse({
    description: 'User used an already taken profile name.',
  })
  async create(
    @Request() req,
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<ReadProfileDto> {
    try {
      const profile = await this.profilesService.create(
        createProfileDto,
        req.user,
      );
      return plainToInstance(ReadProfileDto, profile);
    } catch (_) {
      throw new BadRequestException(
        'This username is already in use by another user.',
      );
    }
  }

  @Get(':id')
  @ApiOkResponse({ type: ReadProfileDto })
  @ApiNotFoundResponse()
  async findOne(@Param('id') id: string): Promise<ReadProfileDto> {
    const profile = await this.profilesService.findOne(id);
    return plainToInstance(ReadProfileDto, profile);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  @ApiCreatedResponse({ type: ReadProfileDto })
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse({
    description: 'User tried to follow their own profile.',
  })
  async followProfile(
    @Request() req,
    @Param('id') id: string,
    @Body('target_id') targetId: string,
  ): Promise<ReadProfileDto> {
    const profile = await this.profilesService.follow(req.user, id, targetId);
    return plainToInstance(ReadProfileDto, profile);
  }

  @Get(':id/following')
  @ApiOkResponse({ type: ReadProfileDto, isArray: true })
  @ApiNotFoundResponse()
  async findFollowing(@Param('id') id: string): Promise<ReadProfileDto[]> {
    const profile = await this.profilesService.findOne(id);
    const profiles = [];
    for (const relation of profile.following) {
      profiles.push(relation.profile_2);
    }
    return plainToInstance(ReadProfileDto, profiles);
  }

  @Get(':id/followers')
  @ApiOkResponse({ type: ReadProfileDto, isArray: true })
  @ApiNotFoundResponse()
  async findFollowers(@Param('id') id: string): Promise<ReadProfileDto[]> {
    const profile = await this.profilesService.findOne(id);
    const profiles = [];
    for (const relation of profile.followers) {
      profiles.push(relation.profile_1);
    }
    return plainToInstance(ReadProfileDto, profiles);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOkResponse({ type: ReadProfileDto })
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse({
    description: 'User used an already taken profile name.',
  })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ReadProfileDto> {
    const profile = await this.profilesService.findOne(id);

    const updatedProfile = await this.profilesService.update(
      req.user,
      profile,
      plainToInstance(UpdateProfileDto, updateProfileDto),
    );

    return plainToInstance(ReadProfileDto, updatedProfile);
  }
}
