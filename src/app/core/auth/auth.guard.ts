import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { take,map,filter,switchMap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // 1. Wait until initialization is complete
  // 2. Then check if authenticated
  return authService.isInitializing$.pipe(
    filter(isInit => !isInit), // Wait until isInitializing is false
    switchMap(() => authService.isAuthenticated$),
    take(1),
    map((isAuth) => {
      if (isAuth) return true;

      // Use returnUrl to match your logic
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    })
  );
};
