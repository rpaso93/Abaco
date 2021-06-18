import { ApolloError } from 'apollo-server-errors';
import { createWriteStream } from 'fs';
import { stat, mkdir, rm } from 'fs/promises';
import { FileUpload } from 'graphql-upload';
import {
  Brackets,
  getCustomRepository,
  getTreeRepository,
  In,
  TreeRepository,
} from 'typeorm';
import Image from '../entity/Image';
import Project from '../entity/Project';
import { ProjectInput } from '../inputTypes/ProjectTypes';
import ImageRepository from '../repository/imageRepository';
import ProjectRepository from '../repository/projectRepository';
import sharp from 'sharp';
import Category from '../entity/Category';

class ProjectService {
  constructor(
    private projectRepository: ProjectRepository = getCustomRepository(
      ProjectRepository
    ),
    private categoryRepository: TreeRepository<Category> = getTreeRepository(
      Category
    ),
    private imageRepository: ImageRepository = getCustomRepository(
      ImageRepository
    )
  ) {}

  public findAll = async () => {
    return this.projectRepository.findAllWithCatAndImg();
  };

  public findById = async (id: string) => {
    const project = await this.projectRepository.findOneWithCatAndImg(id);
    if (!project) {
      throw new ApolloError('El proyecto no existe', '404');
    }
    return project;
  };

  public findLatest = async () => {
    const projects = await this.projectRepository.find({
      relations: ['categories', 'images'],
      order: { year: 'DESC' },
      take: 9,
    });
    const category = await this.categoryRepository.findOne({
      where: { name: 'Desarrollo' },
    });
    const categories = await this.categoryRepository.findDescendants(category);

    return projects.filter(project =>
      project.categories.some(cat =>
        categories.some(subCat => subCat.id === cat.id)
      )
    );
  };

  public findAllByCategory = async (
    _category: 'Desarrollo' | 'Arquitectura' | 'Construcción',
    limit: number | null,
    cursor: string | null,
    filter: string[] | null
  ) => {
    const category = await this.categoryRepository.findOne({
      where: { name: _category },
    });
    const realLimit = limit ? Math.min(50, limit) + 1 : null;

    if (_category !== 'Desarrollo') {
      const projects = await this.projectRepository.findByCategory(
        [category.id],
        cursor,
        realLimit
      );
      projects.forEach(project => (project.mainCategory = category.name));
      return {
        projects: projects.slice(
          0,
          realLimit ? realLimit - 1 : projects.length
        ),
        hasMore: projects.length === realLimit,
      };
    }
    const categories = await this.categoryRepository.findDescendants(category);
    const ids = filter?.length > 0 ? categories.filter(cat => filter.includes(cat.id)).map(cat => cat.id) : categories.map(cat => cat.id);

    const projects = await this.projectRepository.findByCategory(
      ids,
      cursor,
      realLimit
    );
    projects.forEach(project => (project.mainCategory = category.name));
    return {
      projects: projects.slice(0, realLimit ? realLimit - 1 : projects.length),
      hasMore: projects.length === realLimit,
    };
  };

  public createProject = async (input: ProjectInput) => {
    const categories = await this.categoryRepository.findByIds(
      input.categories
    );
    return this.projectRepository.createAndSave(input, categories);
  };

  public updateProject = async (id: string, input: ProjectInput) => {
    const project = await this.projectRepository.findOneWithCatAndImg(id);
    if (!project) {
      throw new ApolloError('El proyecto que desea editar no existe', '404');
    }
    project.name = input.name;
    project.description = input.description;
    project.year = input.year
      .toString()
      .substr(0, input.year.toString().indexOf('T')) as any;
    project.surface = input.surface;
    project.location = input.location;
    const categories = await this.categoryRepository.findByIds(
      input.categories
    );
    project.categories = categories;

    const updatedProject = await this.projectRepository.save(project);
    updatedProject.year = updatedProject.year;
    return updatedProject;
  };

  public deleteProject = async (id: string): Promise<string> => {
    const project = await this.projectRepository.findOne(id);
    if (!project) {
      throw new ApolloError('El proyecto que desea borrar no existe', '404');
    }
    const images = await this.imageRepository.find({ project: { id } });

    await this.deleteImages(images);

    const result = await this.projectRepository.delete({ id: project.id });
    if (result.affected > 0) {
      return id;
    } else {
      throw new ApolloError('No fue posible borrar el proyecto');
    }
  };

  public deleteProjects = async (ids: string[]): Promise<string[]> => {
    const projects = await this.projectRepository.find({ id: In(ids) });
    if (!projects.length) {
      throw new ApolloError('Proyectos no encontrados', '404');
    }
    const images = await this.imageRepository.find({
      project: { id: In(ids) },
    });

    await this.deleteImages(images);

    const result = await this.projectRepository.delete(ids);
    if (result.affected > 0) {
      return ids;
    } else {
      throw new ApolloError('No fue posible borrar el proyecto');
    }
  };

