import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReactionType } from '../entities/reaction.entity';

export class CreateReactionDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(ReactionType)
  type: ReactionType;
}
