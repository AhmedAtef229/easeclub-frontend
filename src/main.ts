// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { provideRouter } from '@angular/router';

// import { AppComponent } from './app/app';
// import { authInterceptor } from './app/core/auth/auth.interceptor';
// import { routes } from './app/app.routes';

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideHttpClient(withInterceptors([authInterceptor])),
//     provideRouter(routes)
//   ],
// }).catch((err) => console.error(err));

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';

import { AppComponent } from './app/app';
import { routes } from './app/app.routes';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent,appConfig).catch(console.error);
