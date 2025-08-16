import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Album {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  artist!: string;

  @Field(() => String)
  description!: string;

  @Field(() => Number)
  price!: number;

  @Field(() => String)
  image!: string;

  @Field(() => String)
  genre!: string;

  @Field(() => Int)
  releaseYear!: number;

  @Field(() => Int)
  trackCount!: number;

  @Field(() => String)
  duration!: string;

  @Field(() => String)
  stripePriceId!: string;

  @Field(() => Boolean, { nullable: true })
  isFeatured?: boolean;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
} 