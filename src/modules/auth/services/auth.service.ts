import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUserDataService } from './auth-user-data.service';
import { AuthUser } from '../entities/auth-user.entity';
import * as argon2 from 'argon2';
import { TokenDataService } from './token-data.service';
import { RefreshTokenService } from './refresh-token.service';
import { AccessTokenService } from './access-token.service';
import { JwtPayload } from 'jsonwebtoken';
import { RoleDataService } from './role-data.service';
import { RoleEnum } from '../enums/role.enum';
import { JWT } from '../jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly authUserDataService: AuthUserDataService,
    private readonly tokenDataService: TokenDataService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly accessTokenService: AccessTokenService,
    private readonly roleDataService: RoleDataService
  ) {}

  async signUp(login: string, password: string, role: RoleEnum[] | RoleEnum = RoleEnum.User) {
    const potentialUser: AuthUser | null = await this.authUserDataService.getAuthUserByLogin(login);

    if(potentialUser) {
      throw new Error("Пользователь уже существует");
    }

    const newAuthUser = new AuthUser();

    newAuthUser.login = login;
    newAuthUser.password = await argon2.hash(password);
    newAuthUser.roles = await this.roleDataService.getRoleByRoleName(role);

    return await this.authUserDataService.authUserRepo.save(newAuthUser);
  }

  async signIn(login: string, password: string) {
    const authUser: AuthUser | null = await this.authUserDataService.getAuthUserByLogin(login);

    if(!authUser) {
      throw new BadRequestException("Пользователя с таким логином не существует");
    }

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
    const jwt: JWT = (this.refreshTokenService.decode(refreshToken) as JWT);
    return this.accessTokenService.generate(jwt);
  }
}
