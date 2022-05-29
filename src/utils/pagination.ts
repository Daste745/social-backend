export interface Paginated<T> {
  page: number;
  perPage: number;
  totalPages: number;
  total: number;
  result: T[];
}

export interface PaginateOptions {
  page?: number;
  perPage?: number;
}

export function paginate<T>(data: T[], options: PaginateOptions): Paginated<T> {
  const page = options.page ?? 0;
  const perPage = options.perPage ?? 10;
  const offset = page * perPage;

  return {
    page,
    perPage,
    totalPages: Math.floor(data.length / perPage),
    total: data.length,
    result: data.slice(offset, offset + perPage),
  };
}
