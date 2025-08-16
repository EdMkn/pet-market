import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDto {
  id!: string; // Add this field to match frontend data

  albumId!: string;

  @IsNumber()
  quantity!: number;

  @IsNumber()
  price!: number;

  name!: string;
  stripePriceId!: string;
}

export class CreateCheckoutDto {
    @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  albumItems!: CartItemDto[];

  @IsNumber()
  totalAmount!: number;
}
