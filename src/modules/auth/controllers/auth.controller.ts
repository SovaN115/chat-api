import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignInDTO } from '../dto/sign-in.dto';
import { SignUpByPhoneDTO } from '../dto/sign-up-by-phone.dto';
import { SignUpByEmailDTO } from '../dto/sign-up-by-email.dto';
import { AccessTokenService } from '../services/access-token.service';
import { Request, Response } from 'express';
import { RefreshTokenService } from '../services/refresh-token.service';
import { AuthUserDTO } from '../dto/auth-user.dto';
import { TokenDataService } from '../services/token-data.service';
import { UserDataService } from '../services/user-data.service';
import { JWT } from '../jwt';
import { AuthUserDataService } from '../services/auth-user-data.service';
import { RoleEnum } from '../enums/role.enum';
import { ChatUserService } from 'src/chat/chat/services/chat-user/chat-user.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly tokenDataService: TokenDataService,
    private readonly userService: UserDataService,
    private readonly authUserDataService: AuthUserDataService,
    private readonly chatUserService: ChatUserService
  ) {}

  @Post('sign-in')
  async signIn(@Body() body: SignInDTO, @Res({passthrough: true}) response: Response) {
    console.log(body)
    const user = await this.authService.signIn(body.login, body.password);

    const payload = {
      authUserUUID: user.uuid,
      userUUID: user.user.uuid,
      roles: user.roles
    }

    const refreshToken: string = this.refreshTokenService.generate(payload);

    response.cookie(
      "jwt",
      refreshToken,
      {httpOnly: true}
    );

    await this.tokenDataService.createTokenOnAuthUser(user, refreshToken);

    return {
      token: this.accessTokenService.generate(payload)
    }
  }

  @Post('sign-up-by-phone')
  async signUpByPhone(@Body() body: SignUpByPhoneDTO, @Res({passthrough: true}) response: Response) {
    console.log(body)
    const authUser = await this.authService.signUp(body.phone, body.password);

    const user = await this.userService.create({...body, authUserUUID: authUser.uuid});

    const payload = {
      authUserUUID: user.authUser.uuid,
      userUUID: user.uuid,
      roles: user.authUser.roles
    }

    const refreshToken: string = this.refreshTokenService.generate(payload);

    response.cookie(
      "jwt",
      refreshToken,
      {httpOnly: true}
    );

    await this.tokenDataService.createTokenOnAuthUser(authUser, refreshToken);

    return {
      token: this.accessTokenService.generate(payload)
    }
  }

  @Post('sign-up-by-email')
  async signUpByEmail(@Body() body: SignUpByEmailDTO, @Res({passthrough: true}) response: Response) {
    const authUser = await this.authService.signUp(body.email, body.password);

    const user = await this.userService.create({...body, authUserUUID: authUser.uuid});

    const payload = {
      authUserUUID: user.authUser.uuid,
      userUUID: user.uuid,
      roles: user.authUser.roles
    }

    const refreshToken: string = this.refreshTokenService.generate(payload);

    response.cookie(
      "jwt",
      refreshToken,
      {httpOnly: true}
    );

    await this.tokenDataService.createTokenOnAuthUser(authUser, refreshToken)

    return {
      token: this.accessTokenService.generate(payload)
    }
  }

  // @Post('sign-up-as-admin-by-email')
  // async signUpAsAdminByEmail(@Body() body: SignUpAsAdminByEmailDto, @Res({passthrough: true}) response: Response) {
  //   const authUser = await this.authService.signUp(body.email, body.password, [RoleEnum.Admin, RoleEnum.User]);
  //
  //   const instance = await this.instanceService.create({
  //     name: body.instanceName
  //   });
  //
  //   await this.userService.create({...body, authUserUUID: authUser.uuid, instanceUUID: instance.uuid});
  //
  //   const refreshToken: string = this.refreshTokenService.generate({
  //     uuid: authUser.uuid
  //   });
  //
  //   response.cookie(
  //     "jwt",
  //     refreshToken,
  //     {httpOnly: true}
  //   );
  //
  //   await this.tokenDataService.createTokenOnAuthUser(authUser, refreshToken);
  //
  //   return {
  //     token: this.accessTokenService.generate({
  //       uuid: authUser.uuid
  //     })
  //   }
  // }
  //
  // @Post('sign-up-as-admin-by-phone')
  // async signUpAsAdminByPhone(@Body() body: SignUpAsAdminByPhoneDto, @Res({passthrough: true}) response: Response) {
  //   const authUser = await this.authService.signUp(body.phone, body.password, [RoleEnum.Admin, RoleEnum.User]);
  //
  //   const instance = await this.instanceService.create({
  //     name: body.instanceName
  //   });
  //
  //   console.log(instance)
  //
  //   const user = await this.userService.create({...body, authUserUUID: authUser.uuid, instanceUUID: instance.uuid});
  //
  //   const refreshToken: string = this.refreshTokenService.generate({
  //     uuid: authUser.uuid
  //   });
  //   response.cookie(
  //     "jwt",
  //     refreshToken,
  //     {httpOnly: true}
  //   );
  //
  //   await this.tokenDataService.createTokenOnAuthUser(authUser, refreshToken);
  //
  //   return {
  //     token: this.accessTokenService.generate({
  //       uuid: authUser.uuid
  //     })
  //   }
  // }

  @Post('logout')
  async logOut(@Body() body: AuthUserDTO, @Res({passthrough: true}) response: Response, @Req() request: Request) {
    response.clearCookie("jwt", {httpOnly: true});
    await this.authService.logOut(body.uuid);
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @Res({passthrough: true}) response: Response) {
    const refreshToken = request.cookies["jwt"];

    console.log(refreshToken);

    const valid = await this.refreshTokenService.verify(refreshToken);
    if(!valid) {
      throw new UnauthorizedException();
    }

    const payload = (this.refreshTokenService.decode(refreshToken) as JWT);
    const newPayload: JWT = {
      authUserUUID: payload.authUserUUID,
      userUUID: payload.userUUID,
      roles: payload.roles
    }
    const newRefreshToken: string = this.refreshTokenService.generate(newPayload);

    response.cookie(
      "jwt",
      refreshToken,
      {httpOnly: true}
    );

    const authUser = await this.authUserDataService.getAuthUserByUUID(payload.authUserUUID);
    await this.tokenDataService.createTokenOnAuthUser(authUser, newRefreshToken)

    return {
      token: this.accessTokenService.generate(newPayload)
    }

  }

  @Post('sign-up-admin-by-email')
  async signAdminUpByEmail(@Body() body: SignUpByEmailDTO, @Res({passthrough: true}) response: Response) {
    const authUser = await this.authService.signUp(body.email, body.password, RoleEnum.SuperAdmin);

    const user = await this.userService.create({...body, authUserUUID: authUser.uuid});
    const chatUser = await this.chatUserService.create(user.uuid);

    const payload = {
      authUserUUID: user.authUser.uuid,
      userUUID: user.uuid,
      roles: user.authUser.roles
    }

    const refreshToken: string = this.refreshTokenService.generate(payload);

    response.cookie(
      "jwt",
      refreshToken,
      {httpOnly: true}
    );

    await this.tokenDataService.createTokenOnAuthUser(authUser, refreshToken)

    return {
      token: this.accessTokenService.generate(payload)
    }
  }
}
