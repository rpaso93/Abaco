import { EntityRepository, Repository } from 'typeorm';
import Category from '../entity/Category';
import Project from '../entity/Project';
import { ProjectInput } from '../inputTypes/ProjectTypes';

@EntityRepository(Project)
class ProjectRepository extends Repository<Project> {
  createAndSave(input: ProjectInput, categories: Category[]): Promise<Project> {
    const year = input.year
      .toString()
      .substr(0, input.year.toString().indexOf('T')) as any;
    const project: Project = this.create({ ...input, year: year, categories });
    return this.save(project);
  }

  findAllWithCatAndImg(): Promise<Project[]> {
    return this.find({
      relations: ['categories', 'images'],
      order: { year: 'DESC' },
    });
  }

  findOneWithCatAndImg(id: string): Promise<Project> {
    return this.findOne({ where: { id }, relations: ['categories', 'images'] });
  }

  findByCategory(ids: string[], cursor: string | null, limit: number | null) {
    const qb = this.createQueryBuilder('project')
      .distinct(true)
      .innerJoin('project.categories', 'category', 'category.id In (:...ids)', {
        ids,
      })
      .innerJoinAndSelect('project.categories', 'cat')
      .innerJoinAndSelect('project.images', 'image')
      .orderBy('project.year', 'DESC');
    if (limit) {
      qb.take(limit);
    }
    if (cursor) {
      qb.where('project.year < :cursor', { cursor: new Date(cursor) });
    }

    return qb.getMany();
  }
}

export default ProjectRepository;
