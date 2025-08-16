import { InputType, Int, Field, Float } from '@nestjs/graphql';

@InputType()
export class AlbumOrderItemInput {
  @Field(() => String)
  albumId!: string;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Float)
  price!: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => [AlbumOrderItemInput])
  albumItems!: AlbumOrderItemInput[];

  @Field(() => Float)
  totalAmount!: number;

  // @Field(() => String)
  // token!: string;
}
