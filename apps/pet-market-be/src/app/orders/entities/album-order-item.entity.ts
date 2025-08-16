import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Album } from '../../albums/entities/album.entity';

@ObjectType()
export class AlbumOrderItem {
  @Field(() => String)
  id!: string;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Float)
  price!: number;

  @Field(() => Album)
  album!: Album;

  @Field(() => String)
  albumId!: string;

  @Field(() => String)
  orderId!: string;
}