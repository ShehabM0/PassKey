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
