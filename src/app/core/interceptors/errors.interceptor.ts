import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  //   Logic Req

  const _ToastrService = inject(ToastrService);

  return next(req).pipe(
    catchError((err) => {
      // Logic Errors
      console.log('Interceptors', err.error.message);
      // if(req.url.includes('logic for Api'))
      // {} 
      _ToastrService.error(err.error.message, 'MarketPulse');
      // return throwError(err) Deprcated
      return throwError(() => err);
    })
  );
  // Logic Res
};
