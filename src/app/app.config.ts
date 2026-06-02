import { ApplicationConfig,provideAppInitializer,inject } from '@angular/core';
import { provideHttpClient,withInterceptors} from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './core/auth/auth.service';
import { authInterceptor } from './core/auth/auth.interceptor';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { AdminContextStoreService } from './core/services/api/admin-context-store.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(async () => {
      const authService = inject(AuthService);
      const adminStore = inject(AdminContextStoreService);
      await authService.initAuth();
      if (authService.getAccessToken()) {
        try {
          await adminStore.ensureContextLoaded();
        } catch (error) {
          console.error('Failed to initialize admin context during app startup:', error);
        }
      }
    }),
    provideHttpClient(
    // Add your interceptor back! Otherwise, requests won't have the Bearer token
    withInterceptors([authInterceptor])),
    importProvidersFrom(FormsModule),
    provideRouter(routes),

    provideTranslateService({
      fallbackLang: 'ar',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
    })


  ],
};
