import { ApolloError } from 'apollo-server-errors';
import { getCustomRepository, getTreeRepository, TreeRepository } from 'typeorm';
import Category from '../entity/Category';
import { CategoryInput } from '../inputTypes/CategoryTypes';

class CategoryService {
  constructor(
    private categoryRepository: TreeRepository<Category> = getTreeRepository(Category)
  ) {}

  public getParentCategoriesWithSub = async (): Promise<Category[]> => {
    return this.categoryRepository.findTrees();
  };

  public getCategories = async (): Promise<Category[]> => {
    return this.categoryRepository.find();
  };

  public createCategory = async (input: CategoryInput): Promise<Category> => {
    let parentCategory: Category | null = null;
    if (input.parentId) {
      parentCategory = await this.categoryRepository.findOne({id: input.parentId});
      if (!parentCategory) {
        throw new ApolloError('La categoria padre no existe.', '404');
      }
    }
    const newCategory = this.categoryRepository.create({name: input.name, parentCategory});
    return this.categoryRepository.save(newCategory);
  };
}

export default CategoryService;
