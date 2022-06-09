import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/profiles/entities';
import { ProfilesService } from 'src/profiles/profiles.service';
import { User } from 'src/users/entities';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Post } from './entities';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,

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

    return this.postsRepository.save({
      author: profile,
      content: createPostDto.content,
    });
  }

  async findOne(id: string): Promise<Post> {
    try {
      return await this.postsRepository.findOneOrFail(id, {
        relations: ['author'],
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }
    }
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  async findAllFromProfile(profile: Profile): Promise<Post[]> {
    return this.postsRepository.find({ where: { profile: profile } });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.postsRepository.count({ where: { id: id } });
    return count != 0;
  }

  async update(
    user: User,
    profileId: string,
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const profile = await this.profilesService.findOne(profileId);
    if (!profile.belongsTo(user.id)) {
      throw new UnauthorizedException(
        'You can only modify posts on your profiles.',
      );
    }

    const post = await this.findOne(postId);
    if (!post.belongsTo(profile.id)) {
      throw new UnauthorizedException('You can only modify your posts.');
    }

    if (updatePostDto.content) post.content = updatePostDto.content;

    return this.postsRepository.save(post);
  }
}
