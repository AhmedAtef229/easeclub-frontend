import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Use a more specific check to avoid accidental matches
  const isPublic = req.url.includes('/auth/login') || req.url.includes('/auth/reset-password');

  if (isPublic) {
    return next(req);
  }

  // 🚨 FIX: Match the key used in AuthService ('access_token')
  const token = localStorage.getItem('accessToken');

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};