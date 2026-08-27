import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '../models/api.model';
import { ErrorService } from '../services/error.service';

/**
 * Normalizes every failed HTTP response into a typed ApiError so that
 * consumers never depend on raw HttpErrorResponse or network internals.
 */
export const errorHttpInterceptorFn: HttpInterceptorFn = (req, next) => {
  const errors = inject(ErrorService);

  return next(req).pipe(
    catchError((error: unknown) => {
      const apiError: ApiError = errors.normalize(error);
      return throwError(() => apiError);
    })
  );
};
