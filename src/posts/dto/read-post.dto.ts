import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ReadProfileDto } from 'src/profiles/dto';

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
  author: ReadProfileDto;

  @ApiProperty()
  @Expose()
  @Type(() => ReadPostDto)
  parent?: ReadPostDto;

  @ApiProperty()
  @Expose()
  content: string;
}
