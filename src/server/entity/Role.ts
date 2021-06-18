import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
class Role{
  @Field(()=> ID)
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Field(()=> String)
  @Column('varchar')
  description!: string;
}

export default Role;