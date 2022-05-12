import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { CreateProfileDto } from './create-profile.dto';

@Exclude()
export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  bio?: string;
}
