import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app.routes';
import { FederationService } from './core/services/federation.service';
import { AssetPrefetchService } from './core/services/asset-prefetch.service';

/**
 * Initialize federation manifest on app startup
 */
export function initializeApp(
  federationService: FederationService,
  assetPrefetchService: AssetPrefetchService,
) {
  return async () => {
    try {
      console.log('Initializing app...');

      // Load federation manifest first
      await federationService.loadManifest();

      // Prefetch popular games' assets in background
      setTimeout(() => {
        assetPrefetchService
          .prefetchPopularGames()
          .catch((err) => console.warn('Background prefetch failed:', err));
      }, 2000); // Delay to not block initial app load

      console.log('App initialization complete');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      // Don't throw - let app continue even if manifest fails
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: false, // Enable this in production
      registrationStrategy: 'registerWhenStable:30000',
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [FederationService, AssetPrefetchService],
      multi: true,
    },
  ],
};
