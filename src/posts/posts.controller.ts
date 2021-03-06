import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards';
import { AuthRequest } from 'src/auth/types';
import {
  ApiPaginatedResponse,
  paginate,
  Paginated,
  PaginateOptions,
} from 'src/utils/pagination';
import {
  CreatePostDto,
  CreateReactionDto,
  ReadPostDto,
  UpdatePostDto,
} from './dto';
import { ReadReactionDto } from './dto/read-reaction.dto';
import { FindPostsOptions, PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({ type: ReadPostDto })
  @ApiUnauthorizedResponse()
  async create(
    @Req() req: AuthRequest,
    @Body() createPostDto: CreatePostDto,
    @Body('profileId') profileId: string,
  ): Promise<ReadPostDto> {
    const post = await this.postsService.create(
      createPostDto,
      req.user,
      profileId,
    );
    return plainToInstance(ReadPostDto, post);
  }

  @Get(':id')
  @ApiOkResponse({ type: ReadPostDto })
  @ApiNotFoundResponse()
  async findOne(@Param('id') id: string): Promise<ReadPostDto> {
    const post = await this.postsService.findOne(id);
    return plainToInstance(ReadPostDto, post);
  }

  @Get()
  @ApiPaginatedResponse(ReadPostDto)
  async findAll(
    @Query() paginateOptions: PaginateOptions,
    @Query() findPostsOptions: FindPostsOptions,
  ): Promise<Paginated<ReadPostDto>> {
    const posts = await this.postsService.findAll(findPostsOptions);
    return paginate(plainToInstance(ReadPostDto, posts), paginateOptions);
  }

  @Get(':id/replies')
  @ApiPaginatedResponse(ReadPostDto)
  @ApiNotFoundResponse()
  async findReplies(
    @Param('id') id: string,
    @Query() paginateOptions: PaginateOptions,
  ): Promise<Paginated<ReadPostDto>> {
    const replies = await this.postsService.findReplies(id);
    return paginate(plainToInstance(ReadPostDto, replies), paginateOptions);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOkResponse({ type: ReadPostDto })
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async update(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<ReadPostDto> {
    const updatedPost = await this.postsService.update(
      req.user,
      id,
      updatePostDto,
    );

    return plainToInstance(ReadPostDto, updatedPost);
  }

  // TODO: DELETE /posts/:id (needs to cascade delete comments, reactions, etc.)

  @UseGuards(JwtAuthGuard)
  @Post(':id/reactions')
  @ApiCreatedResponse({ type: ReadReactionDto })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  async createReaction(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() createReactionDto: CreateReactionDto,
    @Body('profileId') profileId: string,
  ): Promise<ReadReactionDto> {
    const reaction = await this.postsService.createReaction(
      createReactionDto,
      req.user,
      profileId,
      id,
    );
    return plainToInstance(ReadReactionDto, reaction);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/reactions')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async deleteReaction(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body('profileId') profileId: string,
  ): Promise<null> {
    return this.postsService.deleteReaction(req.user, profileId, id);
  }
}
