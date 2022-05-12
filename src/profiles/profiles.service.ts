import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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

  async findOneByName(name: string): Promise<Profile> {
    return this.profilesRepository.findOneOrFail({
      where: { name: name },
      relations: ['following'],
    });
  }

  async findOne(id: string): Promise<Profile> {
    return this.profilesRepository.findOneOrFail(id, {
      relations: ['following'],
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.profilesRepository.count({ where: { id: id } });
    return count != 0;
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await this.profilesRepository.count({
      where: { name: name },
    });
    return count != 0;
  }

  async follow(
    user: User,
    profileId: string,
    targetProfileId: string,
  ): Promise<Profile> {
    let profile: Profile, targetProfile: Profile;
    try {
      [profile, targetProfile] = await Promise.all([
        this.findOne(profileId),
        this.findOne(targetProfileId),
      ]);
    } catch (e) {
      throw new NotFoundException('Profile not found.');
    }

    if (!profile.belongsTo(user.id)) {
      throw new UnauthorizedException('You can only modify your profiles.');
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

    return this.profilesRepository.save(profile);
  }

  async update(
    user: User,
    profile: Profile,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    if (!profile.belongsTo(user.id)) {
      throw new UnauthorizedException('You can only modify your profiles.');
    }

    await this.profilesRepository.update(profile.id, updateProfileDto);
    return this.profilesRepository.findOne(profile.id);
  }
}
