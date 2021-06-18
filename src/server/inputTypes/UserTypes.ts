import { Field, ID, InputType, ObjectType } from 'type-graphql';

@InputType()
export class UserInput {
  @Field(() => String)
  email!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  lastname!: string;

  @Field(() => ID)
  role!: number;
}

@InputType()
export class RegisterInput extends UserInput {
  @Field(() => String)
  password!: string;

  @Field(() => String)
  confirmPassword!: string;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;
}

@ObjectType()
export class LoginResult {
  @Field()
  jwt!: string;

  @Field()
  userId!: string;
}
