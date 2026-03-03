import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { take,map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated$.pipe(
    take(1), // Take the current value and complete
    map((isAuth) => {
      if (isAuth) {
        return true;
      }

      // If not authenticated, redirect to login
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    })
  );

};
