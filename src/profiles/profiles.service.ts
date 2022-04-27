import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private profilesRepository: Repository<Profile>,
  ) {}

  async create(
    createProfileDto: CreateProfileDto,
    user: User,
  ): Promise<Profile> {
    return this.profilesRepository.save({
      user: user,
      name: createProfileDto.name,
      bio: createProfileDto.bio,
    });
  }

  async findOne(id: string): Promise<Profile> {
    return this.profilesRepository.findOneOrFail(id);
  }

  async update(
    profile: Profile,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    await this.profilesRepository.update(profile, updateProfileDto);
    return this.profilesRepository.findOne(profile.id);
  }
}
