import { inject, Injectable } from '@angular/core';
import { CartStore } from '../stores/cart.store';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StripesService {

  cartStore = inject(CartStore);
  http = inject(HttpClient);

  createCheckoutSession() {
    const items = this.cartStore.items();
    const totalAmount = this.cartStore.totalAmount();

    return this.http.post<{url: string}>(
      'http://localhost:3000/api/checkout', 
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
