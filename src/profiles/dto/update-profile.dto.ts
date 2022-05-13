import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { CreateProfileDto } from './create-profile.dto';

@Exclude()
export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsString()
  bio?: string;
}
