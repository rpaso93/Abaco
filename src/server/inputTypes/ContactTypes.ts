import { Field, InputType } from "type-graphql";

@InputType()
export class ContactInput{
  @Field()
  name!: String;

  @Field()
  email!: String;
  
  @Field()
  issue!: String;

  @Field()
  content!: String;
}