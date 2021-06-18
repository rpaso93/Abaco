import { ObjectType, Field, ID } from "type-graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
class ContactData {
  @Field(() => ID)
  @PrimaryColumn('nvarchar')
  id!: string;

  @Field(() => String, {nullable: true})
  @Column({nullable: true})
  value?: string;
}

export default ContactData;