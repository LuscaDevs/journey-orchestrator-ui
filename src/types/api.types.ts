// API Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  correlationId?: string;
}

// API Response Wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: ApiError;
}

// API Configuration
export interface ApiConfig {
  basePath: string;
  apiKey?: string;
  timeout?: number;
}

// Request Options
export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API Status Codes
export const ApiStatusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type ApiStatusCode = typeof ApiStatusCode[keyof typeof ApiStatusCode];

// Pagination Types
export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}
