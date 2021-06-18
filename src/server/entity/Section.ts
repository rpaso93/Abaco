import { ObjectType, Field, ID } from "type-graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
class Section {
  @Field(() => ID)
  @PrimaryColumn('nvarchar')
  id!: string;

  @Field(() => String, {nullable: true})
  @Column({nullable: true})
  img?: string;

  @Field(() => String, {nullable: true})
  @Column({type: 'text', nullable: true})
  contenido?: string;
}

export default Section;