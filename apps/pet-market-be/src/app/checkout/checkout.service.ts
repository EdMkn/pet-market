import { Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { OrdersService } from '../orders/orders.service';
import { Stripe } from 'stripe'
const stripeSecret = process.env.STRIPE_SECRET;
if(!stripeSecret){
  throw new Error('Missing stripe secret');
}

const stripe = new Stripe(stripeSecret);
@Injectable()
export class CheckoutService {
  constructor(private ordersService : OrdersService) {

  }
  
  async create(createCheckoutDto: CreateCheckoutDto) {
    // Transform items to include productId from id
    const orderItems = createCheckoutDto.items.map(item => ({
      productId: item.id, // Map id to productId
      quantity: item.quantity,
      price: item.price
    }));

    const order = await this.ordersService.create({
      items: orderItems,
      totalAmount: createCheckoutDto.totalAmount
    });

    const session = await stripe.checkout.sessions.create({
      line_items: createCheckoutDto.items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/checkout/success?orderID=${order.id}`,
      cancel_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/checkout/cancel`,
      metadata: {
        orderId: order.id,
      },
    });

    return {
      url: session.url,
      sessionId: session.id,
      orderId: order.id,
    };
  }
}
