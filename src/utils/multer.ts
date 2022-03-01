import multer from 'multer';
import { Request } from 'express';
import ProjectRepository from '../server/repository/projectRepository';
import { stat, mkdir } from 'fs/promises';
import path from 'path';

const storageConfig: multer.DiskStorageOptions = {
  destination: async (req: Request, file: Express.Multer.File, cb) => {
    const { id } = req.params;
    const projectRepository = new ProjectRepository();
    const project = await projectRepository.findOne(id);
    if (!project) {
      cb(new Error('No existe un proyecto con ese id'), null);
    }
    const filename = file.filename.slice(0, file.filename.lastIndexOf('.'));
    const projectPath = `${__dirname}/../../public/${project.name}/${filename}`;
    try {
      await stat(projectPath);
      cb(null, projectPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        await mkdir(projectPath, { recursive: true });
        cb(null, projectPath);
      }
    }
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, file.originalname);
  },
};

const imageOnly = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const fileTypes = /.jpeg|.jpg|.JPG|.png/;
  const mimeType = fileTypes.test(file.mimetype);
  const extname = fileTypes.test(path.extname(file.originalname));
  if (mimeType && extname) {
    return cb(null, true);
  }
  const error = new Error('El archivo debe ser una imagen valida');
  cb(error);
};
const storage = multer.diskStorage(storageConfig);
const options: multer.Options = { storage, fileFilter: imageOnly };
export const uploadMiddleware = multer(options);
