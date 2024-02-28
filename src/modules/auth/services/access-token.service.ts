import {Global, Injectable} from '@nestjs/common';
import * as jwt from "jsonwebtoken";
import {JWT} from "../jwt";
@Injectable()
export class AccessTokenService {
  generate(payload: any) {
    return jwt.sign(payload, process.env.ACCESS, {algorithm: "HS512", expiresIn: "2d"});
  }

  decode(token: string) {
    return jwt.verify(token, process.env.ACCESS);
  }

  verify(token: string) {
    try {
      jwt.verify(token, process.env.ACCESS);
    } catch {
      return false;
    }
    return true;
  }

  getTokenFromHeader(req: Request): JWT {
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    return this.decode(accessToken) as JWT;
  }


}
