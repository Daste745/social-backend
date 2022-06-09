import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
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
import { CreatePostDto, ReadPostDto, UpdatePostDto } from './dto';
import { PostsService } from './posts.service';

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
    console.log(req.user, createPostDto, profileId);
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
    console.log(id);
    const post = await this.postsService.findOne(id);
    return plainToInstance(ReadPostDto, post);
  }

  @Get()
  @ApiPaginatedResponse(ReadPostDto)
  async findAll(
    @Query() paginateOptions: PaginateOptions,
  ): Promise<Paginated<ReadPostDto>> {
    const posts = await this.postsService.findAll();
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
}
