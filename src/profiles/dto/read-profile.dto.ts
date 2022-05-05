import { Exclude, Expose, Type } from 'class-transformer';
import { ReadUserDto } from 'src/users/dto/read-user.dto';

@Exclude()
export class ReadProfileDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  bio?: string;

  @Expose()
  @Type(() => ReadUserDto)
  user: ReadUserDto;

  @Expose()
  @Type(() => ReadProfileDto)
  following: ReadProfileDto[];
}
