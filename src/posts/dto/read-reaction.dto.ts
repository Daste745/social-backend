import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ReadProfileDto } from 'src/profiles/dto';
import { ReactionType } from '../entities/reaction.entity';

@Exclude()
export class ReadReactionDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  @Type(() => ReadProfileDto)
  author: ReadProfileDto;

  @ApiProperty({ enum: ReactionType })
  @Expose()
  type: ReactionType;
}
