import { Injectable } from '@nestjs/common';
import * as jwt from "jsonwebtoken";
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


}
