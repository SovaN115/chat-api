import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from "typeorm";
import { Token } from "../entities/token.entity";
import { AuthUser } from "../entities/auth-user.entity";

@Injectable()
export class TokenDataService {
  tokenRepo: Repository<Token>;
  constructor(dataSource: DataSource) {
    this.tokenRepo = dataSource.getRepository(Token);
  }

  async createTokenOnAuthUser(authUser: AuthUser, token: string) {
    const newToken: Token = new Token();
    newToken.token = token;
    newToken.authUser = authUser;
    return await this.tokenRepo.save(newToken);
  }

  async getTokenByAuthUserUUID(authUserUUID: string, token: string) {
    return await this.tokenRepo.findOne({
      where: {
        authUser: {
          uuid: authUserUUID
        },
         token: token
      }
    })
  }

  async deleteTokenByAuthUserUUID(authUserUUID: string) {
    return await this.tokenRepo.delete({
      uuid: authUserUUID
    })
  }
}
