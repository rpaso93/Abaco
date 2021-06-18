import {
  Arg,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import User from '../entity/User';
import {
  LoginInput,
  LoginResult,
  RegisterInput,
  UserInput,
} from '../inputTypes/UserTypes';
import { MyContext } from '../types';
import isAuth from '../middleware/auth';
import UserService from '../services/userService';
import Role from '../entity/Role';

@Resolver()
class UserResolver {
  constructor(private userService: UserService = new UserService()) {}

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async register(
    @Arg('input') input: RegisterInput,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    return this.userService.register(input, req.userId);
  }

  @Mutation(() => LoginResult)
  async login(@Arg('input') input: LoginInput): Promise<LoginResult> {
    return this.userService.login(input);
  }

  @Query(() => User)
  @UseMiddleware(isAuth)
  async getUser(@Ctx() { req }: MyContext): Promise<User> {
    return this.userService.getUser(req.userId);
  }

  @Query(() => [User])
  @UseMiddleware(isAuth)
  async getUsers(@Ctx() { req }: MyContext): Promise<User[]> {
    return this.userService.getUsers(req.userId);
  }

  @Query(() => [Role])
  @UseMiddleware(isAuth)
  async getRoles(@Ctx() { req }: MyContext): Promise<Role[]> {
    return this.userService.getRoles(req.userId);
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async changeRole(
    @Arg('id', () => ID) id: string,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    return this.userService.changeUserRole(id, req.userId);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async changeUserPasswordByAdmin(
    @Arg('id', () => ID) id: string,
    @Arg('password') password: string,
    @Arg('confirmPassword') confirmPassword: string,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    return this.userService.changePasswordByAdmin(id, req.userId, password);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async changeUserPasswordByUser(
    @Arg('password') password: string,
    @Arg('confirmPassword') confirmPassword: string,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    return this.userService.changePasswordByUser(req.userId, password);
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async updateUserByAdmin(
    @Arg('id', () => ID) id: string,
    @Arg('input') input: UserInput,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    return this.userService.updateUserByAdmin(id, req.userId, input);
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async updateUserByUser(
    @Arg('input') input: UserInput,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    return this.userService.updateUserByUser(req.userId, input);
  }

  @Mutation(() => ID)
  @UseMiddleware(isAuth)
  async deleteUser(
    @Arg('id', () => ID) id: string,
    @Ctx() { req }: MyContext
  ): Promise<string> {
    return this.userService.deleteUser(id, req.userId);
  }

  @Mutation(() => [ID])
  @UseMiddleware(isAuth)
  async deleteUsers(
    @Arg('ids', () => [ID]) ids: string[],
    @Ctx() { req }: MyContext
  ): Promise<string[]> {
    return this.userService.deleteUsers(ids, req.userId);
  }

  @Mutation(()=> ID)
  @UseMiddleware(isAuth)
  async logout(@Ctx() { req }: MyContext): Promise<string> {
    return req.userId;
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string) : Promise<boolean> {
    return this.userService.setRetrieveTokenAndEmail(email);
  }

  @Mutation(() => Boolean)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string
  ): Promise<boolean> {
    return this.userService.changePassword(token, newPassword);
  }
}

export default UserResolver;
