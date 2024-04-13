import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from "typeorm";
import { AuthUser } from "../entities/auth-user.entity";

@Injectable()
export class AuthUserDataService {
  authUserRepo: Repository<AuthUser>

  constructor(dataSource: DataSource) {
    this.authUserRepo = dataSource.getRepository(AuthUser);
  }

  async getAuthUsers() {
    return this.authUserRepo.find();
  }

  async getAuthUserByUUID(uuid: string) {
    return this.authUserRepo.findOne({
      where: {
        uuid: uuid
      }
    })
  }

  async getAuthUserByLogin(login: string): Promise<AuthUser> | null {
    return this.authUserRepo.findOne({
      where: {
        login: login
      },
      relations: {
        user: true
      }
    })
  }
}
