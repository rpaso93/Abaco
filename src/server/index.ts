import 'reflect-metadata';
import next from 'next';
import express, { Request, Response } from 'express';
import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection, ConnectionOptions } from 'typeorm';
import ProjectResolver from './resolver/project';
import CategoryResolver from './resolver/category';
import { graphqlUploadExpress } from 'graphql-upload';
import UserResolver from './resolver/user';
import { MyContext } from './types';
import SectionResolver from './resolver/section';
import ContactResolver from './resolver/contact';
import Category from './entity/Category';
import Project from './entity/Project';
import User from './entity/User';
import DBImage from './entity/Image';
import Role from './entity/Role';
import Section from './entity/Section';
import ContactData from './entity/ContactData';
import ProjectService from './services/projectService';
import isAuth from './middleware/auth';
import { uploadMiddleware } from '../utils/multer';

const PORT = process.env.PORT || 3000;
const dev: boolean = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const main = async () => {
  const _conn = await createConnection({
    type: 'mariadb',
    database: process.env.DB || 'test',
    username: process.env.DB_USER || 'test',
    password: process.env.DB_PASS || '1234567%',
    synchronize: true,
    logging: true,
    entities: [User, Project, DBImage, Category, Role, Section, ContactData],
  } as ConnectionOptions);

  await app.prepare();
  const server = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        ProjectResolver,
        CategoryResolver,
        UserResolver,
        SectionResolver,
        ContactResolver,
      ],
      validate: false,
    }),
    uploads: false,
    context: ({ req, res }): MyContext => ({ req, res }),
  } as any);

  server.post(
    '/project/:id/file',
    uploadMiddleware.array('images', 20),
    (req: Request, res: Response) => {
      const projectService = new ProjectService();
      return projectService.addImages(req, res);
    }
  );

  apolloServer.applyMiddleware({ app: server });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
};

main().catch((err) => console.error(err));
