import { ApplicationConfig, inject, provideZoneChangeDetection, PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApolloLink } from '@apollo/client';

export const appConfig: ApplicationConfig = {
  providers: [
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const platformId = inject(PLATFORM_ID);
      
      // Determine GraphQL URL based on environment with debugging
      let graphqlUrl: string;
      const isDocker = typeof process !== 'undefined' && (
        process.env['DOCKER_ENV'] === 'true' || 
        process.env['NODE_ENV'] === 'production' ||
        process.env['HOSTNAME']?.includes('docker') ||
        process.env['CONTAINER_NAME']
      );
      
      if (isPlatformBrowser(platformId) && typeof window !== 'undefined') {
        // Browser: use relative URL (works for both local dev and Docker)
        graphqlUrl = '/graphql';
        console.log('🌐 Apollo Client - Browser mode:', { 
          graphqlUrl, 
          origin: window.location.origin,
          fullUrl: `${window.location.origin}${graphqlUrl}`,
          platform: 'browser',
          actualPort: window.location.port,
          shouldUsePort80: window.location.port === '4200' ? 'ISSUE: Using 4200 instead of 80!' : 'OK'
        });
      } else {
        // SSR: Choose URL based on environment
        if (isDocker) {
          graphqlUrl = 'http://backend:3000/graphql';
          console.log('🐳 Apollo Client - Docker SSR mode:', { graphqlUrl, env: process.env['NODE_ENV'] });
        } else {
          graphqlUrl = 'http://localhost:3000/graphql';
          console.log('🖥️ Apollo Client - Local SSR mode:', { graphqlUrl, env: process.env['NODE_ENV'] });
        }
      }

      // Create a custom link that removes cookies
      const noCookieLink = new ApolloLink((operation, forward) => {
        console.log('🔧 Apollo Link - Removing cookies from GraphQL request');
        
        // Modify the request context to exclude credentials
        const context = operation.getContext();
        operation.setContext({
          credentials: 'omit',
          headers: {
            ...context['headers'],
            'Cookie': '' // Explicitly remove cookies
          }
        });
        
        return forward(operation);
      });

      const httpLinkInstance = httpLink.create({ uri: graphqlUrl });

      return {
        link: noCookieLink.concat(httpLinkInstance),
        cache: new InMemoryCache(),
        defaultOptions: {
          watchQuery: {
            fetchPolicy: 'cache-and-network',
            errorPolicy: 'all'
          },
          query: {
            fetchPolicy: 'cache-first',
            errorPolicy: 'all'
          }
        }
      };
    }),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
  ],
};
