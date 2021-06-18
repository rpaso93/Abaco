import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import Category from '../entity/Category';
import { CategoryInput } from '../inputTypes/CategoryTypes';
import isAuth from '../middleware/auth';
import CategoryService from '../services/categoryService';

@Resolver()
class CategoryResolver {
  constructor(private categoryService: CategoryService = new CategoryService()){}

  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return this.categoryService.getParentCategoriesWithSub();
  }

  @Query(() => [Category])
  @UseMiddleware(isAuth)
  async flatCategories(): Promise<Category[]> {
    return this.categoryService.getCategories();
  }

  @Mutation(() => Category)
  @UseMiddleware(isAuth)
  async createCategory(@Arg('input') input: CategoryInput): Promise<Category> {
    return this.categoryService.createCategory(input);
  }
}

export default CategoryResolver;
