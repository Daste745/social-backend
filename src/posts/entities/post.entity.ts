import { Profile } from '../../profiles/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'post' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Profile, (profile) => profile.posts, { eager: true })
  author: Profile;

  @Column({ nullable: false, length: 1000 })
  content: string;

  public belongsTo(profileId: string): boolean {
    return this.author.id === profileId;
  }
}
