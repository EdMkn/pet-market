import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore } from '../stores/cart.store';
import { StripesService } from '../services/stripes.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  cartStore = inject(CartStore);
  stripesService = inject(StripesService);

  checkout() {
    this.stripesService.createCheckoutSession().subscribe(({url}) => {
      location.href = url;
    });
  }
}
