import { Field, InputType, Int } from "type-graphql";

@InputType()
export class ProjectInput{
  @Field(() => String)
  name!: string;

  @Field(() => Int)
  surface!: number;

  @Field(() => String)
  year!: Date;

  @Field(() => String)
  location!: string;

  @Field(() => String)
  description!: string;

  @Field(() => [String])
  categories!: string[];
}