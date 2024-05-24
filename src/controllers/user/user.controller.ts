import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AccessTokenService } from 'src/modules/auth/services/access-token.service';
import { UserService } from 'src/services/user/user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly accessTokenService: AccessTokenService,
    ) {}

    @Get('user')
    async getUser(
        @Req() req: Request
    ) {
        const jwt = this.accessTokenService.getTokenFromHeader(req);
        console.log(jwt)
        return await this.userService.getUser(jwt.userUUID);
    }

    @Get('users')
    async getUsers(
        @Req() req: Request
    ) {
        // const jwt = this.accessTokenService.getTokenFromHeader(req);
        // console.log(jwt)
        return await this.userService.getUsers();
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
