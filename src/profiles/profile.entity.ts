import { User } from '../users/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'profile' })
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.profiles, { eager: true })
  user: User;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  bio?: string;

  @ManyToMany(() => Profile)
  @JoinTable()
  following?: Profile[];
}
