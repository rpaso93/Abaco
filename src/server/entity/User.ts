import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Role from './Role';

@ObjectType()
@Entity()
class User{
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({type: 'nvarchar', unique: true })
  email!: string;

  @Column()
  password!: string;

  @Field()
  @Column()
  name!: string;
  
  @Field()
  @Column()
  lastname!: string;
  
  @Column({ nullable: true, default: null })
  retrieveKey: string;

  @Field(()=> Role)
  @ManyToOne(() => Role)
  role!: Role;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

export default User;
