export interface Credential {
  id: string;
  platformIcon: string;
  platformTitle: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CredentialsResponse {
  data: Credential[];
  pagination: Pagination;
}

export interface GetUserCredentialsData {
  me: {
    credentials: CredentialsResponse;
  };
}

export interface PaginationVars {
  page: number;
  limit: number;
}



export interface Platform {
  id: string;
  slug: string;
  name: string;
  path: string;
  aliases: string[];
}

export interface PlatformFetch {
  data: Platform[];
  pagination: ListPagination;
}

export interface PlatformQueryRoot {
  platform: {
    fetch: PlatformFetch;
  };
}

export interface PlatformResponse {
  platform: {
    fetch: PlatformFetch;
  };
}

export interface ListPagination {
  nextOffset: number;
  limit: number;
  totalItems: number;
  hasNextPage: boolean;
}

export interface ListPaginationVars {
  query?: string | null;
  offset: number;
  limit: number;
}