import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

@Exclude()
export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsString()
  content?: string;
}
