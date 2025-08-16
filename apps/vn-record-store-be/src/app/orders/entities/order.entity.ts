import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { AlbumOrderItem } from './album-order-item.entity';
import { OrderStatus } from '@prisma/client';

@ObjectType()
export class Order {
  @Field(() => ID)
  id!: string;

  @Field(() => [AlbumOrderItem])
  albumItems!: AlbumOrderItem[];

  @Field(() => Float)
  totalAmount!: number;

  @Field(() => String)
  status!: OrderStatus;

  @Field(() => String, { nullable: true })
  paymentId?: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
