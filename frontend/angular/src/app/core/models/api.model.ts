export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface Pageable {
  page: number;
  size: number;
  sort?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
