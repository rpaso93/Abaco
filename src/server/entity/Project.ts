import { Field, ID, Int, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Category from './Category';
import Image from './Image';

@ObjectType()
@Entity()
class Project {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => Int)
  @Column()
  surface!: number;

  @Field(() => String)
  @Column({type: 'date'})
  year!: Date;

  @Field(() => String)
  @Column()
  location!: string;

  @Field(() => String)
  @Column({type: 'text'})
  description!: string;

  @Field(() => [Category])
  @ManyToMany(() => Category, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable()
  categories!: Category[];

  @Field(() => String, {nullable: true})
  mainCategory?: string;

  @Field(() => [Image], {nullable: true})
  @OneToMany(() => Image, image => image.project, {cascade: true, nullable: true })
  images!: Image[];

  @Field(() => String, {nullable: true})
  @Column({default: null, nullable: true})
  portraitId?: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

export default Project;
