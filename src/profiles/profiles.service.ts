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
import { Relation } from './relation.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,

    @InjectRepository(Relation)
    private relationsRepository: Repository<Relation>,
  ) {}

  async create(
    createProfileDto: CreateProfileDto,
    user: User,
  ): Promise<Profile> {
    if (await this.existsByName(createProfileDto.name)) {
      throw new BadRequestException(
        'This username is already in use by another user.',
      );
    }

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
        relations: ['followers', 'following'],
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
        relations: ['following', 'followers'],
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

    const relation = profile.following.find(
      (p) => p.profile_2.id === targetProfileId,
    );
    if (relation) {
      await this.relationsRepository.delete(relation);
    } else {
      await this.relationsRepository.save({
        profile_1: profile,
        profile_2: targetProfile,
      });
    }

    return profile;
  }

  async findFollowing(id: string): Promise<Profile[]> {
    const profile = await this.findOne(id);
    return profile.following.map((p) => p.profile_2);
  }

  async findFollowers(id: string): Promise<Profile[]> {
    const profile = await this.findOne(id);
    return profile.followers.map((p) => p.profile_1);
  }

  async update(
    user: User,
    profileId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.findOne(profileId);

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
