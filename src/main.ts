import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app';
import { authInterceptor } from './app/core/auth/auth.interceptor';
import { routes } from './app/app.routes'; // 👈 هنعمله لو مش موجود

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes) // 👈 السطر المهم
  ],
}).catch((err) => console.error(err));