  public addImages = async (id: string, files: FileUpload[]) => {
    const project = await this.projectRepository.findOne(id);
    if (!project) {
      throw new ApolloError(
        'El proyecto al que quiere asociar las imagenes, no existe',
        '404'
      );
    }
    const images: Image[] = await this.imageRepository.find({
      project: { id: id },
    });
    const projectPath = `${__dirname}/../../../public/${project.name}`;

    try {
      await stat(projectPath);
      return await this.writeImages(files, projectPath, project, images);
    } catch (err) {
      if (err.code === 'ENOENT') {
        await mkdir(projectPath);
        return await this.writeImages(files, projectPath, project, images);
      }
    }
  };

  public setPortraitToProject = async (id: string, projectId: string) => {
    const project = await this.projectRepository.findOneWithCatAndImg(
      projectId
    );
    const image = await this.imageRepository.findOne(id);
    if (!image) {
      throw new ApolloError(
        'La imagen que quiere asignar como portada no existe',
        '404'
      );
    }
    project.portraitId = id;
    return this.projectRepository.save(project);
  };

  public removeImage = async (id: string) => {
    const image = await this.imageRepository.findOne(id);
    if (!image) {
      throw new ApolloError('La imagen que quiere eliminar no existe', '404');
    }
    const path = __dirname + `/../../../public${image.path}`;
    await deleteFileIfExists(path);
    const result = await this.imageRepository.delete(image.id);
    if (result.affected) {
      return id;
    }
    throw new ApolloError('La imagen no pudo ser eliminida');
  };

  public removeImages = async (ids: string[]) => {
    const images = await this.imageRepository.find({ id: In(ids) });
    if (images.length === 0) {
      throw new ApolloError(
        'Las imagenes que quiere eliminar no existen',
        '404'
      );
    }
    await this.deleteImages(images);
    const result = await this.imageRepository.delete(ids);
    if (result.affected) {
      return ids;
    }
    throw new ApolloError('Las imagenes no pudieron ser eliminidas');
  };

  private deleteImages = async (images: Image[]) => {
    images.forEach(async img => {
      const path = __dirname + `/../../../public${img.path}`;
      await deleteFileIfExists(path);
    });
  };

  private writeImages = async (
    files: FileUpload[],
    projectPath: string,
    project: Project,
    images: Image[]
  ) => {
    await Promise.all(
      files.map(async file => {
        const { createReadStream, filename } = await file;
        const stream = createReadStream();
        const filepath = `${projectPath}/${filename}`;
        const dotIndex = filename.indexOf('.', filename.length - 6);
        const newfilename = filename.substring(0, dotIndex);

        const path = `/${project.name}/${newfilename}`;
        const writableStream = createWriteStream(filepath, { autoClose: true });

        return new Promise((resolve, reject) =>
          stream
            .pipe(writableStream)
            .on('finish', async () => {
              const image = await this.imageRepository.createAndSave(
                path,
                newfilename
              );
              images.push(image);
              const sharpStream = sharp(filepath);
              const promises = [];

              const dotIndex = filepath.indexOf('.', filepath.length - 6);
              const newFilepath = filepath.substring(0, dotIndex);

              await mkdir(newFilepath);

              promises.push(
                sharpStream
                  .clone()
                  .rotate()
                  .resize({ height: 844, withoutEnlargement: true })
                  .webp({ quality: 100 })
                  .withMetadata()
                  .toFile(`${newFilepath}/${newfilename}.webp`)
              );

              promises.push(
                sharpStream
                  .clone()
                  .rotate()
                  .resize({ height: 675, withoutEnlargement: true })
                  .webp({ quality: 100 })
                  .withMetadata()
                  .toFile(`${newFilepath}/${newfilename}-w1200.webp`)
              );

              promises.push(
                sharpStream
                  .clone()
                  .rotate()
                  .resize({ height: 506, withoutEnlargement: true })
                  .webp({ quality: 100 })
                  .withMetadata()
                  .toFile(`${newFilepath}/${newfilename}-w900.webp`)
              );

              promises.push(
                sharpStream
                  .clone()
                  .rotate()
                  .resize({ height: 338, withoutEnlargement: true })
                  .webp({ quality: 100 })
                  .withMetadata()
                  .toFile(`${newFilepath}/${newfilename}-w600.webp`)
              );

              promises.push(
                sharpStream
                  .clone()
                  .rotate()
                  .resize({ height: 169, withoutEnlargement: true })
                  .webp({ quality: 100 })
                  .withMetadata()
                  .toFile(`${newFilepath}/${newfilename}-w300.webp`)
              );

              await Promise.all(promises)
                .then(res => {
                  console.log('Done!', res);
                })
                .catch(err => {
                  console.error(err);
                });
              await deleteFileIfExists(filepath);
              resolve(true);
            })
            .on('error', error => reject(error))
        );
      })
    );

    project.images = images;

    return this.projectRepository.save(project);
  };
}

const deleteFileIfExists = async (path: string) => {
  await stat(path);
  await rm(path, { recursive: true, force: true });
};

export default ProjectService;
