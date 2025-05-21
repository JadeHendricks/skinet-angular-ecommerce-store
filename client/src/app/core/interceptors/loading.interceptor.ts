import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';
import { BusyService } from '../services/busy.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  busyService.busy();

  return next(req).pipe(
    delay(500), 
    // finalize is used to make sure that the busy service is set to idle
    // even if the request fails
    // this is important because if the request fails, the busy service will not be set to idle
    // and the loading spinner will not be removed
    finalize(() => busyService.idle())
  );
};
