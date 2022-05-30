import { User } from 'src/users/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Relation } from './relation.entity';

@Entity({ name: 'profile' })
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.profiles, { eager: true })
  user: User;

  @Column({ unique: true, length: 24 })
  name: string;

  @Column({ nullable: true })
  bio?: string;

  @OneToMany(() => Relation, (relation) => relation.profile_1)
  @JoinColumn()
  following?: Relation[];

  @OneToMany(() => Relation, (relation) => relation.profile_2)
  @JoinColumn()
  followers?: Relation[];

  public belongsTo(userId: string): boolean {
    return this.user.id === userId;
  }
}
