import { GraphQLUpload, FileUpload } from 'graphql-upload';
import {
  Arg,
  Field,
  ID,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import Project from '../entity/Project';
import { ProjectInput } from '../inputTypes/ProjectTypes';
import isAuth from '../middleware/auth';
import ProjectService from '../services/projectService';

@ObjectType()
class PaginatedProjects {
  @Field(() => [Project])
  projects: Project[];
  @Field()
  hasMore: boolean;
}

@Resolver()
class ProjectResolver {
  constructor(private projectService: ProjectService = new ProjectService()) {}
  
  @Query(() => [Project])
  async projects(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Query(() => [Project])
  async latestProjects(): Promise<Project[]> {
    return this.projectService.findLatest();
  }

  @Query(() => PaginatedProjects)
  async projectsByCat(
    @Arg('category') category: 'Desarrollo' | 'Arquitectura' | 'Construcción',
    @Arg('limit', () => Int, { nullable: true }) limit: number | null,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Arg('filter', () => [String], { nullable: true }) filter: string[] | null
  ): Promise<PaginatedProjects> {
    return this.projectService.findAllByCategory(category, limit, cursor, filter);
  }

  @Query(() => Project)
  async project(@Arg('id', () => ID) id: string): Promise<Project> {
    return this.projectService.findById(id);
  }

  @Mutation(() => Project)
  @UseMiddleware(isAuth)
  async createProject(@Arg('input') input: ProjectInput): Promise<Project> {
    return this.projectService.createProject(input);
  }

  @Mutation(() => Project)
  @UseMiddleware(isAuth)
  async setPortraitToProject(
    @Arg('id', () => ID) id: string,
    @Arg('projectId', () => ID) projectId: string
  ): Promise<Project> {
    return this.projectService.setPortraitToProject(id, projectId);
  }

  @Mutation(() => ID)
  @UseMiddleware(isAuth)
  async removeImageFromProject(
    @Arg('id', () => ID) id: string
  ): Promise<string> {
    return this.projectService.removeImage(id);
  }

  @Mutation(() => [ID])
  @UseMiddleware(isAuth)
  async removeImagesFromProject(
    @Arg('ids', () => [ID]) ids: string[]
  ): Promise<string[]> {
    return this.projectService.removeImages(ids);
  }

  @Mutation(() => Project)
  @UseMiddleware(isAuth)
  async updateProject(
    @Arg('id', () => ID) id: string,
    @Arg('input') input: ProjectInput
  ): Promise<Project> {
    return this.projectService.updateProject(id, input);
  }

  @Mutation(() => ID)
  @UseMiddleware(isAuth)
  async deleteProject(@Arg('id', () => ID) id: string): Promise<string> {
    return this.projectService.deleteProject(id);
  }

  @Mutation(() => [ID])
  @UseMiddleware(isAuth)
  async deleteProjects(
    @Arg('ids', () => [ID]) ids: string[]
  ): Promise<string[]> {
    return this.projectService.deleteProjects(ids);
  }
}

export default ProjectResolver;
