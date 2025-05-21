import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // Intercept the request and handle errors globally
  // You can log the error, show a notification, or redirect to an error page
  const router = inject(Router);
  const snackbar = inject(SnackbarService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // Handle the error here
      if (err.status === 400) {
        if (err.error.errors) {
          const modelStateErrors = [];
          for (const key in err.error.errors) {
            if (err.error.errors[key]) {
              modelStateErrors.push(err.error.errors[key]);
            }
          }
          // throwing here in order to make sure that the error is not swallowed
          // and the component that made the request can handle it
          throw modelStateErrors.flat();
        } else {
          snackbar.error(err.error.title || err.error);
        }

        snackbar.error(err.error.title || err.error);
      }

      if (err.status === 401) {
        snackbar.error(err.error.title || err.error);
      }

      if (err.status === 404) {
        router.navigateByUrl('/not-found');
      }

      if (err.status === 500) {
        const navigationExtras: NavigationExtras = {state: {error: err.error}};
        router.navigateByUrl('/server-error', navigationExtras);
      }

      // the reason we throw the error is to make sure that the error is not swallowed
      // and the component that made the request can handle it
      return throwError(() => err);
    })
  );
};
