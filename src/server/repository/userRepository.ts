import { EntityRepository, Not, Repository } from 'typeorm';
import Role from '../entity/Role';
import User from '../entity/User';
import { RegisterInput } from '../inputTypes/UserTypes';

const ROLE = 'role';

@EntityRepository(User)
class UserRepository extends Repository<User> {
  createAndSave(input: RegisterInput, password: string, role: Role): Promise<User>{
    const user: User = this.create({...input, password, role});
    return this.save(user);
  }
  
  findOneWithRole(id: string): Promise<User>{
    return this.findOne({ where: { id }, relations: [ROLE] });
  }

  findOneByEmail(email: string): Promise<User>{
    return this.findOne({email});
  }

  findAllWithRole(id: string, role: number): Promise<User[]>{
    return this.find({ where: { id: Not(id), role}, relations: [ROLE]});
  }
}

export default UserRepository;