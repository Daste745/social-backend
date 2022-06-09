import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ReadProfileDto } from 'src/profiles/dto';
import { Profile } from 'src/profiles/entities';

@Exclude()
export class ReadPostDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  created_at: Date;

  @ApiProperty()
  @Expose()
  @Type(() => ReadProfileDto)
  author: Profile;

  @ApiProperty()
  @Expose()
  content: string;
}
