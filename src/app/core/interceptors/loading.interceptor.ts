import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const _NgxSpinnerService = inject(NgxSpinnerService);

  // Req => Show loading 
  if( req.url.includes("products") || req.url.includes("categories")){
    _NgxSpinnerService.show()
  }

  return next(req).pipe(finalize(()=>{

    // logic Res End
    _NgxSpinnerService.hide()
  }));
};

// must import in app config
