export interface ApiError {
  /** Stable machine-readable error code from the backend, e.g. VALIDATION_ERROR. */
  code: string;
  /** Corresponding HTTP status code. */
  status: number;
  /** Client-safe, human-readable description. */
  message: string;
  /** ISO-8601 timestamp. */
  timestamp?: string;
  /** Request path that produced the error, when available. */
  path?: string;
  /** Per-field validation messages (VALIDATION_ERROR only). */
  fieldErrors?: Record<string, string>;
}

export interface Pageable {
  page: number;
  size: number;
  sort?: string;
}

/**
 * Raw Spring Data Page<T> shape as returned by the backend paginated endpoints.
 */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements?: number;
  empty?: boolean;
}
