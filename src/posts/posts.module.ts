import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { Reaction } from './entities/reaction.entity';

@Module({
  imports: [ProfilesModule, TypeOrmModule.forFeature([Post, Reaction])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
