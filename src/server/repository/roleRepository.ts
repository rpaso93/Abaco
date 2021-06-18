import { EntityRepository, Repository } from 'typeorm';
import Role from '../entity/Role';

@EntityRepository(Role)
class RoleRepository extends Repository<Role> {
  findOneByDescription(description: string) {
    return this.findOne({ description });
  }
}

export default RoleRepository;
