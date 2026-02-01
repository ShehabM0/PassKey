type PaginationParams = {
  page?: number
  limit?: number
}

type PaginatedResult<T> = {
  data: T[]
  pagination: {
    currentPage: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

// filter dropdown / infinite scroll.
type ListPaginationParams = {
  offset?: number
  limit?: number
}

type ListPaginatedResult<T> = {
  data: T[]
  pagination: {
    nextOffset: number
    limit: number
    totalItems: number
    hasNextPage: boolean
  }
}

export type {
  PaginationParams, PaginatedResult,
  ListPaginationParams, ListPaginatedResult
}