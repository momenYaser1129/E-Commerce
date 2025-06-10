import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);

  // another way platform id service
  const _PLATFORM_ID = inject(PLATFORM_ID);
  // if (isPlatformBrowser(PLATFORM_ID)) {
  //   //  Source code
  // }

  // check type of global object
  if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem('userToken') !== null) {
      return true;
    } else {
      _Router.navigate(['/login']);
      return false;
    }
  } else {
    return false;
  }
};
