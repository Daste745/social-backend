import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { plainToInstance } from 'class-transformer';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthRequest } from 'src/auth/types';
import {
  ApiPaginatedResponse,
  paginate,
  Paginated,
  PaginatedDto,
  PaginateOptions,
} from 'src/utils/pagination';
import { CreateProfileDto, ReadProfileDto, UpdateProfileDto } from './dto';

@ApiTags('profiles')
@ApiExtraModels(PaginatedDto)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({ type: ReadProfileDto })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse({
    description: 'User used an already taken profile name.',
  })
  async create(
    @Req() req: AuthRequest,
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<ReadProfileDto> {
    const profile = await this.profilesService.create(
      createProfileDto,
      req.user,
    );
    return plainToInstance(ReadProfileDto, profile);
  }

  @Get(':id')
  @ApiOkResponse({ type: ReadProfileDto })
  @ApiNotFoundResponse()
  async findOne(@Param('id') id: string): Promise<ReadProfileDto> {
    const profile = await this.profilesService.findOne(id);
    return plainToInstance(ReadProfileDto, profile);
  }

  @Get('')
  @ApiPaginatedResponse(ReadProfileDto)
  async findAll(
    @Query() paginateOptions: PaginateOptions,
  ): Promise<Paginated<ReadProfileDto>> {
    const profiles = await this.profilesService.findAll();
    return paginate(plainToInstance(ReadProfileDto, profiles), paginateOptions);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCreatedResponse({ type: ReadProfileDto })
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse({
    description: 'User tried to follow their own profile.',
  })
  async followProfile(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body('target_id') targetId: string,
  ): Promise<void> {
    await this.profilesService.follow(req.user, id, targetId);
  }

  @Get(':id/following')
  @ApiOkResponse({ type: ReadProfileDto, isArray: true })
  @ApiNotFoundResponse()
  async findFollowing(
    @Query() paginateOptions: PaginateOptions,
    @Param('id') id: string,
  ): Promise<Paginated<ReadProfileDto>> {
    const following = await this.profilesService.findFollowing(id);
    return paginate(
      plainToInstance(ReadProfileDto, following),
      paginateOptions,
    );
  }

  @Get(':id/followers')
  @ApiOkResponse({ type: ReadProfileDto, isArray: true })
  @ApiNotFoundResponse()
  async findFollowers(
    @Query() paginateOptions: PaginateOptions,
    @Param('id') id: string,
  ): Promise<Paginated<ReadProfileDto>> {
    const followers = await this.profilesService.findFollowers(id);
    return paginate(
      plainToInstance(ReadProfileDto, followers),
      paginateOptions,
    );
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
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ReadProfileDto> {
    const updatedProfile = await this.profilesService.update(
      req.user,
      id,
      updateProfileDto,
    );

    return plainToInstance(ReadProfileDto, updatedProfile);
  }
}
