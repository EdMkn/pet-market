import { Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';

@Injectable()
export class CheckoutService {
  create(createCheckoutDto: CreateCheckoutDto) {
    return 'This action adds a new checkout';
  }
}
