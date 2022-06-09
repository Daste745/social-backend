import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [ProfilesModule, TypeOrmModule.forFeature([Post])],
  providers: [PostsService],
})
export class PostsModule {}
