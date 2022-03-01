import { ApolloError } from 'apollo-server-express';
import argon2 from 'argon2';
import { getCustomRepository, In, Not } from 'typeorm';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import User from '../entity/User';
import {
  LoginInput,
  LoginResult,
  RegisterInput,
  UserInput,
} from '../inputTypes/UserTypes';
import RoleRepository from '../repository/roleRepository';
import UserRepository from '../repository/userRepository';
import Role from '../entity/Role';
import { transporter } from '../../utils/email';

const ADMIN = 'admin';
const SUB_ADMIN = 'sub_admin';
const PROJECT = 'projects_only';

class UserService {
  constructor(
    private userRepository: UserRepository = getCustomRepository(
      UserRepository
    ),
    private roleRepository: RoleRepository = getCustomRepository(RoleRepository)
  ) {}

  public register = async (input: RegisterInput, id: string): Promise<User> => {
    await this.isUserAuthorized(id);
    await this.isRegistered(input.email);
    if (input.password !== input.confirmPassword) {
      throw new ApolloError('Las contraseñas no coinciden.', '409');
    }
    const role = await this.roleRepository.findOne({ id: input.role });
    const hashedPassword = await argon2.hash(input.password);
    const user = await this.userRepository.createAndSave(input, hashedPassword, role);
    user.role = role;
    return user;
  };

  public login = async (input: LoginInput): Promise<LoginResult> => {
    const user: User = await this.userExistsEmail(input.email);
    const doMatch = await argon2.verify(user.password, input.password);
    if (!doMatch) {
      throw new ApolloError(
        'El usuario o contraseña ingresado es invalido',
        '401'
      );
    }
    const jwtKey = process.env.JWT_KEY || 'asdasd21312dasdasdas123';
    const token = jwt.sign({ userId: user.id, email: user.email }, jwtKey, {
      expiresIn: '2h',
    });

    return { jwt: token, userId: user.id };
  };

  public getUser = async (id: string): Promise<User> => {
    return this.userExistsId(id);
  };

  public getUsers = async (id: string): Promise<User[]> => {
    const userRole = await this.isUserAuthorized(id);
    if (userRole === ADMIN) {
      return this.userRepository.find({
        where: { id: Not(id), role: { id: Not(1) } },
        relations: ['role'],
      });
    }
    return this.userRepository.find({
      where: { id: Not(id), role: { id: Not(In([1, 3])) } },
      relations: ['role'],
    });
  };

