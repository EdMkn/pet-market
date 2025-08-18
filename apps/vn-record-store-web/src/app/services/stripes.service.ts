import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CartStore } from '../stores/cart.store';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StripesService {

  cartStore = inject(CartStore);
  http = inject(HttpClient);
  platformId = inject(PLATFORM_ID);

  private get apiUrl(): string {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      console.log('🌐 Stripe Service - Browser mode: /api');
      return '/api';
    }
    
    // SSR: Check environment for proper URL
    const isDocker = typeof process !== 'undefined' && (
      process.env['DOCKER_ENV'] === 'true' || 
      process.env['NODE_ENV'] === 'production' ||
      process.env['CONTAINER_NAME']
    );
    
    const apiUrl = isDocker ? 'http://backend:3000/api' : 'http://localhost:3000/api';
    console.log(`🔧 Stripe Service - SSR mode (${isDocker ? 'Docker' : 'Local'}):`, apiUrl);
    return apiUrl;
  }

  createCheckoutSession() {
    const items = this.cartStore.items();
    const totalAmount = this.cartStore.totalAmount();

    return this.http.post<{url: string}>(
      `${this.apiUrl}/checkout`, 
      {
        albumItems: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          stripePriceId: item.stripePriceId
        })),
        totalAmount,
      }
    );

  }
}
