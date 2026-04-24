import { ApplicationConfig,provideAppInitializer,inject } from '@angular/core';
import { provideHttpClient,withInterceptors} from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { APP_INITIALIZER } from '@angular/core';
import { AuthService } from './core/auth/auth.service';
import { authInterceptor } from './core/auth/auth.interceptor';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(async () => {
      return await inject(AuthService).initAuth();
    }
      ),
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
