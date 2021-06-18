import { Field, InputType } from "type-graphql";

@InputType()
export class CategoryInput{
  @Field(() => String)
  name!: string;

  @Field(()=> String, { nullable: true})
  parentId?: string;
}