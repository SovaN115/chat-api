import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthUserDataService } from "./auth-user-data.service";
import { AuthUser } from "../entities/auth-user.entity";
import * as argon2 from "argon2";
import { AuthUserDTO } from "../dto/auth-user.dto";
import { TokenDataService } from "./token-data.service";
import { RefreshTokenService } from "./refresh-token.service";
import { AccessTokenService } from "./access-token.service";
import { JwtPayload } from "jsonwebtoken";

@Injectable()
export class AuthService {

  constructor(
    private readonly authUserDataService: AuthUserDataService,
    private readonly tokenDataService: TokenDataService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async signUp(login: string, password: string) {
    const potentialUser: AuthUser | null = await this.authUserDataService.getAuthUserByLogin(login);

    if(potentialUser) {
      throw new Error("Пользователь уже существует");
    }

    const newAuthUser = new AuthUser();
    newAuthUser.login = login;
    newAuthUser.password = await argon2.hash(password);
    return await this.authUserDataService.authUserRepo.save(newAuthUser);
  }
  async signIn(login: string, password: string) {
    const authUser: AuthUser | null = await this.authUserDataService.getAuthUserByLogin(login);

    if(!authUser) {
      throw new BadRequestException("Пользователя с таким логином не существует");
    }

    console.log(authUser.password)
    console.log(typeof authUser.password)
    const valid: boolean = await argon2.verify(authUser.password, password);

    if(!valid) {
      throw new UnauthorizedException();
    }

    return authUser;
  }

  async logOut(authUserUUID: string) {
    await this.tokenDataService.deleteTokenByAuthUserUUID(authUserUUID);
  }

  async refresh(refreshToken: string) {
    const valid = await this.refreshTokenService.verify(refreshToken)
    if(!valid) {
      throw new UnauthorizedException();
    }
    const userUUID: string = (this.refreshTokenService.decode(refreshToken) as JwtPayload).uuid;
    return this.accessTokenService.generate({
      uuid: userUUID
    });
  }
}
