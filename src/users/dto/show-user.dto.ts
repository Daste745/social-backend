import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ShowUserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;
}
