import { Profile } from '../profiles/profile.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Profile, (profile) => profile.user)
  profiles: Profile[];

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @VersionColumn()
  version: number;
}
