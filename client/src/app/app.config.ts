import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { InitService } from './core/services/init.service';
import { lastValueFrom } from 'rxjs';

function initializeApp() {
  const initService = inject(InitService);
  return lastValueFrom(initService.init()).finally(() => {
      const splash = document.getElementById('initial_splash');
      if (splash) {
        splash.remove();
      }
  });
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    // withInterceptors here is used to add interceptors to the http client
    // we can add multiple interceptors by chaining them
    provideHttpClient(withInterceptors([errorInterceptor, loadingInterceptor])), 
    provideAnimationsAsync(),
    provideAppInitializer(initializeApp),
  ]
};
