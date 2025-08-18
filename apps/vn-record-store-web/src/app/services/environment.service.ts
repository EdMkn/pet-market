import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private platformId = inject(PLATFORM_ID);

  get baseUrl(): string {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      return window.location.origin;
    }
    // Fallback for SSR - use Docker internal network
    return 'http://backend:3000';
  }

  get apiUrl(): string {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      return `${window.location.origin}/api`;
    }
    // For SSR, use direct backend URL
    return 'http://backend:3000/api';
  }

  get graphqlUrl(): string {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      return `${window.location.origin}/graphql`;
    }
    // For SSR, use direct backend URL  
    return 'http://backend:3000/graphql';
  }
} 