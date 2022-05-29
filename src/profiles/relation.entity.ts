import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './profile.entity';

@Entity({ name: 'relation' })
export class Relation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile, (profile) => profile.following, { eager: true })
  profile_1: Profile;

  @ManyToOne(() => Profile, (profile) => profile.followers, { eager: true })
  profile_2: Profile;
}