  public deleteUser = async (
    userId: string,
    adminId: string
  ): Promise<string> => {
    await this.isUserAuthorized(adminId);
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new ApolloError('El usuario que intenta borrar no existe', '404');
    }
    await this.userRepository.delete(user.id);
    return userId;
  };

  public deleteUsers = async (
    usersIds: string[],
    adminId: string
  ): Promise<string[]> => {
    await this.isUserAuthorized(adminId);
    const users = await this.userRepository.find({ id: In(usersIds) });
    if (!users.length) {
      throw new ApolloError(
        'Los usuarios que intenta borrar no existen',
        '404'
      );
    }
    await this.userRepository.delete(usersIds);
    return usersIds;
  };

  public changePasswordByAdmin = async (
    userId: string,
    adminId: string,
    password: string
  ): Promise<boolean> => {
    await this.isUserAuthorized(adminId);
    const user = await this.userExistsId(userId);
    const hashedPassword = await argon2.hash(password);
    user.password = hashedPassword;
    const updated = await this.userRepository.save(user);
    return updated.password === hashedPassword;
  };

  public changePasswordByUser = async (
    id: string,
    password: string
  ): Promise<boolean> => {
    const user = await this.userExistsId(id);
    const hashedPassword = await argon2.hash(password);
    user.password = hashedPassword;
    const updated = await this.userRepository.save(user);
    return updated.password === hashedPassword;
  };

  public changeUserRole = async (
    userId: string,
    adminId: string
  ): Promise<User> => {
    await this.isUserAdmin(adminId);
    const user = await this.userExistsId(userId);
    const newRole: Role = await this.roleRepository.findOneByDescription(
      user.role.description === SUB_ADMIN ? PROJECT : SUB_ADMIN
    );
    user.role = newRole;
    return this.userRepository.save(user);
  };

  public updateUserByUser = async (
    id: string,
    input: UserInput
  ): Promise<User> => {
    const user = await this.userExistsId(id);
    user.email = input.email;
    user.name = input.name;
    user.lastname = input.lastname;
    if (user.role.id !== input.role) {
      const newRole = await this.roleRepository.findOne({ id: input.role });
      user.role = newRole;
    }
    return this.userRepository.save(user);
  };

  public updateUserByAdmin = async (
    id: string,
    adminId: string,
    input: UserInput
  ): Promise<User> => {
    const user = await this.userExistsId(id);
    await this.isUserAuthorized(adminId);
    user.email = input.email;
    user.name = input.name;
    user.lastname = input.lastname;
    if (user.role.id !== input.role) {
      const newRole = await this.roleRepository.findOne({ id: input.role });
      user.role = newRole;
    }
    return this.userRepository.save(user);
  };

  public getRoles = async (id: string): Promise<Role[]> => {
    const userRole = await this.isUserAuthorized(id);
    return this.roleRepository.find({
      where: { description: Not(In([ADMIN, userRole])) },
    });
  };

  public setRetrieveTokenAndEmail = async (email: string): Promise<boolean> => {
    const user = await this.userExistsEmail(email);
    const token = v4();
    user.retrieveKey = token;
    await this.userRepository.save(user);
    try {
      const result = await transporter.sendMail({
        to: `${user.email}`,
        subject: 'Recuperación de usuario',
        html: `
        <html lang="es-AR">
          <head>
            <style>
              div {
                background-color: rgb(32, 32, 32); 
                min-height: 300px; 
                width: 100%; 
                display: flex;
                flex-direction: column; 
                justify-content: center; 
                align-items: center;
              }

              section {
                background-color: rgb(21, 21, 21);
                width: 100%; 
                padding: 2rem 6rem;
              }

              section:first-child {
                border-bottom: 1px solid #E6E6E6
              }

              h3{
                color: #E6E6E6;
                font-size: 1.2rem;
                font-family: sans-serif;
              }
              p {
                color: #E6E6E6;
                font-size: 1.2rem;
                font-family: sans-serif;
              }
            </style>
          </head>
          <body>
            <div>
              <section>
                <h3>Hola ${user.name} ${user.lastname}</h3>
                <hr/>
                <p>Para cambiar tu contraseña, haz click en el siguiente link.</p>
                <span><a href="http://abacoarquitectos.com.ar/admin/change-password/${token}">Cambiar contraseña</a></span>
              </section>
            </div>
          </body>
        </html>
        `,
      });

      return true;
    } catch (error) {
      throw new ApolloError('Algo no funciono');
    }
  };

  public changePassword = async (
    token: string,
    password: string
  ): Promise<boolean> => {
    const user = await this.userRepository.findOne({ retrieveKey: token });
    if (!user) {
      throw new ApolloError('Token invalido', '404');
    }
    const hashedPassword = await argon2.hash(password);
    user.password = hashedPassword;
    user.retrieveKey = null;
    const updated = await this.userRepository.save(user);
    return updated.password === hashedPassword;
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

  private isUserAdmin = async (id: string) => {
    const user: User = await this.userExistsId(id);
    if (user.role.description !== ADMIN) {
      throw new ApolloError('No autorizado', '401');
    }
  };

  private userExistsId = async (id: string): Promise<User> => {
    const user: User = await this.userRepository.findOneWithRole(id);
    if (!user) {
      throw new ApolloError('El usuario no existe', '404');
    }
    return user;
  };

  private userExistsEmail = async (email: string): Promise<User> => {
    const user: User = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new ApolloError('El usuario no existe', '404');
    }
    return user;
  };

  private isRegistered = async (email: string) => {
    const user: User = await this.userRepository.findOneByEmail(email);
    if (user) {
      throw new ApolloError('El email ingresado ya esta en uso', '409');
    }
  };
}

export default UserService;
