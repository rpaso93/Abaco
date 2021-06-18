import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { Arg, Mutation, Query, Resolver, UseMiddleware, ID, Ctx } from 'type-graphql';
import Section from '../entity/Section';
import isAuth from '../middleware/auth';
import SectionService from '../services/sectionService';
import { MyContext } from '../types';

@Resolver()
class SectionResolver {
  constructor(private sectionService: SectionService = new SectionService()){}

  @Query(() => Section)
  async section(@Arg('id', () => ID) id: string): Promise<Section> {
    return this.sectionService.getSectionById(id);
  }

  @Query(()=> [Section])
  async sections(): Promise<Section[]> {
    return this.sectionService.getSections();
  }

  @Mutation(() => Section)
  @UseMiddleware(isAuth)
  async updateSection(
    @Arg('id', () => ID) id: string, 
    @Arg('file', () => GraphQLUpload, {nullable:true}) file: FileUpload,
    @Arg('contenido', {nullable:true}) contenido: string,
    @Ctx() { req }: MyContext) {
    return this.sectionService.updateSection(req.userId ,id, file, contenido);
  }
}

export default SectionResolver;