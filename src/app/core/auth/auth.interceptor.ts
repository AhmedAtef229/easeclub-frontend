import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService,AuthEndpoints } from './auth.service';
import { BehaviorSubject, Observable, throwError, catchError, filter, take, switchMap } from 'rxjs';

// Queue for multiple 401 requests
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

// Define public URLs that don't require auth
const PUBLIC_URLS = [
  AuthEndpoints.LOGIN,
  AuthEndpoints.RESET_PASSWORD,
  AuthEndpoints.REFRESH
];

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  const isPublic = PUBLIC_URLS.some(url => req.url.includes(url));

  // Clone request with default headers
  let authReq = req.clone({
    setHeaders: { 'X-Client-Type': 'Web' }
  });

  // Add Authorization header if token exists and URL is not public
  const token = authService.getAccessToken();
  if (token && !isPublic) {
    authReq = authReq.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !isPublic) {
        return handle401Error(authReq, next, authService);
      }
      return throwError(() => error);
    })
  );
};

// ---------------------------
// Handle 401 with Refresh Token
// ---------------------------
function handle401Error(req: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService): Observable<HttpEvent<any>> {

  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap(res => {
        isRefreshing = false;

        //refresh failed
        if (!res?.accessToken) {
          authService.logout();
          return throwError(() => new Error('Unable to refresh token'));
        }

        refreshTokenSubject.next(res.accessToken);

        //make request again after refreshing
        return next(req.clone({
          setHeaders: { Authorization: `Bearer ${res.accessToken}` }
        }));
      }),
      catchError(err => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => err);
      })
    );
  }
// --------------------------- Queue of Parallel requests ---------------------------
  else {
    // Wait for refresh to finish in parallel requests
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        return next(req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        }));
      })
    );
  }
}