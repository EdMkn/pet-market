import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpException,
  HttpStatus,
  Redirect,
} from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  async create(@Body() createCheckoutDto: CreateCheckoutDto) {
    const session = await this.checkoutService.create(createCheckoutDto);
    if(!session.url) {
      throw new HttpException('Failed to create checkout session',HttpStatus.BAD_REQUEST);
    }
    return {
      url: session.url,
    };
  }

  @Get('success')
  @Redirect()
  async success(@Query('orderID') orderId: string) {
    // Redirect to frontend success page with order ID
    return {
      url: `${process.env.FRONTEND_URL || 'http://localhost:4200'}/checkout/success?orderID=${orderId}`,
    };
  }

  @Get('cancel')
  @Redirect()
  async cancel() {
    // Redirect to frontend cancel page
    return {
      url: `${process.env.FRONTEND_URL || 'http://localhost:4200'}/checkout/cancel`,
    };
  }
}
