import { Body, Controller, HttpCode, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { SignInDTO } from "../dto/sign-in.dto";
import { SignUpByPhoneDTO } from "../dto/sign-up-by-phone.dto";
import { SignUpByEmailDTO } from "../dto/sign-up-by-email.dto";
import { AccessTokenService } from "../services/access-token.service";
import { Request, Response } from "express";
import { RefreshTokenService } from "../services/refresh-token.service";
import { AuthUserDTO } from "../dto/auth-user.dto";
import { TokenDataService } from "../services/token-data.service";
import {UserDataService} from "../services/user-data.service";

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private  readonly tokenDataService: TokenDataService,
    private readonly userService: UserDataService
  ) {

  }
  @Post('signIn')
  async signIn(@Body() body: SignInDTO, @Res({passthrough: true}) response: Response) {
    const user = await this.authService.signIn(body.login, body.password);
    const refreshToken: string = this.refreshTokenService.generate({
      uuid: user.uuid
    });
    response.cookie(
      "jwt",
      this.refreshTokenService.generate({
        uuid: user.uuid
      }),
      {httpOnly: true}
    );
    await this.tokenDataService.createTokenOnAuthUser(user, refreshToken);
    return {token: this.accessTokenService.generate({uuid: user.uuid})}
  }

  @Post('signUpByPhone')
  async signUpByPhone(@Body() body: SignUpByPhoneDTO, @Res({passthrough: true}) response: Response) {
    const user = await this.authService.signUp(body.phone, body.password);
    await this.userService.create({...body, authUserUUID: user.uuid});

    const refreshToken: string = this.refreshTokenService.generate({
      uuid: user.uuid
    });

    response.cookie(
      "jwt",
      refreshToken,
      {httpOnly: true}
    );

    await this.tokenDataService.createTokenOnAuthUser(user, refreshToken);
    return {
      token: this.accessTokenService.generate({
        uuid: user.uuid
      })
    }
  }

  @Post('signUpByEmail')
  async signUpByEmail(@Body() body: SignUpByEmailDTO, @Res({passthrough: true}) response: Response) {
    const user = await this.authService.signUp(body.email, body.password);
    await this.userService.create({...body, authUserUUID: user.uuid});

    const refreshToken: string = this.refreshTokenService.generate({
      uuid: user.uuid
    });
    response.cookie(
      "jwt",
      refreshToken,
      {httpOnly: true}
    );
    await this.tokenDataService.createTokenOnAuthUser(user, refreshToken)
    return {
      token: this.accessTokenService.generate({
        uuid: user.uuid
      })
    }
  }

  @Post('logOut')
   async logOut(@Body() body: AuthUserDTO, @Res({passthrough: true}) response: Response, @Req() request: Request) {
      response.clearCookie("jwt", {httpOnly: true});
      await this.authService.logOut(body.uuid);
   }
  @Post('refresh')
  async refresh(@Req() request: Request) {
    const refreshToken = request.cookies["jwt"];
    return {
      token: await this.authService.refresh(refreshToken)
    }
  }
}
