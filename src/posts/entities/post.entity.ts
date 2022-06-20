import { Profile } from '../../profiles/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reaction } from './reaction.entity';

@Entity({ name: 'post' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Profile, (profile) => profile.posts, { eager: true })
  author: Profile;

  @ManyToOne(() => Post, { nullable: true })
  parent?: Post;

  @Column({ nullable: false, length: 1000 })
  content: string;

  @OneToMany(() => Reaction, (reaction) => reaction.author, { eager: true })
  reactions?: Reaction[];

  public belongsTo(profileId: string): boolean {
    return this.author.id === profileId;
  }
}
