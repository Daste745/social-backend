import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
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
    try {
      return await this.profilesRepository.findOneOrFail({
        where: { name: name },
        relations: ['following'],
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }
      throw e;
    }
  }

  async findOne(id: string): Promise<Profile> {
    try {
      return await this.profilesRepository.findOneOrFail(id, {
        relations: ['following'],
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }
      throw e;
    }
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
    [profile, targetProfile] = await Promise.all([
      this.findOne(profileId),
      this.findOne(targetProfileId),
    ]);

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

    if (
      updateProfileDto.name &&
      (await this.existsByName(updateProfileDto.name))
    ) {
      throw new BadRequestException(
        'This username is already in use by another user.',
      );
    }

    if (updateProfileDto.name) profile.name = updateProfileDto.name;
    if (updateProfileDto.bio) profile.bio = updateProfileDto.bio;

    return this.profilesRepository.save(profile);
  }
}
