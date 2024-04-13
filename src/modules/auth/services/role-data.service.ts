import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { RoleEnum } from '../enums/role.enum';

@Injectable()
export class RoleDataService {
  private readonly roleRepo: Repository<Role>;
  constructor(
    entityManager: EntityManager
  ) {
    this.roleRepo = entityManager.getRepository(Role);
  }

  async getRoleByRoleName(role: RoleEnum | RoleEnum[]) {
    if(Array.isArray(role)) {
      const roleInput = role.map(item => ({role: item}));
      return await this.roleRepo.find({
        where: roleInput
      })
    } else {
      return await this.roleRepo.find({
        where: {
          role: role
        }
      })
    }
  }
}
