import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/users/user.entity';

@Exclude()
export class ReadProfileDto {
  @Expose()
  name: string;

  @Expose()
  bio?: string;

  @Expose()
  @Type(() => ReadUserDto)
  user: ReadUserDto;
}
