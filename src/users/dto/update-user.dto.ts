import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';

@Exclude()
export class UpdateUserDto {
  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsString()
  password?: string;
}
