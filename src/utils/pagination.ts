import { applyDecorators, Type as NestType } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';
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

export class PaginatedDto<T> {
  @ApiProperty()
  page: number;

  @ApiProperty()
  perPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  total: number;

  @ApiProperty({ isArray: true })
  result: T[];
}

export class PaginateOptions {
  @ApiProperty({
    required: false,
    type: Number,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    required: false,
    type: Number,
    minimum: 1,
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

  const page = options.page || 1;
  const perPage = options.perPage || DEFAULT_PER_PAGE;
  const offset = (page - 1) * perPage;

  return {
    page,
    perPage,
    totalPages: Math.ceil(data.length / perPage),
    total: data.length,
    result: data.slice(offset, offset + perPage),
  };
}

export const ApiPaginatedResponse = <T extends NestType<any>>(model: T) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              result: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
