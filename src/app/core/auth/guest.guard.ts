import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Use the Observable ($) and pipe it
  return authService.isAuthenticated$.pipe(
    take(1), // Take the current value and stop
    map((isAuth) => {
      if (isAuth) {
        // If already logged in, bounce them to the dashboard
        router.navigate(['/admin/dashboard']); 
        return false;
      }
      // If not logged in, let them see the login/register page
      return true;
    })
  );
};