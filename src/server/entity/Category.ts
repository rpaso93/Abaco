import { Field, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@ObjectType()
@Entity()
@Tree('materialized-path')
class Category{
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name!: string;

  @TreeParent()
  parentCategory: Category;

  @Field(()=> [Category], {nullable: true})
  @TreeChildren()
  subCategories?: Category[];
}

export default Category;
