import { ApolloError } from 'apollo-server-errors';
import { getCustomRepository, getRepository, Repository } from 'typeorm';
import { transporter } from '../../utils/email';
import ContactData from '../entity/ContactData';
import User from '../entity/User';
import { ContactInput } from '../inputTypes/ContactTypes';
import UserRepository from '../repository/userRepository';

const ADMIN = 'admin';
const SUB_ADMIN = 'sub_admin';

class ContactService {
  constructor(
    private contactRepository: Repository<ContactData> = getRepository(
      ContactData
    ),
    private userRepository: UserRepository = getCustomRepository(UserRepository)
  ) {}

  public sendEmail = async (input: ContactInput) => {
    try {
      const result = await transporter.sendMail({
        from: `"Contacto recibido: ${input.name}" <no-reply@abacoarquitectos.com.ar>`,
        to: 'contacto.abacosrl@gmail.com',
        subject: `Nuevo contacto recibido - Razón: ${input.issue}`,
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
              h4{
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
                <h4>Una persona se ha contactado con ustedes</h4>
                <h4>Nombre: ${input.name}</h4>
                <h4>Email: ${input.email} </h4>
                <h4>Asunto: ${input.issue} </h4>
                <h4>Consulta: </h4>
                <p>${input.content}</p>
              </section>
            </div>
          </body>
        </html>
        `,
      });

      return true;
    } catch (error) {
      throw new ApolloError('Ha ocurrido un problema');
    }
  };

  public getContactData = async () => {
    return (await this.contactRepository.find()).reverse();
  };

  public updateData = async (userId: string, id: string, value: string) => {
    await this.isUserAuthorized(userId);
    const contactData = await this.contactRepository.findOne(id);
    if (!contactData) {
      throw new ApolloError(
        'El dato de contacto que quiere actualizar, no existe',
        '404'
      );
    }
    contactData.value = value;
    return this.contactRepository.save(contactData);
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

export default ContactService;
