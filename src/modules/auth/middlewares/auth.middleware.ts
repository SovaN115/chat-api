import { ForbiddenException, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response } from "express";
import { AccessTokenService } from "../services/access-token.service";
import { RefreshTokenService } from "../services/refresh-token.service";
import { JwtPayload } from "jsonwebtoken";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private accessTokenService: AccessTokenService,
    private refreshTokenService: RefreshTokenService,
  ) {}
  async use(req: Request, res: Response, next: () => void) {
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    console.log('access', accessToken);
    console.log(this.accessTokenService.verify(accessToken));
    console.log(`Подходит ли accessToken ${this.accessTokenService.verify(accessToken)}`)
    if(!this.accessTokenService.verify(accessToken)) {
      // const refreshToken = req.cookies["jwt"];
      // console.log("refresh", refreshToken);
      throw new ForbiddenException();
      // const valid = await this.refreshTokenService.verify(refreshToken)
      // if(!valid) {
      //   throw new UnauthorizedException();
      // }
      // const userUUID: string = (this.refreshTokenService.decode(refreshToken) as JwtPayload).uuid;
      // const newAccessToken = this.accessTokenService.generate({
      //   uuid: userUUID
      // });

    }
    next();
  }
}
