import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

const DEFAULT_PER_PAGE = 100;

export interface Paginated<T> {
  page: number;
  perPage: number;
  totalPages: number;
  total: number;
  result: T[];
}

export class PaginateOptions {
  // TODO: Automatically cast parameters to int from request
  //       For some reason the IsNumer and Type annotations don't do anything
  @ApiProperty({
    required: false,
    type: Number,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: string;

  @ApiProperty({
    required: false,
    type: Number,
    minimum: 0,
    default: DEFAULT_PER_PAGE,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  perPage?: string;
}

export function paginate<T>(data: T[], options: PaginateOptions): Paginated<T> {
  const page = parseInt(options.page) || 0;
  const perPage = parseInt(options.perPage) || DEFAULT_PER_PAGE;
  const offset = page * perPage;

  return {
    page,
    perPage,
    totalPages: Math.ceil(data.length / perPage),
    total: data.length,
    result: data.slice(offset, offset + perPage),
  };
}
