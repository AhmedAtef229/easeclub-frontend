import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const publicEndpoints = [
    '/login',
    '/reset-password',
  ];

  // لو الريكوست رايح لـ endpoint public → سيبه زي ما هو
  if (publicEndpoints.some(url => req.url.includes(url))) {
    return next(req);
  }

  const token = localStorage.getItem('accessToken');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
