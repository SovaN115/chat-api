import { Injectable } from '@nestjs/common';
import * as jwt from "jsonwebtoken";
import { TokenDataService } from "./token-data.service";
import { JwtPayload } from "jsonwebtoken";
import { JWT } from '../jwt';

@Injectable()
export class RefreshTokenService {

  constructor(
    private tokenDataService: TokenDataService
  ) {
  }
  generate(payload: JWT) {
    return jwt.sign(payload, process.env.REFRESH, {algorithm: "HS512", expiresIn: "30d"});
  }

  decode(token: string) {
    return jwt.verify(token, process.env.REFRESH);
  }

  async verify(token: string) {
    try {
      const refreshTokenPayload = jwt.verify(token, process.env.REFRESH) as JwtPayload
      const refreshToken = await this.tokenDataService.getTokenByAuthUserUUID(refreshTokenPayload.uuid, token);
      if(!refreshToken) {
        return false;
      }
    } catch {
      return false;
    }
    return true;
  }
}
