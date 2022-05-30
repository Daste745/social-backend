import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance, Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

const DEFAULT_PER_PAGE = 100;

export interface Paginated<T> {
  page: number;
  perPage: number;
  totalPages: number;
  total: number;
  result: T[];
}

export class PaginateOptions {
  @ApiProperty({
    required: false,
    type: Number,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    required: false,
    type: Number,
    minimum: 0,
    default: DEFAULT_PER_PAGE,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  perPage?: number;
}

export function paginate<T>(data: T[], options: PaginateOptions): Paginated<T> {
  options = plainToInstance(PaginateOptions, options);

  const page = options.page || 0;
  const perPage = options.perPage || DEFAULT_PER_PAGE;
  const offset = page * perPage;

  return {
    page,
    perPage,
    totalPages: Math.ceil(data.length / perPage),
    total: data.length,
    result: data.slice(offset, offset + perPage),
  };
}
