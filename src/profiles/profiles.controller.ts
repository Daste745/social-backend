import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';
import { ReadProfileDto } from './dto/read-profile.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  // TODO: Annotate possible returned error codes

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({ type: ReadProfileDto })
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
  async findOne(@Param('id') id: string): Promise<ReadProfileDto> {
    try {
      const profile = await this.profilesService.findOne(id);
      return plainToInstance(ReadProfileDto, profile);
    } catch (_) {
      throw new NotFoundException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  @ApiCreatedResponse({ type: ReadProfileDto })
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
  async findFollowing(@Param('id') id: string): Promise<ReadProfileDto[]> {
    const profile = await this.profilesService.findOne(id);
    return plainToInstance(ReadProfileDto, profile.following);
  }

  // TODO: @Get(':id/followers')

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOkResponse({ type: ReadProfileDto })
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
