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

  async createTokenOnAuthUser(authUser: AuthUser, os: string, browser: string) {
    const newToken: Token = new Token();
    newToken.authUser = authUser;
    newToken.os = os;
    newToken.browser = browser;
    return await this.tokenRepo.save(newToken);
  }

  async getTokenByTokenUUID(tokenUUID: string) {
    return await this.tokenRepo.findOne({
      where: {
        uuid: tokenUUID
      }
    })
  }

  async getTokensByAuthUserUUID(authUserUUID: string, token: string) {
    const data = await this.tokenRepo.find({
      where: {
        authUser: {
          uuid: authUserUUID
        },
      }
    })

    const result = data.map(token => {
      return {
        uuid: token.uuid,
        os: token.os,
        browser: token.browser,
        updatedAt: token.updatedAt
      }
    })

    return result;
  }

  async deleteTokenByTokenUUID(tokenUUID: string) {
    return await this.tokenRepo.delete({
      uuid: tokenUUID
    })
  }
}
