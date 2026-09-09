export interface ApiSuccessResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
}

export interface ApiResponse<T> {
  status: number;
  headers: Record<string, string>;
  body: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
