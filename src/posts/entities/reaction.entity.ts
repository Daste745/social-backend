import { Profile } from '../../profiles/entities';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';

export enum ReactionType {
  Like = 'like',
}

@Entity({ name: 'reaction' })
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile, { nullable: false })
  author: Profile;

  @ManyToOne(() => Post, (post) => post.reactions, { nullable: false })
  post: Post;

  @Column({
    type: 'enum',
    enum: ReactionType,
    default: ReactionType.Like,
    nullable: false,
  })
  type: ReactionType;

  public belongsTo(profileId: string): boolean {
    return this.author.id === profileId;
  }
}
