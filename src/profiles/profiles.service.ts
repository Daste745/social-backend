import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    return this.profilesRepository.findOneOrFail(id, {
      relations: ['following'],
    });
  }

  async follow(profileId: string, targetProfileId: string): Promise<Profile> {
    let profile: Profile, targetProfile: Profile;
    try {
      [profile, targetProfile] = await Promise.all([
        this.findOne(profileId),
        this.findOne(targetProfileId),
      ]);
    } catch (e) {
      throw new NotFoundException('Profile not found.');
    }

    if (profile.id === targetProfile.id) {
      throw new BadRequestException("You can't follow yourself.");
    }

    if (profile.following.some((p) => p.id === targetProfileId)) {
      profile.following = profile.following.filter(
        (p) => p.id !== targetProfileId,
      );
    } else {
      profile.following.push(targetProfile);
    }

    this.profilesRepository.save(profile);

    return profile;
  }

  async update(
    profile: Profile,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    await this.profilesRepository.update(profile, updateProfileDto);
    return this.profilesRepository.findOne(profile.id);
  }
}
