import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateAlbumInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  artist: string;

  @Field(() => String)
  description: string;

  @Field(() => Number)
  price: number;

  @Field(() => String)
  image: string;

  @Field(() => String)
  genre: string;

  @Field(() => Int)
  releaseYear: number;

  @Field(() => Int)
  trackCount: number;

  @Field(() => String)
  duration: string;

  @Field(() => String)
  stripePriceId: string;

  @Field(() => Boolean, { nullable: true })
  isFeatured?: boolean;
} 