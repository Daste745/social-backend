import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Profile } from 'src/profiles/entities';
import { ProfilesService } from 'src/profiles/profiles.service';
import { User } from 'src/users/entities';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Post, Reaction } from './entities';

@Exclude()
export class FindPostsOptions {
  @ApiProperty({ required: false, type: String })
  @Expose()
  @IsOptional()
  @IsString()
  author: string;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,

    @InjectRepository(Reaction)
    private reactionsRepository: Repository<Reaction>,

    private profilesService: ProfilesService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    user: User,
    profileId: string,
  ): Promise<Post> {
    const profile = await this.profilesService.findOne(profileId);

    if (!profile.belongsTo(user.id)) {
      throw new UnauthorizedException(
        'You can only create posts on your profiles.',
      );
    }

    const parentPost = await this.findOne(createPostDto.parent);

    return this.postsRepository.save({
      author: profile,
      parent: parentPost,
      content: createPostDto.content,
    });
  }

  async findOne(id: string): Promise<Post> {
    try {
      return await this.postsRepository.findOneOrFail(id, {
        relations: ['author', 'parent', 'reactions'],
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }
    }
  }

  async findAll(options?: FindPostsOptions): Promise<Post[]> {
    let filters = undefined;
    if (options.author) {
      filters = plainToInstance(FindPostsOptions, options);
    }

    return this.postsRepository.find({
      where: filters,
      relations: ['author', 'parent', 'reactions'],
    });
  }

  async findAllFromProfile(profile: Profile): Promise<Post[]> {
    return this.postsRepository.find({
      where: { profile: profile },
      relations: ['author', 'parent', 'reactions'],
    });
  }

  async findReplies(id: string): Promise<Post[]> {
    const post = await this.findOne(id);
    return this.postsRepository.find({
      where: { parent: post },
      relations: ['author', 'parent', 'reactions'],
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.postsRepository.count({ where: { id: id } });
    return count != 0;
  }

  async update(
    user: User,
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const post = await this.findOne(postId);

    if (!post.author.belongsTo(user.id)) {
      throw new UnauthorizedException('You can only modify your posts.');
    }

    if (updatePostDto.content) post.content = updatePostDto.content;

    return this.postsRepository.save(post);
  }
}
