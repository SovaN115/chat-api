import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenService } from 'src/modules/auth/services/access-token.service';
import { RefreshTokenService } from 'src/modules/auth/services/refresh-token.service';
import { UserService } from 'src/services/user/user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly accessTokenService: AccessTokenService,
        private readonly refreshTokenService: RefreshTokenService,
    ) {}

    @Get('user')
    async getUser(
        @Req() req: Request
    ) {
        //@ts-ignore
        const jwt = this.accessTokenService.getTokenFromHeader(req);
        // const refreshToken = req.cookies["jwt"];
        // const data = this.refreshTokenService.decode(refreshToken);
        // //@ts-ignore
        // console.log(data.exp)
        // //@ts-ignore
        // const endTime = new Date(data.exp)
        // console.log(`смерть куки в ${endTime}`)
        // console.log(`смерть куки в ${endTime}`)
        
        return await this.userService.getUser(jwt.userUUID);
    }

    @Post('users')
    async getUsers(
        @Body() body: {withDeleted: boolean},
        @Req() req: Request
    ) {
        // const jwt = this.accessTokenService.getTokenFromHeader(req);
        // console.log(jwt)
        return await this.userService.getUsers(body.withDeleted);
    }

    @Post('edit-user')
    async editUser(
        @Body() body: any
    ) {
        // const jwt = this.accessTokenService.getTokenFromHeader(req);
        // console.log(jwt)
        console.log(body)
        return await this.userService.editUser(body);
    }
}
