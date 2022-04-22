import { IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
