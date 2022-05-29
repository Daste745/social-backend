import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Relation } from './relation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Relation])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
