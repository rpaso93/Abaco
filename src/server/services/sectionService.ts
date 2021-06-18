import { ApolloError } from 'apollo-server-express';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { stat, mkdir, rm } from 'fs/promises';
import sharp from 'sharp';
import { getCustomRepository, getRepository, Repository } from 'typeorm';
import Section from '../entity/Section';
import User from '../entity/User';
import UserRepository from '../repository/userRepository';

const ADMIN = 'admin';
const SUB_ADMIN = 'sub_admin';

class SectionService {
  constructor(
    private sectionRepository: Repository<Section> = getRepository(Section),
    private userRepository: UserRepository = getCustomRepository(UserRepository)
  ) {}

  public getSectionById = async (id: string) => {
    return this.sectionRepository.findOne(id);
  };

  public getSections = async () => {
    return this.sectionRepository.find();
  };

  public updateSection = async (
    userId: string,
    id: string,
    file: FileUpload | null,
    contenido: string
  ) => {
    await this.isUserAuthorized(userId);
    const section = await this.sectionRepository.findOne(id);
    if (!section) {
      throw new ApolloError(
        'La seccion que quiere actualizar, no existe',
        '404'
      );
    }
    section.contenido = contenido;

    const sectionPath = __dirname + '/../../../public/' + id;

    if (typeof file !== 'undefined' && file !== null) {
      try {
        await deleteFileIfExists(sectionPath);
        await mkdir(sectionPath);
        return await this.addImage(file, sectionPath, section);
      } catch (err) {
        if (err.code === 'ENOENT') {
          await mkdir(sectionPath);
          return await this.addImage(file, sectionPath, section);
        }
      }
    } else {
      return this.sectionRepository.save(section);
    }
  };

  private addImage = async (
    file: FileUpload,
    sectionPath: string,
    section: Section
  ) => {
    await new Promise(async (resolve, reject) => {
      const { createReadStream, filename } = await file;
      const stream = createReadStream();

      const dotIndex = filename.indexOf('.', filename.length - 6);
      const newfilename = filename.substring(0, dotIndex);

      const filePath = `${sectionPath}/${filename}`;
      const writableStream = createWriteStream(filePath, { autoClose: true });

      await new Promise((resolve, reject) =>
        stream
          .pipe(writableStream)
          .on('finish', async () => {
            section.img = '/' + section.id + '/' + newfilename;
            const sharpStream = sharp(filePath);
            const promises = [];

            promises.push(
              sharpStream
                .clone()
                .resize({ width: 1500 })
                .webp({ quality: 100 })
                .withMetadata()
                .toFile(`${sectionPath}/${newfilename}.webp`)
            );

            promises.push(
              sharpStream
                .clone()
                .resize({ width: 1200 })
                .webp({ quality: 100 })
                .withMetadata()
                .toFile(`${sectionPath}/${newfilename}-w1200.webp`)
            );

            promises.push(
              sharpStream
                .clone()
                .resize({ width: 900 })
                .webp({ quality: 100 })
                .withMetadata()
                .toFile(`${sectionPath}/${newfilename}-w900.webp`)
            );

            promises.push(
              sharpStream
                .clone()
                .resize({ width: 600 })
                .webp({ quality: 100 })
                .withMetadata()
                .toFile(`${sectionPath}/${newfilename}-w600.webp`)
            );

            promises.push(
              sharpStream
                .clone()
                .resize({ width: 300 })
                .webp({ quality: 100 })
                .withMetadata()
                .toFile(`${sectionPath}/${newfilename}-w300.webp`)
            );

            await Promise.all(promises)
              .then(res => {
                
              })
              .catch(err => {
                console.error(err);
              });
            await deleteFileIfExists(filePath);
            resolve(true);
          })
          .on('error', error => reject(error))
      );
      resolve(true);
    });
    return this.sectionRepository.save(section);
  };

  private isUserAuthorized = async (id: string) => {
    const user: User = await this.userExistsId(id);
    if (
      user.role.description !== ADMIN &&
      user.role.description !== SUB_ADMIN
    ) {
      throw new ApolloError('No autorizado', '401');
    }
    return user.role.description;
  };

  private userExistsId = async (id: string): Promise<User> => {
    const user: User = await this.userRepository.findOneWithRole(id);
    if (!user) {
      throw new ApolloError('El usuario no existe', '404');
    }
    return user;
  };
}

const deleteFileIfExists = async (path: string) => {
  await stat(path);
  await rm(path, { recursive: true, force: true });
};

export default SectionService;
