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

export type { PaginationParams, PaginatedResult }