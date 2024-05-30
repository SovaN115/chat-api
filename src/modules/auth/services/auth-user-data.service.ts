import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from "typeorm";
import { AuthUser } from "../entities/auth-user.entity";
import { User } from "../entities/user.entity";

@Injectable()
export class AuthUserDataService {
  authUserRepo: Repository<AuthUser>;
  userRepo: Repository<User>;

  constructor(dataSource: DataSource) {
    this.authUserRepo = dataSource.getRepository(AuthUser);
    this.userRepo = dataSource.getRepository(User);
  }

  async getAuthUsers() {
    return this.authUserRepo.find();
  }

  async getAuthUserByUUID(uuid: string) {
    return await this.authUserRepo.findOne({
      where: {
        uuid: uuid
      }
    })
  }

  async getAuthUserByLogin(login: string): Promise<AuthUser> | null {
    return await this.authUserRepo.findOne({
      where: {
        login: login
      },
      relations: {
        user: true,
        roles: true
      }
    })
  }

  async deleteAuthUserByUUID(uuid: string): Promise<any> | null {
    const user = await this.userRepo.findOne({
      where: {
        uuid: uuid
      },
      relations: {
        authUser: true
      }
    });
    console.log(uuid)

    await this.authUserRepo.update(
      {
        uuid: user.authUser.uuid
      },
      {
        isDeleted: true
      }
    );

    await this.userRepo.update(
      {
        uuid: uuid
      },
      {
        isDeleted: true
      }
    )
  }
}
