import { afterNextRender, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStore } from '../../stores/order.store';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderDetailComponent } from "../../orders/components/order-detail/order-detail.component";
import { CartStore } from '../../stores/cart.store';

@Component({
  selector: 'app-checkout-success',
  imports: [CommonModule, OrderDetailComponent, RouterLink],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss',
})
export class CheckoutSuccessComponent implements OnInit {
  orderStore = inject(OrderStore);
  route = inject(ActivatedRoute);
  cartStore = inject(CartStore);

  constructor() {
    afterNextRender(() => {
      this.cartStore.clearCart();
    });
  }

  ngOnInit(): void {
    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    if(!orderId) {
      this.orderStore.setError('No order id found');
      return;
    }
    this.orderStore.getOrder(orderId).subscribe();
  }
}
