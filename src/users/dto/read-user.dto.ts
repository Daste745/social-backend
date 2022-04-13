import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReadUserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;
}
