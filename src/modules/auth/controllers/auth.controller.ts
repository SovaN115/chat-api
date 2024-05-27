import { Body, Controller, Headers, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
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
import * as useragent from 'useragent';

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
  async signIn(@Headers('User-Agent') userAgent: string, @Body() body: SignInDTO, @Res({passthrough: true}) response: Response) {
    console.log('useragent', userAgent)
    const agent = useragent.parse(userAgent);
    console.log(agent.os);
    console.log(agent.family);
    console.log(agent.major);
    console.log(agent.minor);
    console.log(agent.patch);
    console.log(agent.source);
    console.log(agent.toAgent());
    console.log(agent.toJSON());
    console.log(agent.toString());
    console.log(agent.toVersion());
    const user = await this.authService.signIn(body.login, body.password);

    const payload = {
      authUserUUID: user.uuid,
      userUUID: user.user.uuid,
      roles: user.roles
    }

    const tokenInfo = await this.tokenDataService.createTokenOnAuthUser(user, agent.os.family, agent.family);

    const payloadRefresh = {
      authUserUUID: user.uuid,
      userUUID: user.user.uuid,
      roles: user.roles,
      tokenUUID: tokenInfo.uuid
    }

    const refreshToken: string = this.refreshTokenService.generate(payloadRefresh);
    // const data = this.refreshTokenService.decode(refreshToken);
    // console.log(data)
    // //@ts-ignore
    // const endTime = new Date(data.exp)
    // console.log(`смерть куки в ${endTime}`)
    // //@ts-ignore
    // payload.death = refreshToken

    const now = new Date;
    const ms = now.getTime() + 1000 * 3600 * 24 * 30;
    const time = new Date(ms);
    console.log('time', time)

    response.cookie(
      "jwt",
      refreshToken,
      {
        httpOnly: true,
        expires: time
      }
    );

    return {
      token: this.accessTokenService.generate(payload)
    }
  }

  @Post('sign-up-by-phone')
  async signUpByPhone(@Headers('User-Agent') userAgent: string, @Body() body: SignUpByPhoneDTO, @Res({passthrough: true}) response: Response) {
    console.log(body)
    const agent = useragent.parse(userAgent);
    const authUser = await this.authService.signUp(body.phone, body.password);

    const user = await this.userService.create({...body, authUserUUID: authUser.uuid});

    const payload = {
      authUserUUID: user.authUser.uuid,
      userUUID: user.uuid,
      roles: user.authUser.roles
    }

    const tokenInfo = await this.tokenDataService.createTokenOnAuthUser(user.authUser, agent.os.family, agent.family);

    const payloadRefresh = {
      authUserUUID: user.authUser.uuid,
      userUUID: user.uuid,
      roles: user.authUser.roles,
      tokenUUID: tokenInfo.uuid
    }

    const refreshToken: string = this.refreshTokenService.generate(payloadRefresh);

    const now = new Date;
    const ms = now.getTime() + 1000 * 3600 * 24 * 30;
    const time = new Date(ms);
    console.log('time', time)

    response.cookie(
      "jwt",
      refreshToken,
      {
        httpOnly: true,
        expires: time
      }
    );

    await this.tokenDataService.createTokenOnAuthUser(authUser, agent.os.family, agent.family);

    return {
      token: this.accessTokenService.generate(payload)
    }
  }

  @Post('sign-up-by-email')
  async signUpByEmail(@Headers('User-Agent') userAgent: string, @Body() body: SignUpByEmailDTO, @Res({passthrough: true}) response: Response) {
    const agent = useragent.parse(userAgent);
    const authUser = await this.authService.signUp(body.email, body.password);

    const user = await this.userService.create({...body, authUserUUID: authUser.uuid});

    const payload = {
      authUserUUID: user.authUser.uuid,
      userUUID: user.uuid,
      roles: user.authUser.roles
    }

    const tokenInfo = await this.tokenDataService.createTokenOnAuthUser(user.authUser, agent.os.family, agent.family);

    const payloadRefresh = {
      authUserUUID: user.authUser.uuid,
      userUUID: user.uuid,
      roles: user.authUser.roles,
      tokenUUID: tokenInfo.uuid
    }

    const refreshToken: string = this.refreshTokenService.generate(payloadRefresh);

    const now = new Date;
    const ms = now.getTime() + 1000 * 3600 * 24 * 30;
    const time = new Date(ms);
    console.log('time', time)

    response.cookie(
      "jwt",
      refreshToken,
      {
        httpOnly: true,
        expires: time
      }
    );

    await this.tokenDataService.createTokenOnAuthUser(authUser, agent.os.family, agent.family)

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
    const refreshToken = request.cookies["jwt"];
    const payload = this.refreshTokenService.getPayload(refreshToken);
    console.log('LOGOUT')
    console.log(payload)
    await this.authService.logOut(payload.tokenUUID);
    response.clearCookie("jwt", {httpOnly: true});
  }

  @Post('refresh')
  async refresh(@Headers('User-Agent') userAgent: string, @Req() request: Request, @Res({passthrough: true}) response: Response) {
    const agent = useragent.parse(userAgent);
    const refreshToken = request.cookies["jwt"];
    
    console.log(refreshToken)

    const valid = await this.refreshTokenService.verify(refreshToken);
    // const isActive = await this.tokenDataService.getTokenByTokenUUID(refreshToken.tokenUUID);
    if(!valid) {
      throw new UnauthorizedException();
    }

    const payload = (this.refreshTokenService.decode(refreshToken) as any);
    const newPayload: JWT = {
      authUserUUID: payload.authUserUUID,
      userUUID: payload.userUUID,
      roles: payload.roles,
    }

    const authUser = await this.authUserDataService.getAuthUserByUUID(payload.authUserUUID);
    await this.tokenDataService.deleteTokenByTokenUUID(payload.tokenUUID);
    const tokenInfo = await this.tokenDataService.createTokenOnAuthUser(authUser, agent.os.family, agent.family);

    const newPayloadRefresh: any = {
      authUserUUID: payload.authUserUUID,
      userUUID: payload.userUUID,
      roles: payload.roles,
      tokenUUID: tokenInfo.uuid
    }

    const newRefreshToken: string = this.refreshTokenService.generate(newPayloadRefresh);

    const now = new Date;
    const ms = now.getTime() + 1000 * 3600 * 24 * 30;
    const time = new Date(ms);
    console.log('time', time)

    response.cookie(
      "jwt",
      newRefreshToken,
      {
        httpOnly: true,
        expires: time
      }
    );

    return {
      token: this.accessTokenService.generate(newPayload)
    }

  }

  @Post('sign-up-admin-by-email')
  async signAdminUpByEmail(@Headers('User-Agent') userAgent: string, @Body() body: SignUpByEmailDTO, @Res({passthrough: true}) response: Response) {
    const agent = useragent.parse(userAgent);
    const authUser = await this.authService.signUp(body.email, body.password, RoleEnum.SuperAdmin);

    const user = await this.userService.create({...body, authUserUUID: authUser.uuid});
    const chatUser = await this.chatUserService.create(user.uuid);

    const payload = {
      authUserUUID: user.authUser.uuid,
      userUUID: user.uuid,
      roles: user.authUser.roles
    }

    const tokenInfo = await this.tokenDataService.createTokenOnAuthUser(user.authUser, agent.os.family, agent.family);

    const payloadRefresh = {
      authUserUUID: user.authUser.uuid,
      userUUID: user.uuid,
      roles: user.authUser.roles,
      tokenUUID: tokenInfo.uuid
    }

    const refreshToken: string = this.refreshTokenService.generate(payloadRefresh);
    // const data = this.refreshTokenService.decode(refreshToken);
    // console.log(data)
    // //@ts-ignore
    // const endTime = new Date(data.exp)
    // console.log(`смерть куки в ${endTime}`)
    // //@ts-ignore
    // payload.death = endTime
    const now = new Date;
    const ms = now.getTime() + 1000 * 3600 * 24 * 30;
    const time = new Date(ms);
    console.log('time', time)

    response.cookie(
      "jwt",
      refreshToken,
      {
        httpOnly: true,
        expires: time
      }
    );

    await this.tokenDataService.createTokenOnAuthUser(authUser, agent.os.family, agent.family)

    return {
      token: this.accessTokenService.generate(payload)
    }
  }
}
